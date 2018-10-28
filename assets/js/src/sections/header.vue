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
      <div class="add-account" @click="isAddAccount = true" v-if="dhAccount && accounts.length < dhAccount.igAccountLimit">
        <div class="account-plus-ico">+</div>
        Add account
      </div>
    </div>
    <el-popover placement="bottom" trigger="hover" v-if="dhAccount">
      <div class="dh-account-popover">
        <strong>Plan:</strong> {{dhAccount.subscription.planName}}
        <a href="/logout">
          Login out
        </a>
      </div>
      <div class="dh-account account-item" slot="reference">
        <div class="account-avatar" :style="{'background-image': `${ dhAvatar ? 'url(' + dhAvatar + '), ' : ''}url(${ defaultAvatar })`}"></div>
        {{dhAccount.username}}
      </div>
    </el-popover>
    <account-dialog>
    </account-dialog>
  </header>
</template>
<script>
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import accountDialog from '../component/accountDialog.vue'
  import { Popover } from 'element-ui'

  export default {
    data() {
      return {
        defaultAvatar,
      }
    },

    components: {
      'account-dialog': accountDialog,
      'el-popover': Popover
    },

    computed: {
      accounts() {
        return this.$store.state.accounts
      },

      dhAccount() {
        return this.$store.state.dhAccount
      },

      dhAvatar() {
        return (this.accounts.find(account => account.profilePicUrl) || {}).profilePicUrl;
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
    }
  }
</script>
<style lang="scss">
.dh-account-popover {
  display: flex;
  flex-direction: column;

  a {
    margin-top: 5px;
    background-color: #434890;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    padding: 8px 26px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    text-decoration: none;
  }
}
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
      flex-grow: 1;
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

    .dh-account {
      background-color: #31356A;
      opacity: 1;
      font-size: 13px;
      height: 100%;
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
  }
</style>