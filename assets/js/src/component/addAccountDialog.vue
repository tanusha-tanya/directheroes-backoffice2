<template>
  <el-dialog
    :visible.sync="addAcountState"
    class="add-account-dialog"
    title="Add new Instagram Account"
    width="321px"
    append-to-body
    :show-close="false"
    >
    <div class="step">
      <div class="step-info">
        <div class="step-number">
          1
        </div>
        <div class="step-description">
          Download and run our proxy tool to connect your account.
        </div>
      </div>
      <div class="download-buttons">
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=win`">
          <img src="../assets/svg/windows.svg"/>
          Download for Windows
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=mac`">
          <img src="../assets/svg/apple.svg"/>
          Download for Mac
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=mac`">
          <img src="../assets/svg/ubuntu.svg"/>
          Download for Linux
        </a>
      </div>
    </div>
    <div class="step">
      <div class="step-info">
        <div class="step-number">
          2
        </div>
        <div class="step-description">
          Connect to server by proxy tool and wait green light.
        </div>
      </div>
      <div class="status-block" v-if="proxyStatus">
        <div class="status-indicator success"></div> Proxy tool is running
      </div>
      <div class="status-block" v-else>
        <div class="status-indicator"></div> Proxy tool not connected
      </div>
    </div>
    <div :class="{step: true, disabled: twoFactor || !proxyStatus}">
      <div class="step-info">
        <div class="step-number">
          3
        </div>
        <div class="step-description">
          Enter Instagram credentials.
        </div>
      </div>
      <input placeholder="Instagram Username" v-model="account.login" :disabled="accountAuth" @input="error = null">
      <input placeholder="Instagram Password" v-model="account.password" type="password" @input="error = null">
      <div class="error" v-if="error && !twoFactor">{{ error }}</div>
      <button :class="{ loading: loading && !twoFactor }" :disabled="loading || !account.login || !account.password" @click="actionAccount">Connect Account</button>
    </div>
    <div class="step" v-if="twoFactor">
      <div class="step-info">
        <div class="step-number">
          4
        </div>
        <div class="step-description">
          Two factor authorization is enabled on your account, you should receive an SMS with verification code in a minute
        </div>
      </div>
      <input placeholder="Verification Code" v-model="code" @input="error = null" maxlength="6" :disabled="loading">
      <div class="error" v-if="error">{{ error }}</div>
      <div class="step-verify">
        <button :class="{ loading: loading && !isResendCode }" :disabled="code.length < 6 || loading" @click="checkTFCode">Verify</button>
        <button :class="{ resend: true, loading: loading && isResendCode }" :disabled="loading" @click="resendTFCode">Re-send</button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      checkingInterval: null,
      proxyStatus: false,
      account: {
        login: '',
        password: '',
      },
      error: null,
      loading: false,
      code: '',
      isResendCode: false
    }
  },

  props: ['isAddAccount', 'accountAuth'],

  computed: {
    addAcountState: {
      get() {
        return this.isAddAccount
      },
      set(value) {
        this.$emit('close-dialog', value)
      }
    },

    dh() {
      return dh;
    },

    twoFactor() {
      const { accountAuth } = this;

      return accountAuth && accountAuth.twoFactor
    },

    accountError() {
      const { accountAuth } = this;

      if (!accountAuth) return;

      if (!accountAuth.isPasswordValid) {
        return 'Your password seems to be invalid'
      } else if (accountAuth.igChallenge) {
        return 'Please open Instagram application and click "It was me" if prompted, then try connecting account again'
      } else if (accountAuth.isLoggedIn) {
        return 'Your account is logged out. Please start proxy tool, and then re-connect the account.'
      }
    }
  },

  methods: {
    checkConnection() {
      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/proxy-status`
      }).then(({ data }) => {
        this.proxyStatus = data.response.body.isProxyRunning
      })
    },

    actionAccount() {
      const { $store, accountAuth, account } = this;
      let request;

      this.loading = true;
      this.error = null;

      if (accountAuth) {
        accountAuth.password = account.password
        request = $store.dispatch('saveAccount', accountAuth)
      } else {
        request = $store.dispatch('addAccount', account)
      }

      request
        .then(({ data }) => {
          const { account } = data.response.body;
          this.loading = false;

          this.$emit('set-auth-account', account)

          if (account.igErrorMessage) {
            this.error = account.igErrorMessage.replace('InstagramAPI\\Response\\LoginResponse: ', '');
          }
          else if (accountError) {
            this.error = accountError;
          } else if (account.isLoggedIn && account.isPasswordValid) {
            this.$emit('close-dialog', false);
          }

        }).catch(error => {
          this.error = error.response.data.error || error.response.data.request.statusMessage;
          this.loading = false;
        })

      return request;
    },

    checkTFCode() {
      const { accountAuth, code, actionAccount } = this;

      accountAuth.twoFactor.verificationCode = code;

      actionAccount();
    },

    resendTFCode() {
      const { actionAccount } = this;

      this.isResendCode = true;

      actionAccount().then(() => {
        this.isResendCode = false;
      })
    }
  },

  watch: {
    isAddAccount(value) {
      const { accountAuth, proxyStatus, accountError } = this;

      if (value) {
        this.account.login = (accountAuth && accountAuth.login) || '';
        this.account.password = '';
        this.error = accountError;
        this.checkConnection();
        this.checkingInterval = setInterval(this.checkConnection.bind(this), proxyStatus ? 60000 : 2000)
      } else {
        this.error = null;
        this.code = '';
        clearInterval(this.checkingInterval)
      }
    },

    proxyStatus(value) {
      clearInterval(this.checkingInterval)

      this.checkingInterval = setInterval(this.checkConnection.bind(this), value ? 60000 : 2000)
    }
  }
}
</script>
<style lang="scss">
.add-account-dialog {
  .el-dialog {
    margin: 50px 0 0 auto !important;
    height: calc(100% - 50px);
    border-radius: 0;
    padding: 31px 39px;
    overflow: auto;

    // &.dialog-fade-enter-active {
    //   animation: none;
    // }

    // &.dialog-fade-enter-active {
    //   animation: none;
    // }

    .el-dialog__header, .el-dialog__body {
      padding: 0;
    }

    .el-dialog__title {
      font-size: 20px;
      color: #6A12CB;
    }

    .el-dialog__header {
      margin-bottom: 24px;
    }

    .step {
      color: #B6B6B6;
      font-size: 15px;

      &:not(:last-child) {
        margin-bottom: 37px;
      }

      &.disabled {
        pointer-events: none;
        opacity: .5;
      }
    }

    .step-info {
      display: flex;
    }

    .step-number {
      height: 27px;
      width: 27px;
      flex-shrink: 0;
      margin-right: 8px;
      border: 1px solid currentColor;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-description {
      margin-top: 6px;
    }

    .download-buttons {
      margin-top: 15px;

      a {
        display: flex;
        align-items: center;
        text-decoration: none;
        background-color: #F2F2F2;
        border-radius: 2px;
        padding: 7px 10px;
        color: inherit;
        margin-bottom: 10px;
      }

      img {
        margin-right: 9px;
        max-height: 16px;
      }
    }

    .status-block {
      margin-top: 15px;
      display: flex;
      align-items: center;
    }

    .status-indicator {
      height: 27px;
      width: 27px;
      background-color: #FF4D4D;
      border-radius: 20px;
      margin-right: 9px;

      &.success {
        background-color: #44B0A9;
      }
    }

    .step-verify {
      display: flex;

      .resend {
        background-color: transparent;
        color: #000;

        &.loading {
          color: transparent;

          &::before {
            border-color: #000 #000 transparent;
          }
        }
      }
    }

    input {
      margin-top: 10px;
      border-radius: 2px;
      width: 100%;

      &::placeholder {
        text-align: center;
        font-style: italic;
      }
    }

    .error {
      margin-top: 10px;
      color: #FF4D4D;
      text-align: center;
    }

    button {
      margin-top: 10px;
      width: 100%;
    }
  }
}
</style>
