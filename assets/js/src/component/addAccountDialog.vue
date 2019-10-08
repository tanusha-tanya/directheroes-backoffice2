<template>
  <el-dialog
    :visible.sync="addAcountState"
    class="add-account-dialog"
    title="Add new Instagram Account"
    width="353px"
    append-to-body
    :show-close="false"
    >
    <div class="step" v-if="!noProxyTool">
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
          <windows/>
          Download for Windows
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=mac`">
          <apple/>
          Download for Mac
        </a>
        <a :href="`${ dh.apiUrl }/api/1.0.0/${ dh.userName }/app/download?os=linux`">
          <ubuntu/>
          Download for Linux
        </a>
      </div>
    </div>
    <div class="step" v-if="!noProxyTool">
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
          {{noProxyTool ? 1 : 3}}
        </div>
        <div class="step-description">
          Enter Instagram credentials.
        </div>
      </div>
      <input class="dh-input" placeholder="Instagram Username" v-model="account.login" :disabled="accountAuth" @input="error = null" autocomplete="new-password">
      <input class="dh-input" placeholder="Instagram Password" v-model="account.password" type="password" @input="error = null" autocomplete="new-password">
      <div class="error" v-if="error && !twoFactor && !challenge" >{{ error }}</div>
      <button :class="{ 'dh-button': true, 'dh-loading': loading && !twoFactor && !challenge}" :disabled="loading || !account.login || !account.password || challenge || twoFactor" @click="actionAccount">Connect Account</button>
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
          <button class="dh-button" @click="twoFAMethodChoose=false">Choose</button>
        </div>
      </div>
    </template>
    <template v-else-if="twoFactor && !twoFAMethodChoose">
      <div class="step">
        <div class="step-info">
          <div class="step-number">
            {{noProxyTool ? 2 : 4}}
          </div>
          <div class="step-description">
            {{selected2FAMethod == 2 ? 'You should already have pre-generated backup codes, please pick one that you haven\'t used before' : 'You should receive a verification code in a minute'}}
          </div>
        </div>
        <input placeholder="Verification Code" v-model="code" class="dh-input" @input="error = null" :maxlength="selected2FAMethod == 2 ? 8 : 6" :disabled="loading">
        <div class="error" v-if="error">{{ error }}</div>
        <div class="step-verify">
          <button :class="{ 'dh-button': true, 'dh-loading': loading && !isResendCode }" :disabled="selected2FAMethod == 2 ? code.length < 8 : code.length < 6 || loading" @click="checkTFCode">Verify</button>
          <button v-if="selected2FAMethod != 2" :class="{ 'dh-button': true, 'dh-reset-button': true, 'dh-loading': loading && isResendCode }" :disabled="loading" @click="resendTFCode">Re-send</button>
        </div>
      </div>
    </template>
    <template v-else-if="challenge && !challengeCodeSended">
      <div class="step" style="margin-bottom:64px;">
        <div class="step-info">
          <div class="step-number">
            {{noProxyTool ? 2 : 4}}
          </div>
          <div class="step-description">
            Instagram requires additional verification for this connection
          </div>
        </div>
        <button :class="{'dh-button': true, 'dh-loading': loading}" :disabled="loading" @click="requestChallengeCode">Request verification code</button>
      </div>
    </template>
    <template v-else-if="challenge">
      <div class="step" style="margin-bottom:64px;">
        <div class="step-info">
          <div class="step-number">
            {{noProxyTool ? 2 : 4}}
          </div>
          <div class="step-description">
            Please check your email or sms for your most recent 6-digit Instagram verification code and enter it below
          </div>
        </div>
        <input class="dh-input" placeholder="Verification code" v-model="webDirect.challengeCode" @input="error = null" :disabled="loading">
        <div class="error" v-if="error">{{ error }}</div>
        <button :class="{'dh-button': true, 'dh-loading': loading}" :disabled="loading" @click="verifyChallengeCode">Verify Instagram connection</button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import triangle from '../assets/triangle.svg';
import axios from 'axios';
import sodium from 'libsodium-wrappers';
import windows from '../assets/svg/windows.svg';
import ubuntu from '../assets/svg/ubuntu.svg';
import apple from '../assets/svg/apple.svg';

export default {
  data() {
    return {
      oldVersion: false,
      checkingTimeout: null,
      proxyStatus: null,
      account: {
        login: '',
        password: '',
        isLoggedIn: false,
        isPasswordValid: false
      },
      webDirect: {
        username: '',
        challengeCode: ''
      },
      challengeCodeSended: false,
      error: null,
      loading: false,
      code: '',
      twoFAMethodChoose: true,
      selected2FAMethod: null,
      isResendCode: false,
      triangle
    }
  },

  components: {
    windows,
    ubuntu,
    apple
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

    noProxyTool() {
      const { challenge } = this;

      return challenge || this.dhAccount.features.loginWithoutProxyTool;
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
        this.proxyStatus = dh.noProxy || data.response.body.isProxyRunning
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
      } else if (account.twoFactor && account.twoFactor.verificationCode) {
        delete account.twoFactor.verificationCode;

        return 'The code was rejected by Instagram. Please try again, or contact support if problem persists.'
      } else if (account.twoFactor){
        return ''
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

      if (!account.isLoggedIn || !account.isPasswordValid) {
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

            this.$emit('set-auth-account', account)

            if (error) {
              this.loading = false;
              this.error = error;
            } else {
              this.loading = false;
              this.$emit('close-dialog', false);
            }
          }).catch( (error) => {
            const { response } = error;
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
      } else {
        this.loading = false;
        this.$emit('close-dialog', false);
      }
    },

    requestChallengeCode() {
      const { accountAuth } = this;
      const account = JSON.parse(JSON.stringify(accountAuth))

      this.error = null;
      this.loading = true;

      account.igChallenge.sendMethod = 1;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/challenge/send`,
        method: 'post',
        data: {
          account
        }
      }).then(({ data }) => {
        this.loading = false;
        this.challengeCodeSended = true;
      })
    },

    verifyChallengeCode() {
      const { accountAuth, webDirect } = this;
      const account = JSON.parse(JSON.stringify(accountAuth))

      this.loading = true;
      this.error = null;

      account.igChallenge.answer = webDirect.challengeCode;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/challenge/check`,
        method: 'post',
        data: {
          account
        }
      }).then(({ data }) => {
        const { accounts } = this.$store.state;
        const { request } = data;
        const { account } = data.response.body;
        const currentAccount = accounts.find(accountItem => accountItem.id == account.id)

        this.loading = false;

        if (!request.success) {
          this.error = request.statusMessage
          return;
        }

        accounts.splice(accounts.indexOf(currentAccount), 1, account);

        this.$emit('close-dialog', false);
      }).catch((error) => {
        this.error = "Server connection problem, try again"
        this.loading = false;
      })
    },

    // webDirectLogin(account) {
    //   const { $store } = this;
    //   let webDirectRequest;

    //   if (account.isLoggedIn && account.isPasswordValid) {
    //     this.webDirect.username = account.login;
    //     webDirectRequest = $store.dispatch('webDirectLogin', this.webDirect)
    //     webDirectRequest
    //       .then(({ data }) => {
    //         if (data.request.success === true) {
    //           this.loading = false;
    //           this.$emit('close-dialog', false);
    //         }
    //       }).catch( ({ response }) => {
    //       this.loading = false;
    //       this.webChallengeCodeRequired = false;

    //       if (response) {
    //         const { data } = response;

    //         if (data.request) {
    //           if (data.request.statusCode === 'web.input_challenge' || data.request.statusCode === 'web.incorrect_challenge') {
    //             this.webChallengeCodeRequired = true;
    //           }

    //           this.error = data.request.statusMessage
    //         } else {
    //           this.error = "Server connection problem, try again"
    //         }
    //       } else {
    //         this.loading = true;
    //         this.webDirectLogin(account)
    //       }
    //     })
    //   }
    // },

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
      const { accountAuth, proxyStatus, accountError, noProxyTool } = this;

      if (value) {
        this.account.login = (accountAuth && accountAuth.login) || '';
        this.account.password = '';

        if (accountAuth && accountAuth.twoFactor && accountAuth.twoFactor.verificationCode) {
          delete accountAuth.twoFactor.verificationCode;
        }

        this.error = accountError(accountAuth);

        if (!noProxyTool) {
          this.checkConnection();
        } else {
          this.proxyStatus = true;
        }
      } else {
        this.error = null;
        this.code = '';
        this.twoFAMethodChoose = true;
        this.selected2FAMethod = null;
        this.challengeCodeSended =  false;

        clearTimeout(this.checkingTimeout)
      }
    },

  }
}
</script>
<style lang="scss">
.add-account-dialog {
  background-color: transparent !important;

  .el-dialog {
    margin: 0 0 0 auto !important;
    height: 100%;
    border-radius: 0;
    padding: 31px 39px;
    overflow: auto;
    box-shadow: none;
    border-left: 1px solid $borderColor;

    .el-dialog__header, .el-dialog__body {
      padding: 0;
      word-break: break-word !important;
      background-color: transparent;
    }

    .el-dialog__title {
      font-size: 20px;
   }

    .el-dialog__header {
      margin-bottom: 24px;
    }

    .step {
      color: $textColor;
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
      border: 1px solid $mainTextColor;
      color: $mainTextColor;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .challenge-notices {
      margin-top: 10px;
      color: $textColor;
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

      svg {
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
      background-color: $failColor;
      border-radius: 20px;
      margin-right: 9px;

      &.success {
        background-color: $successColor;
      }

      &.draft {
        background-color: rgba($borderColor, .5);;
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
      justify-content: space-between;

      .dh-button {
        max-width: 100px;
        min-width: 100px;
      }
    }

    input {
      margin-top: 10px;
      width: 100%;
    }

    .error {
      margin-top: 10px;
      color: $failColor;
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
