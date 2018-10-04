<template>
  <el-dialog :visible.sync="isAddAccount" custom-class="add-account-dialog">
    <template slot="title" v-if="accountState === 'add'">
      <div class="el-dialog__title">
        Add your Instagram account
      </div>
    </template>
    <div class="add-step" v-if="accountState === 'add'">
      <div class="dialog-description">
        Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.
      </div>
      <label>
        Instagram username<br />
        <input :class="{ error }" @input="error = ''" v-model="account.login"/>
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </label>
      <label>
        Instagram password<br />
        <input v-model="account.password" type="password"/>
      </label>
      <el-checkbox v-model="account.keepPassword">Remember details</el-checkbox>
      <div class="dialog-buttons">
        <button class="cancel-button" @click="isAddAccount = false">
          Cancel
        </button>
        <button :class="{ loading: loading.action }" :disabled="!account.login || !account.password || loading.action" @click="addAccount">
          Add account
        </button>
      </div>
    </div>
    <template slot="title" v-if="isChallenge">
      <div class="el-dialog__title">
        SMS/Email verification required
      </div>
    </template>
    <div v-if="isChallenge">
      <div class="dialog-description">
        Instagram is asking to prove that you own this account by verifying phone or email access.
      </div>
      <template v-if="transport">
        <div class="verify-controls">
          <input :class="{ error }" @input="error = ''" v-model="codeValue" maxlength="6"/>
          <button @click="checkCode" :class="{ loading: loading.action }" :disabled="codeValue.length !== 6 || loading.action || loading.sending" >Verify</button>
        </div>
        <div class="challenge-controls">
          <el-radio v-model="transport" label="sms">SMS</el-radio>
          <el-radio v-model="transport" label="email">E-mail</el-radio>
          <button @click="sendChallendge()" :disabled="loading.action || loading.sending" :class="{ loading: loading.sending }">Re-send</button>
        </div>
        <div class="status-message" v-if="!error && codeSendedTime">Code was sended at {{ codeSendedTime }}</div>
        <div class="error-message" v-if="error">Entered code seems to be incorrect, please try again</div>
      </template>
      <template v-else>
        <div class="challenge-buttons">
          <button @click="sendChallendge('sms')" :disabled="loading.sending" :class="{ loading: loading.sending }" >SMS me code</button>
          <button @click="sendChallendge('email')" :disabled="loading.sending" :class="{ loading: loading.sending }" >E-mail me code</button>
        </div>
      </template>
    </div>
    <template slot="title" v-if="isCheckpoint">
      <div class="el-dialog__title">
        Checkpoint verification
      </div>
    </template>
    <div v-if="isCheckpoint">
      <div class="dialog-description">
        Please open your Instagram app and click [<strong>It was me</strong>] button
      </div>
      <div class="challenge-buttons">
        <button @click="saveAccount" :disabled="loading.action" :class="{ loading: loading.action }">I did all that, go on</button>
      </div>
    </div>
    <template slot="title" v-if="isSecurityWait">
      <div class="el-dialog__title">
        Security Wait Interval
      </div>
    </template>
    <div v-if="isSecurityWait">
      <div class="dialog-description">
        It appears that we've caught a Security Wait-Time on Instagram side, it usually takes 3 to 24 hours. Please wait couple hours and then come back to try again; all your data is saved, and you'll continue from current point
      </div>
      <div class="challenge-buttons">
        <button @click="setChallengeAgain">Retry now</button>
        <button @click="isAddAccount = false">Ok, I’ll retry in 3 hours</button>
      </div>
    </div>
    <template slot="title" v-if="is2Factor">
      <div class="el-dialog__title">
        Two factor required
      </div>
    </template>
    <div v-if="is2Factor">
      <div class="dialog-description">
        Two factor authorization is enabled on your account, you should receive an SMS with verification code in a minute
      </div>
      <div class="verify-controls">
        <input :class="{ error }" @input="error = ''" v-model="codeValue" maxlength="6"/>
        <button @click="check2FactorCode" :class="{ loading: loading.action && !loading.sending }" :disabled="codeValue.length !== 6 || loading.action || loading.sending">Verify</button>
        <button @click="resendCode" :class="{ loading: loading.sending }" :disabled="loading.action || loading.sending">Re-send</button>
      </div>
      <div class="error-message" v-if="error">Entered code seems to be incorrect, please try again</div>
    </div>
  </el-dialog>
</template>
<script>
  import { Checkbox, Dialog, Radio } from 'element-ui'
  import axios from 'axios'

  export default {
    data() {
      return {
        account: {
          login: '',
          password: '',
          keepPassword: false,
        },
        loading: {
          sending: false,
          action: false
        },
        error: '',
        codeSendedTime: '',
        codeValue: '',
        transport: '', 
        twoAFresend: false,
      }
    },

    components: {
      'el-dialog': Dialog,
      'el-checkbox': Checkbox,
      'el-radio': Radio
    },

    computed: {
      accounts() {
        return this.$store.state.accounts
      },

      currentAccount() {
        return this.$store.state.currentAccount
      },

      isAddAccount: {
        get() {
          return this.$store.state.newAccount.isAdd
        },
        set(value) {
          this.$store.commit('set', {path: 'newAccount.isAdd', value });
        }
      },

      isChallenge() {
        const { accountState } = this.$store.state.newAccount;

        return accountState == 'challenge'
      },

      isSecurityWait() {
        const { accountState } = this.$store.state.newAccount;

        return accountState == 'security-wait'
      },

      is2Factor() {
        const { accountState } = this.$store.state.newAccount;

        return accountState == '2factor'
      },

      isCheckpoint() {
        const { accountState } = this.$store.state.newAccount;

        return accountState == 'checkpoint'
      },

      accountState() {
        return this.$store.state.newAccount.accountState;
      }
    },

    methods: {
      addAccount() {
        const { loading, $store } = this

        loading.action = true;
        this.error = ''

        this.$store.dispatch('addAccount', this.account)
          .then(({ data }) => {
            const { account } = data.response.body

            loading.action = false;

            if (!account.isLoggedIn && (account.igChallenge || account.igCheckpoint)) {
              $store.commit('set', { path: 'currentAccount', value: account })
              $store.commit('set', { path: 'newAccount.password', value: this.account.password })
              $store.commit('set', { path: 'newAccount.accountState', value: 'challenge'})
            } else {
              this.isAddAccount = false;
              this.$router.push({ name: 'accountCurrent', params: { accountId: account.id } });
            }
          }).catch(error => {
            this.error = error.response.data.error;            
            loading.action = false;
          })
      },

      saveAccount() {
        const { currentAccount, loading, $store} = this
        const accountToSend = JSON.parse(JSON.stringify(currentAccount));

        loading.action = true;

        this.error = ''

        if (!accountToSend.twoFactor) {
          this.codeValue = ''
        }

        accountToSend.password = this.$store.state.newAccount.password;

        const request = this.$store.dispatch('saveAccount', accountToSend)

        request
          .then(({ data }) => {
            const { account } = data.response.body;
            const { $store, accounts, currentAccount } = this;

            loading.action = false;

            if (account.igChallenge || account.igCheckpoint || account.twoFactor) {
              $store.commit('set', { path: 'newAccount.password', value: accountToSend.password })
              $store.commit('set', { 
                path: 'newAccount.accountState',
                value: account.twoFactor ? '2factor' : 'security-wait'
              })

              if (account.twoFactor && !this.twoAFresend) {
                this.error = true;
              }
            } else {
              this.isAddAccount = false;
              this.$router.push({ name: 'accountCurrent', params: { accountId: account.id } });
            }

            this.twoAFresend = false;
          });

        return request;
      },

      sendChallendge(transport) {
        const { currentAccount, loading } = this;

        this.codeSendedTime = null;

        this.transport = transport || this.transport;

        loading.sending = true;
        this.error = ''

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/challenge/start`,
          params: { accountId: currentAccount.id, transport }
        }).then(({ data }) => {
          loading.sending = false
          this.codeSendedTime = (new Date()).toLocaleString('en-US');
        }).catch( error => {
          this.error = 'Server connection error, re-send code again after few minutes'
          loading.sending = false
        })
      },

      checkCode() {
        const { currentAccount, codeValue, loading, saveAccount } = this;

        loading.action = true;
        this.error = ''

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/challenge/verify`,
          params: { accountId: currentAccount.id, code: codeValue }
        })
        .then(({data}) => {
          const codeState = data.response.body
          
          if (!codeState.success) {
            this.error = codeState.message;
            loading.action = false;
          } else {
            setTimeout(() => {
              saveAccount().then(() => {
                loading.action = false;
              })
            }, 5000)
          }
        }).catch( error => {
          this.error = 'Server connection error, verify code again after few minutes';
          loading.action = false;
        })
      },

      check2FactorCode() {
        const { currentAccount, codeValue, saveAccount } = this;

        currentAccount.twoFactor.verificationCode = codeValue;

        saveAccount();
      },

      resendCode() {
        this.twoAFresend = true;

        this.loading.sending = true;
        this.saveAccount().then(() => {
          this.loading.sending = false;
        });
      },

      setChallengeAgain() {
        $store.commit('set', { path: 'newAccount.accountState', value: 'security-wait'})
      }
    },

    watch: {
      isAddAccount(value, oldValue) {
        if (value) return;

        this.account = {
          login: '',
          password: '',
          keepPassword: false
        };

        this.$store.state.newAccount.accountState = 'add'
        this.codeValue = '';
        this.transport = null;
      },

      accountState() {
        this.error = ''
      }
    }
  }
</script>
<style lang="scss">
  .add-account-dialog {
    color: #0C0033;
    text-align: left;
    width: 460px;

    .el-dialog__title, .dialog-description {
      text-align: left;
    }

    .dialog-description { 
      margin-bottom: 15px;
    }

    .status-message {
      font-size: 12px;
      color: #b8b5c4;
      margin-top: 5px;
    }

    .error-message {
      margin-top: 5px;
    }

    label {
      margin-top: 26px;
    }

    button {
      background-color: #85539C;
    }

    .verify-controls {
      display: flex;
      justify-content: space-around;

      button {
        margin-left: 10px;
        white-space: nowrap;
      }
    }

    .challenge-controls {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      align-items: flex-start;
      align-items: center
    }

    .el-radio { 
      margin: 0;

      .el-radio__input.is-checked {
        .el-radio__inner {
          border-color: #85539C;
          background: #85539C;
        }

        & +.el-radio__label {
          color: #85539C;
        }
      }
    }

    .challenge-buttons {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;

      button {
        white-space: nowrap;
        margin-top: 10px;
      }
    }
  }
</style>