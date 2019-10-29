<template>
  <div class="dh-wizzard-step dh-two-factor" v-if="!isMethodSubmited">
    <div class="dh-wizzard-step-body">
      Two factor authorization is enabled on your account, please choose 2FA source <br>
      <div class="dh-two-factor-radio-list">
        <el-radio v-model="twoFAMethod" label="1" :disabled="!twoFAmethods[1]">SMS</el-radio><br>
        <el-radio v-model="twoFAMethod" label="3" :disabled="!twoFAmethods[3]">Application</el-radio><br>
        <el-radio v-model="twoFAMethod" label="2" :disabled="!twoFAmethods[2]">Backup code</el-radio>
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button" :disabled="!twoFAMethod" @click="isMethodSubmited = true">Choose</button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-two-factor" v-else>
    <div class="dh-wizzard-step-body">
      {{twoFAMethod == 2 ? 'You should already have pre-generated backup codes, please pick one that you haven\'t used before' : 'You should receive a verification code in a minute'}}
      <input placeholder="Verification Code" v-model="twoFACode" class="dh-input" @input="error = null" :maxlength="twoFAMethod == 2 ? 8 : 6" :disabled="false">
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <button
        :class="{ 'dh-button': true, 'dh-loading': sending }"
        :disabled="!twoFACode"
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
      isMethodSubmited: false,
      sending: false,
      error: null,
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
}

</style>