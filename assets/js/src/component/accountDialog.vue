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
        <input v-model="account.login"/>
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
        A few extra steps to get started
      </div>
    </template>
    <div v-if="isChallenge">
      <div class="dialog-description">
        Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.
      </div>
      <div class="challenge-actions">
        <div v-if="currentAccount.igChallenge">
          <input :class="{ error }" @input="error = ''" v-model="codeValue" maxlength="6"/>
          <div class="error-message" v-if="error">
            {{ error }}
          </div>
          <div class="success-message" v-if="success">
            {{ success }}
          </div>
          <div class="challenge-buttons">
            <button @click="checkCode" :class="{ loading: loading.action }" :disabled="codeValue.length !== 6 || loading.action || loading.sending" >Check code</button>
            <button @click="sendChallendge" :disabled="loading.action || loading.sending" :class="{ loading: loading.sending }">{{codeSended ? 'Re-send code' : 'E-mail me code' }}</button>
          </div>
        </div>
        <div v-if="currentAccount.igCheckpoint">
          <span>Open IG app and click [<strong>It was me</strong>]</span><br />
          <button @click="saveAccount" :disabled="loading.action" :class="{ loading: loading.action }">I did all that, go on</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import { Checkbox, Dialog, Collapse, CollapseItem } from 'element-ui'
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
        codeSended: false,
        codeValue: '',
        success: '',
      }
    },

    components: {
      'el-dialog': Dialog,
      'el-checkbox': Checkbox,
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

      accountState() {
        return this.$store.state.newAccount.accountState;
      }
    },

    methods: {
      addAccount() {
        const { loading } = this

        loading.action = true;
        this.error = ''

        this.$store.dispatch('addAccount', this.account)
          .then(({data}) => {
            const { account } = data.response.body

            loading.action = false;

            if (!account.isLoggedIn && (account.igChallenge || account.igCheckpoint)) {
              $store.commit('set', { path: 'newAccount.password', value: this.account.password })
              $store.commit('set', { path: 'newAccount.accountState', value: 'challenge'})
            } else {
              this.isAddAccount = false;
              this.$router.push({ name: 'accountCurrent', params: { accountId: account.id } });
            }
          }).catch((error) => {
            loading.action = false;
          })
      },

      saveAccount() {
        const { currentAccount, loading, $store} = this
        const accountToSend = JSON.parse(JSON.stringify(currentAccount));

        loading.action = true;
        this.error = ''

        accountToSend.password = this.$store.state.newAccount.password;

        this.$store.dispatch('saveAccount', accountToSend)
          .then(({ data }) => {
            const { account } = data.response.body;
            const { $store, accounts, currentAccount } = this;

            loading.action = false;

            accounts.splice(accounts.indexOf(currentAccount), 1, account);

            if (account.igChallenge || account.igCheckpoint) {
              $store.commit('set', { path: 'newAccount.password', value: accountToSend.password })
              $store.commit('set', { path: 'newAccount.accountState', value: 'challenge'})
            } else {
              this.isAddAccount = false;
              this.$router.push({ name: 'accountCurrent', params: { accountId: account.id } });
            }
          });
      },

      sendChallendge() {
        const { currentAccount, loading } = this;

        this.codeSended = true;

        loading.sending = true;
        this.error = ''

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/challenge/start`,
          params: { accountId: currentAccount.id }
        }).then(({ data }) => {
          this.success = "Code sended"
          loading.sending = false
        }).catch( error => {
          this.error = 'Please, re-send code on email again';
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
          loading.action = false;

          if (!codeState.success) {
            this.error = codeState.message;
          } else {
            this.success = "Code verified"
            saveAccount();
          }

        }).catch( error => {
          this.error = 'Please, re-send code on email again';
          loading.action = false;
        })
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
        this.codeState = false;
      },

      accountState() {
        this.error = ''
      },

      success() {
        if (!this.success) return;

        setTimeout(()=> {
          this.success = ''
        }, 3000);
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

    label {
      margin-top: 26px;
    }

    button {
      background-color: #85539C;
    }

    .challenge-actions {
      text-align: left;
      margin: 20px 0;

      input {
        margin: 10px 0 5px; ;
      }

      .challenge-buttons {
        display: flex;
        margin-top: 10px;
        justify-content: space-around;
      }
    }
  }
</style>