<template>
<div class="dh-wizzard-step dh-two-factor" v-if="hasNotCodeInfo">
    <div class="dh-wizzard-step-body">
      <ul>
        <li>open Instagram app</li>
        <li>go to settings</li>
        <li>choose “Security”, then “Two-Factor Authentication”</li>
        <li>select “Backup Codes”</li>
        <li>click “Regenerate codes”</li>
      </ul>
      Then just take a code from the list. Each code can only be used once. Be sure to save the rest of codes in a secure place.
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" @click="toggleHelp">Back</button>
      <button class="dh-button" @click="toggleHelp">I got the code</button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-two-factor" v-else>
    <div class="dh-wizzard-step-body">
      Two factor authorization is enabled on your account, you should know where do you get the code<br>
      <div class="dh-two-factor-radio-list">
        <el-radio v-model="twoFAMethod" :label="1" :disabled="!twoFAmethods[1]">I just got an SMS from Instagram with a code</el-radio><br>
        <el-radio v-model="twoFAMethod" :label="3" :disabled="!twoFAmethods[3]">I'm using an application (Authy / Googe Authenticator / etc.)</el-radio><br>
        <el-radio v-model="twoFAMethod" :label="2" :disabled="!twoFAmethods[2]">I have a pre-generated backup code that I haven't used before</el-radio>
      </div><br/>
      Please enter the code below:
      <input placeholder="Verification Code" v-model="twoFACode" class="dh-input" @input="error = null" :maxlength="twoFAMethod == 2 ? 8 : 6" :disabled="false">
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <button
        :class="{ 'dh-button': true, 'dh-reset-button': true,'dh-loading': sending }"
        :disabled="sending"
        @click="toggleHelp">
         I don’t have the code
      </button>
      <button
        :class="{ 'dh-button': true, 'dh-loading': sending }"
        :disabled="!twoFACode || !twoFAMethod"
        @click="verifyCode">
        Verify
      </button>
      <!-- :disabled="twoFAMethod == 2 ? twoFACode.length < 8 : twoFACode.length < 6 || sending" -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      twoFACode: '',
      twoFAMethod: null,
      sending: false,
      error: null,
      hasNotCodeInfo: false,
    }
  },

  props: ['account', 'protocol'],

  computed: {
    twoFAmethods() {
      const  { twoFactorMethodList } = this.account.twoFactor;

      return twoFactorMethodList
    }
  },

  methods: {
    verifyCode() {
      const { account, twoFACode, twoFAMethod, protocol } = this;

      this.sending = true;
      this.error = null;

      account.twoFactor.verificationCode = twoFACode;
      account.twoFactor.twoFactorMethod = twoFAMethod;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/2fa/code/verify`,
        method: 'post',
        data: {
          account
        }
      }).then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;

        this.sending = false;

        if (!request.success) {
          this.error = request.statusMessage;
        } else if (account.igErrorMessage) {
          this.error = account.igErrorMessage;
        }

        this.$emit('set-account', account);
      }).catch(error => {
        const { request } = error.response.data;

        if (request) {
          const { statusMessage } = request;

          this.error = statusMessage;
        } else {
          this.error = "Server connection problem, try again";
        }

        this.sending = false;
      })
    },

    toggleHelp() {
      this.hasNotCodeInfo = !this.hasNotCodeInfo;

      if (this.hasNotCodeInfo) {
        this.$emit('set-title', 'Get 2fa code')
      } else {
        this.$emit('set-title', 'Two factor authorization')
      }
    }
  }
}
</script>

<style lang="scss">
.dh-two-factor {
  .dh-two-factor-radio-list {
    margin-top: 10px;

    .el-radio {
      margin-top: 5px;
    }
  }

  .dh-input {
    margin-top: 20px;
    width: 100%;
  }

  .el-dialog__footer {
    justify-content: space-between !important;
  }
}

</style>