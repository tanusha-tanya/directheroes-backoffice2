<template>
  <div class="dh-wizzard-step dh-challange" v-if="!codeSended">
    <div class="dh-wizzard-step-body">
      <div class="dh-wizzard-text">
        Instagram requires additional verification for this connection<br><br>
        Please, select send code variant:
        <div class="dh-wizzard-choose-code-variants" v-if="hasMoreOneVariants">
          <el-radio v-model="sendMethod" :label="0" >Phone: {{account.igChallenge.sendCodeVariants.phone_number}}</el-radio><br>
          <el-radio v-model="sendMethod" :label="1" >E-mail: {{account.igChallenge.sendCodeVariants.email}}</el-radio>
        </div>
      </div>
    </div>
    <div class="el-dialog__footer">
      <button :class="{'dh-button': true, 'dh-loading': sending}" :disabled="sending || !sendMethod" @click="sendCode">Request verification code</button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-challange-verify" v-else-if="noCodeInfo">
    <div class="dh-wizzard-step-body">
      <div class="dh-wizzard-text">
        I didn’t receive challenge code:<br><br>
        - Check older codes<br>
        - Log in to app and check "it was me"
      </div>
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <button :class="{'dh-button': true, 'dh-reset-button': true, 'dh-loading': sending }" :disabled="sending" @click="relogin">Start over</button>
      <button :disabled="sending" class="dh-button" @click="noCodeInfo = false">I have a code to try</button>
    </div>
  </div>
  <div class="dh-wizzard-step dh-challange-verify" v-else>
    <div class="dh-wizzard-step-body">
      <div class="dh-wizzard-text">
        {{challengeCodeMessage}}
        <input class="dh-input" type="text" @input="error = null" v-model="codeToVerify" placeholder="Verification code"/>
      </div>
      <div class="dh-wizzard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <button class="dh-button dh-reset-button" :disabled="sending" @click="noCodeInfo = true">I didn’t receive the code</button>
      <button :class="{'dh-button': true, 'dh-loading': sending}" :disabled="!codeToVerify || sending" @click="verifyCode">Verify code</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    const { account } = this;

    return {
      sending: false,
      sendMethod: null,
      codeSended: account.connectStep === "account.challenge.code_sent",
      codeToVerify: '',
      error: null,
      noCodeInfo: false
    }
  },

  props: ['account', 'protocol'],

  computed: {
    challengeCodeMessage() {
      const { email, phone_number } = this.account.igChallenge.sendCodeVariants;

      if (!email && !phone_number) return 'Please check your email or sms for your most recent 6-digit Instagram verification code and enter it below'

      return `Please check your ${ email ? 'email ('+email+')'  : '' }${ email && phone_number ? ' or '  : '' }${ phone_number ? 'sms ('+phone_number+')'  : '' } for your most recent 6-digit Instagram verification code and enter it below`
    },

    hasMoreOneVariants() {
      const { sendCodeVariants } = this.account.igChallenge;

      return Object.keys(sendCodeVariants).length > 1;
    }
  },

  methods: {
    sendCode() {
      const { account, protocol, sendMethod } = this;

      this.sending = true;

      account.igChallenge.sendMethod = sendMethod;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/challenge/code/request`,
        method: 'post',
        data: {
          account
        }
      }).then(({ data }) => {
        const { request, response } = data;
        const { account } = response.body;

        this.sending = false;
        this.codeSended = true;

        this.$emit('set-account', account);
      }).catch(error => {
        const { request } = error.response.data;

        if (request) {
          const { statusMessage } = request;

          this.error = statusMessage;
        } else {
          this.error = "Server connection problem, try again";
        }
      })
    },

    verifyCode() {
       const { account, codeToVerify, protocol } = this;

      this.sending = true;
      this.error = null;

      account.igChallenge.answer = codeToVerify;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ protocol }/challenge/code/verify`,
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

    relogin(event) {
      this.sending = true;
      this.$emit('re-login', (request) => {
        request.then(({ data }) => {
          const { request, response } = data;
          const { account } = response.body;

          if (!request.success) {
            this.error = request.statusMessage;
          } else if (account.igErrorMessage) {
            this.error = account.igErrorMessage;
          }

          this.sending = false;
          this.noCodeInfo = false;

          if (account.connectStep !== "account.challenge.code_sent") {
            this.codeSended = false;
          }
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
      })
    }
  },

  watch: {
    noCodeInfo() {
      this.error = null;
    },
    codeSended() {
      this.error = null;
    }
  }
}
</script>

<style lang="scss">
.dh-challange-verify {
  .el-dialog__footer {
    justify-content: space-between !important;
  }

  .dh-input {
    margin-top: 20px;
    width: 100%;
  }
}
</style>