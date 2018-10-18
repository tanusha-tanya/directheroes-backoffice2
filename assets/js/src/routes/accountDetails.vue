<template>
    <div class="account-content">
      <div class="content-panel">
        <div class="title">
          Instagram account details
        </div>
        <div class="content-controls">
          <div class="content-button" @click="isDeleteAccount = true">
            <img src="../assets/delete-acc.svg"/>
            Delete Account
          </div>
        </div>
      </div>
      <div class="account-details">
        <div class="title">
          Basic information
          <div class="logged-error-message" v-if="!currentAccount.isPasswordValid">
            <img src="../assets/triangle-error.svg"/>
            Account has password seems to be incorrect.
          </div>
          <div class="logged-out-message" v-else-if="!currentAccount.isLoggedIn">
            <img src="../assets/triangle.svg"/>
            Account has been logged out, please re-login.
          </div>
        </div>
        <div class="account-info">
          <div :class="{'account-avatar': true, 'logged-out': !currentAccount.isLoggedIn }" :style="{'background-image': `${ currentAccount.profilePicUrl ? 'url(' + currentAccount.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
          <div style="flex-grow:1">
            <div class="account-data">
              <label>
                Instagram Username<br />
                <input readonly v-model="currentAccount.login" />
              </label>
              <label v-if="!currentAccount.keepPassword || !currentAccount.isPasswordValid">
                Account Password<br />
                <input type="password" v-model="password" :placeholder="currentAccount.isPasswordSet && '••••••••'" :readonly="currentAccount.isLoggedIn"/>
              </label>
              <button v-if="!currentAccount.keepPassword || !currentAccount.isPasswordValid" @click="saveAccount" :class="{ loading: load.save }" :disabled="load.save || !password">Save</button>
              <button v-if="currentAccount.keepPassword && currentAccount.isPasswordValid && currentAccount.igChallenge" @click="setAccountState('challenge')">Finish challenge</button>
              <button v-if="currentAccount.keepPassword && currentAccount.isPasswordValid && currentAccount.igCheckpoint" @click="setAccountState('checkpoint')">Finish checkpoint</button>
              <button v-if="currentAccount.keepPassword && currentAccount.isPasswordValid && currentAccount.twoFactor" @click="setAccountState('2factor')">Finish two factor auth</button>
            </div>
            <el-checkbox v-model="currentAccount.keepPassword">Remember details</el-checkbox>
          </div>
        </div>
      </div>
      <el-dialog title="Delete your Instagram account" :visible.sync="isDeleteAccount" custom-class="delete-account-dialog">
        <div class="dialog-description">
          Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.
        </div>
        <div class="dialog-buttons">
          <button class="cancel-button" @click="isDeleteAccount = false">
            Cancel
          </button>
          <button @click="deleteAccount" :class="{ loading: load.remove }" :disabled="load.remove">
            Delete account
          </button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import { Checkbox, Input, Dialog } from 'element-ui'

  export default {
    data() {
      return {
        defaultAvatar,
        isDeleteAccount: false,
        password: '',
        load: {
          save: false,
          remove: false,
        },
      }
    },

    computed: {
      accounts() {
        return this.$store.state.accounts
      },

      currentAccount() {
        return this.$store.state.currentAccount
      }
    },

    components: {
      'el-input': Input,
      'el-checkbox': Checkbox,
      'el-dialog': Dialog,
    },

    methods: {
      deleteAccount() {
        this.load.remove = true;
        this.$store.dispatch('deleteAccount', this.currentAccount)
          .then(({ data }) => {
            const { accounts } = this.$store.state;

            this.isDeleteAccount = false;

            if (!accounts.length) {
              this.$router.push({ name: 'home' });
            } else {
              this.$router.push({ name: 'accountCurrent', params: { accountId: accounts[0].id } })
            }

            this.load.remove = false;
          })
      },

      setAccountState(state) {
        const { $store } = this;
        
        $store.commit('set', { path: 'newAccount.accountState', value: state })
        $store.commit('set', { path: 'newAccount.isAdd', value: true })
      },

      saveAccount() {
        const { currentAccount, load, password } = this;
        const accountToSend = JSON.parse(JSON.stringify(currentAccount));

        load.save = true;

        accountToSend.password = password;

        this.$store.dispatch('saveAccount', accountToSend)
          .then(({ data }) => {
            const { account } = data.response.body;
            const { $store, accounts, currentAccount } = this;

            load.save = false;

            if (account.igChallenge || account.igCheckpoint || account.twoFactor) {
              $store.commit('set', { path: 'newAccount.password', value: password })
              $store.commit('set', { 
                path: 'newAccount.accountState',
                value: account.twoFactor ? '2factor' : account.igChallenge ? 'challenge' : 'checkpoint'
              })
              $store.commit('set', { path: 'newAccount.isAdd', value: true })
            }
          });
      }
    },

    watch: {
      currentAccount() {
        this.password = '';
      }
    }
  }
</script>
<style lang="scss">
  .account-content {
    .content-panel {
      padding: 20px 17px;
    }

    .account-details {
      padding: 30px 17px;
    }

    .logged-out-message, .logged-error-message {
      color: #7A6421;
      font-size: 12px;
      line-height: 16px;
      display: inline-block;

      img {
        height: 16px;
        width: 16px;
        margin: 0 3px -1px 5px;
      }
    }

    .logged-error-message {
      color: rgb(255, 0, 72);
    }

    .account-avatar {
      width: 87px;
      height: 87px;
      background-position: center;
      background-size: cover;
      border-radius: 100%;
      margin: 0 3px 0 5px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;

      &.logged-out:before {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url(../assets/triangle.svg) rgba(#000, .5) center no-repeat;
        background-size: 50%;
        content: '';
      }
    }

    .account-info {
      margin-top: 25px;
      display: flex;
      align-items: center;
      color: #817B94;

      .el-checkbox {
        margin-left: 24px;
        display: inline-flex;
        align-items: flex-end;
        margin-top: 10px;
      }
    }

    .account-data {
      display: flex;
      align-items: flex-end;

      input {
        border: none;
        width: 100%;

      }

      label {
        margin-left: 24px;
        width: 100%;
        max-width: 300px;
      }

      button {
        margin-left: 20px;
      }
    }

  }

  .delete-account-dialog {
    width: 460px;
    text-align: left;

    .el-dialog__title, .dialog-description {
      text-align: left;
    }

    button {
      background-color: #FF0048;
    }
  }
</style>