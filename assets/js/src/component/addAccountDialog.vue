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
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=linux`">
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
      <div class="status-block" v-else-if="proxyStatus == null">
        <div class="status-indicator draft"></div> Proxy tool checking connection
      </div>
      <div class="status-block" v-else>
        <div class="status-indicator"></div> Proxy tool not connected
      </div>
      <div class="app-warning" v-if="oldVersion">
        <img :src="triangle"/> Your app version is outdated.<br />Please, download latest version, if you have connectivity issues.
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
      <input placeholder="Instagram Username" v-model="account.login" :disabled="accountAuth" @input="error = null" autocomplete="new-password">
      <input placeholder="Instagram Password" v-model="account.password" type="password" @input="error = null" autocomplete="new-password">
      <div class="error" v-if="error && !twoFactor">{{ error }}</div>
      <div class="challenge-notices" v-if="challenge">
        <div class="notice-item">
          <strong>1.</strong><span>Please open the Instagram app and click "it was me" button; refresh your news feed couple times if you don't see this message</span>
        </div>
        <div class="notice-item">
          <strong>2.</strong><span>Make sure you are following those requirements:</span>
          <div class="notice-list-item">you are not using VPN on your computer</div>
          <div class="notice-list-item">you have the Instagram account you are looking to connect in Instagram app on your phone</div>
          <div class="notice-list-item">the IP address of your computer and your phone is the same, you can check it by visiting <a href="https://www.myip.com/">www.myip.com</a>  on both devices</div>
        </div>
        <div class="notice-item">
          <strong>3.</strong><span>If any of above requirements is not met, then please correct it and try again</span>
        </div>
        <div class="notice-item">
          <strong>4.</strong><span>If all the requirements are met, then please try connecting again, but this time choose "Mobile Network" method in the <strong>Proxy Tool</strong></span>
        </div>
      </div>
      <button :class="{ loading: loading && !twoFactor }" :disabled="loading || !account.login || !account.password" @click="actionAccount">Connect Account</button>
    </div>
    <template v-if="twoFactor && twoFAMethodChoose">
      <div class="step">
        <div class="step-info">
          <div class="step-number">
            4
          </div>
          <div class="step-description">
            Two factor authorization is enabled on your account, please choose 2FA source
          </div>
        </div>
        <div class="step-elements">
          <el-radio v-model="selected2FAMethod" label="1" :disabled="!twoFactor.twoFactorMethod.includes(1)">SMS</el-radio>
          <el-radio v-model="selected2FAMethod" label="3" :disabled="!twoFactor.twoFactorMethod.includes(3)">Application</el-radio>
          <el-radio v-model="selected2FAMethod" label="2">Backup code</el-radio>
        </div>
        <div class="step-verify">
          <button @click="twoFAMethodChoose=false">Choose</button>
        </div>
      </div>
    </template>
    <template v-else-if="twoFactor && !twoFAMethodChoose">
      <div class="step">
        <div class="step-info">
          <div class="step-number">
            4
          </div>
          <div class="step-description">
            {{selected2FAMethod == 2 ? 'You should already have pre-generated backup codes, please pick one that you haven\'t used before' : 'You should receive a verification code in a minute'}}
          </div>
        </div>
        <input placeholder="Verification Code" v-model="code" @input="error = null" :maxlength="selected2FAMethod == 2 ? 8 : 6" :disabled="loading">
        <div class="error" v-if="error">{{ error }}</div>
        <div class="step-verify">
          <button :class="{ loading: loading && !isResendCode }" :disabled="selected2FAMethod == 2 ? code.length < 8 : code.length < 6 || loading" @click="checkTFCode">Verify</button>
          <button v-if="selected2FAMethod != 2" :class="{ resend: true, loading: loading && isResendCode }" :disabled="loading" @click="resendTFCode">Re-send</button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import triangle from '../assets/triangle.svg'
import axios from 'axios';
import sodium from 'libsodium-wrappers'

export default {
  data() {
    return {
      oldVersion: false,
      checkingTimeout: null,
      proxyStatus: null,
      account: {
        login: '',
        password: '',
      },
      error: null,
      loading: false,
      code: '',
      twoFAMethodChoose: true,
      selected2FAMethod: null,
      isResendCode: false,
      triangle
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

    challenge() {
      const { accountAuth } = this;

      return accountAuth && accountAuth.igChallenge
    },
  },

  methods: {
    checkConnection() {
      if (!this.isAddAccount) return;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/proxy-status`
      }).then(({ data }) => {
        this.proxyStatus = data.response.body.isProxyRunning
        this.oldVersion = data.response.body.isAppOutdated

        this.checkingTimeout = setTimeout(this.checkConnection.bind(this), this.proxyStatus ? 60000 : 2000)
      }).catch(() => {
        this.checkingTimeout = setTimeout(this.checkConnection.bind(this), this.proxyStatus ? 60000 : 2000)
      })
    },

    accountError(account) {
      account = account || this.accountAuth;

      if (!account) return;

      if (account.igErrorMessage) {
        return account.igErrorMessage.replace('InstagramAPI\\Response\\LoginResponse: ', '');
      } else if (!account.isPasswordValid) {
        return 'Your password seems to be invalid'
      } else if (account.igChallenge) {
        return 'Instagram rejected the log in attempt'
      } else if (account.twoFactor && accountAuth.twoFactor.verificationCode) {
        delete account.twoFactor.verificationCode;

        return 'The code was rejected by Instagram. Please try again, or contact support if problem persists.'
      } else if (!account.isLoggedIn) {
        return 'Your account is logged out. Please start proxy tool, and then re-connect the account.'
      }
    },

    actionAccount() {
      const { $store, accountAuth, account, selected2FAMethod } = this;
      let publicKey = null;

      Object.keys(sodium.base64_variants).some(variant => {
        try {
          publicKey = sodium.from_base64(this.dhAccount.publicKey, sodium.base64_variants[variant]);
          return true;
        } catch (error) {
          return false
        }
      })

      const cryptedPassword = sodium.to_base64(sodium.crypto_box_seal(account.password, publicKey), 1);
      let request;

      this.loading = true;
      this.error = null;

      if (accountAuth) {
        accountAuth.password = cryptedPassword;

        if (accountAuth.twoFactor) {
          accountAuth.twoFactor.twoFactorMethod = selected2FAMethod;
        }

        request = $store.dispatch('saveAccount', accountAuth)
      } else {
        request = $store.dispatch('addAccount', { ...account, password: cryptedPassword })
      }

      request
        .then(({ data }) => {
          const { accountError } = this;
          const { account } = data.response.body;
          const error = accountError(account);
          this.loading = false;

          this.$emit('set-auth-account', account)

          if (error) {
            this.error = error;
          } else if (account.isLoggedIn && account.isPasswordValid) {
            this.$emit('close-dialog', false);
          }

        }).catch( ({ response }) => {
          this.loading = false;

          if (response) {
            const { data } = response;

            if (data.request) {
              this.error = data.request.statusMessage
            } else if (data.error) {
              this.error = data.error
            } else {
              this.error = "Server connection problem, try again"
            }
          } else {
            this.error = "Server connection problem, try again"
          }
        })

      return request;
    },

    checkTFCode() {
      const { accountAuth, code, actionAccount } = this;

      accountAuth.twoFactor.verificationCode = code;

      actionAccount();
    },

    resendTFCode() {
      const { actionAccount, accountAuth, selected2FAMethod } = this;

      this.isResendCode = true;

      accountAuth.twoFactor = { twoFactorMethod: selected2FAMethod };

      actionAccount().then(() => {
        this.isResendCode = false;
      })
    },

    // setTwoFactorMethod() {
    //   const { selected2FAMethod, twoFactor, accountAuth, resendTFCode } = this;
    //   const { twoFactorMethod } = twoFactor;
    //   const isEqualMethods = selected2FAMethod == twoFactorMethod;

    //   if (isEqualMethods || selected2FAMethod == 3) {
    //     this.twoFAMethodChoose = false;
    //   } else {
    //     resendTFCode()
    //   }
    // }
  },

  created() {
    document.body.classList.add('no-overlay')
  },

  destroyed() {
    document.body.classList.remove('no-overlay')
  },

  watch: {
    isAddAccount(value) {
      const { accountAuth, proxyStatus, accountError } = this;

      if (value) {
        this.account.login = (accountAuth && accountAuth.login) || '';
        this.account.password = '';

        if (accountAuth && accountAuth.twoFactor && accountAuth.twoFactor.verificationCode) {
          delete accountAuth.twoFactor.verificationCode;
        }

        this.error = accountError();

        this.checkConnection();
      } else {
        this.error = null;
        this.code = '';
        this.twoFAMethodChoose = true;
        this.selected2FAMethod = null;

        clearTimeout(this.checkingTimeout)
      }
    },

    // proxyStatus(value) {
    //   clearInterval(this.checkingTimeout)

    //   this.checkingTimeout = setInterval(this.checkConnection.bind(this), value ? 60000 : 2000)
    // }
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
      word-break: break-word !important;
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

    .challenge-notices {
      margin-top: 10px;
      color: #2c3e50;
    }

    .notice-item {
      margin-bottom: 5px;
      & > strong {
        margin-right: 5px;
      }

      .notice-list-item:before {
        content: '-';
        margin-right: 3px;
      }
    }

    .step-description {
      margin-top: 6px;
    }

    .step-elements {
      display: flex;
      flex-direction: column;

      padding: 10px 35px;

      .el-radio {
        margin: 5px 0;
        & + .el-radio {
          margin-left: 0;
        }
      }
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

      &.draft {
        background-color: #A5A5A5;
      }
    }

    .app-warning {
      margin: 10px 0 15px;

      img {
        width: 15px;
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

.no-overlay .v-modal {
  opacity: 0;
}
</style>
