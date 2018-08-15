<template>
  <header>
    <div class="logo">
    </div>
    <div class="account-list">
      <router-link
        :to="{ name: 'accountCurrent', params: { accountId: account.id } }"
        tag="div"
        :class="{ 'account-item': true, active: account === currentAccount }"
        v-for="account in accounts"
        :key="account.id"
      >
        <div :class="{'account-avatar': true, 'logged-out': !account.isLoggedIn }" :style="{'background-image': `${ account.profilePicUrl ? 'url(' + account.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
        {{account.login}}
      </router-link>
      <div class="add-account" @click="isAddAccount = true">
        <div class="account-plus-ico">+</div>
        Add account
      </div>
    </div>
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
          <button :class="{ loading }" :disabled="!account.login || !account.password || loading" @click="addAccount">
            Add account
          </button>
        </div>
      </div>
      <template slot="title" v-if="accountState === 'verify'">
        <div class="el-dialog__title">
          Verify your Instagram account
        </div>
      </template>
      <div v-if="accountState === 'verify'">
        <div class="dialog-description">
          Curabitur lobortis id lorem id bibendum. Ut id consectetur magna. Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.
        </div>
      </div>
    </el-dialog>
  </header>
</template>
<script>
  import { mapActions } from 'vuex'
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import { Checkbox, Dialog, Collapse, CollapseItem } from 'element-ui'

  export default {
    data() {
      return {
        defaultAvatar,
        account: {
          login: '',
          password: '',
          keepPassword: false,
        },
        loading: false,
      }
    },

    components: {
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'el-dialog': Dialog,
      'el-checkbox': Checkbox
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

      accountState() {
        return this.$store.state.newAccount.accountState;
      }
    },

    methods: {
      addAccount() {
        this.loading = true;

        this.$store.dispatch('addAccount', this.account)
          .then(({data}) => {
            const { account } = data.response.body

            this.isAddAccount = false;
            this.loading = false;

            this.$router.push({ name: 'accountCurrent', params: { accountId: account.id } });
          }).catch((error) => {
            console.log(error);
            this.loading = false;
          })
      }
    },

    watch: {
      isAddAccount(value, oldValue) {
        const { login, password } = this.$refs;

        if (value) return;

        this.account = {
          login: '',
          password: '',
          keepPassword: false
        }
      }
    }

  }
</script>
<style lang="scss">
  header {
    display: flex;
    min-height: 50px;
    background-color: #434890;
    color: #fff;

    .logo {
      max-width: 250px;
      width: 100%;
      text-align: center;
      flex-shrink: 0;
      background: url(../assets/logo.svg) center no-repeat #31356A;
      background-size: cover;
    }

    .account-list {
      display: flex;
      // overflow-x: auto;
      // overflow-y: hidden;
    }

    .account-item {
      display: flex;
      border-bottom: 3px solid transparent;
      padding: 0 16px;
      align-items: center;
      cursor: pointer;
      opacity: .5;

      &:hover {
        opacity: .8;
      }

      &.active {
        border-bottom-color: #FFC000;
        position: relative;
        background-color: #38397D;
        cursor: default;
        opacity: 1;

        &:before {
          content: '';
          position: absolute;
          border-width: 7px 5px 0;
          border-color: #FFC000 transparent transparent;
          border-style: solid;
          top: calc(100% + 3px);
          left: calc(50% - 3px);
        }
      }

      .account-avatar {
        width: 32px;
        height: 32px;
        background-position: center;
        background-size: contain;
        border-radius: 50%;
        margin-right: 12px;
        position: relative;
        overflow: hidden;

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
    }

    .add-account {
      display: flex;
      align-items: center;
      padding: 0 16px;
      cursor: pointer;
      opacity: .5;

      &:hover {
        opacity: .8;
      }

      .account-plus-ico {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #353579;
        margin-right: 12px;
        padding: 8px;
        text-align: center;
        flex-shrink: 0;
      }
    }

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
    }
  }
</style>