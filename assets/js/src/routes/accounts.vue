<template>
  <div class="accounts-content">
    <div class="account-list">
      <div class="account-card add-account" @click="addAccount">
        <div class="account-photo"></div>
        <div class="account-login">Add new account</div>
        <div class="account-follow-info">
          <div>0<br/>following</div>
          <div>0<br/>followers </div>
        </div>
      </div>
      <div class="account-card"
        v-for="account in accounts"
        :key="account.id"
        @click="accountClick(account)"
        >
        <div @click.stop="">
          <el-dropdown @command="deleteAccount(account)" trigger="click" placement="bottom">
            <img src="../assets/svg/multipoints.svg"/>
            <el-dropdown-menu class="delete-button" slot="dropdown">
              <el-dropdown-item command="delete">Delete Account</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div :class="{'account-photo': true, 'not-logged': !account.isLoggedIn}" :style="{'background-image': `url(${ account.profilePicUrl  }), url(${ igAvatar })`}"></div>
        <div class="account-login"> @{{ account.login }}</div>
        <div class="account-follow-info">
          <div>{{ account.followingCount || 0 }}<br/>following</div>
          <div>{{ account.followerCount || 0 }}<br/>followers </div>
        </div>
      </div >
    </div>
    <add-account-dialog :is-add-account="isAddAccount" @set-auth-account="setAuthAccount" :account-auth="accountToAuth" @close-dialog="isAddAccount = false"></add-account-dialog>
    <el-dialog
      :visible.sync="isExtraAccount"
      custom-class="extra-account"
      @open="overleyClassToggle('extra-style')"
      title="Need more accounts?"
      :center="true"
      >
      <div class="info-text">Not Problem!  To add more accounts,  just purchase a new Instagram account subscription for only $97 per month.</div>
      <div class="action-block">
        <img src="../assets/svg/extra-account.svg" alt="">
        <router-link :to="{ name: 'accountBuy'}" tag="button">Buy now!</router-link>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import addAccountDialog from '../component/addAccountDialog.vue'
import igAvatar from '../assets/ig-avatar.jpg'

export default {
  beforeRouteEnter(to, from, next) {
    next(accounts => {
      const { isLimitReached} = accounts;

      accounts.isAddAccount = Boolean(to.params.isBuy) && !isLimitReached;
    })
  },

  beforeRouteUpdate(to, from, next) {
    const { isLimitReached} = this;

    this.isAddAccount = Boolean(to.params.isBuy) && !isLimitReached;
    next();
  },

  data() {
    return {
      isExtraAccount: false,
      isAddAccount: false,
      accountToAuth: null,
      igAvatar
    }
  },

  components: {
    addAccountDialog
  },

  computed: {
    accounts() {
      return this.$store.state.accounts
    },

    isLimitReached() {
      const { dhAccount, accounts} = this;

      return accounts.length >= dhAccount.igAccountLimit
    }
  },

  methods: {
    deleteAccount(account) {
      this.$store.dispatch('deleteAccount', account)
    },

    addAccount() {
      const { isLimitReached} = this;

      if (isLimitReached) {
        this.isExtraAccount = true;
        return;
      }

      this.accountToAuth = null;
      this.isAddAccount = true;
    },

    accountClick(account) {
      if (account.isLoggedIn) {
        this.$router.push({ name: 'accountHome', params: { accountId: account.id } })
      } else {
        this.accountToAuth = account;
        this.isAddAccount = true;
      }
    },

    setAuthAccount(account) {
      this.accountToAuth = account;
    },

    overleyClassToggle(className) {
      this.$nextTick(() => {
        document.querySelector('.v-modal').classList.add(className);
      })
    }
  }
}
</script>
<style lang="scss">
.accounts-content {
  padding: 30px 50px;

  .account-list {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }

  .add-account {
    .account-photo {
      border: 1px solid #DBDBDB;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &:after, &:before {
        content: '';
        border: 2px solid #DBDBDB;
        width: 32px;
        position: absolute;
      }

      &:after {
        transform: rotate(90deg)
      }
    }

    .account-login {
      border: 1px solid #DBDBDB;
      color: #DBDBDB;
      font-weight: normal;
      padding: 4px 10px;
      border-radius: 2px;
    }

    .account-follow-info {
      color: #DBDBDB;
    }
  }

  .account-card {
    margin: 10px;
    position: relative;
    background: #FFF;
    border: 1px solid #DBDBDB;
    box-shadow: 0px 2px 4px rgba(215, 215, 215, 0.5);
    border-radius: 10px;

    .account-photo {
      position: relative;
      overflow: hidden;

      &.not-logged:after {
        content: '';
        position: absolute;
        background-color: rgba(0,0,0, .5);
        background-image: url(../assets/triangle.svg);
        background-size: 50%;
        background-position: center;
        background-repeat: no-repeat;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
    }

    &:hover {
      border: 2px solid rgba(106, 18, 203, 0.7);
    }

    .el-dropdown {
      position: absolute;
      padding: 0 5px;
      right: 15px;
    }
  }
}

.el-dropdown-menu.delete-button {
  margin-left: 6px;
  margin-top: 5px;
  padding: 0;

  .el-dropdown-menu__item {
    line-height: 30px;
  }

  .el-dropdown-menu__item--divided {
    &:before {
      display: none;
    }

    margin: 0;
  }
}

.el-dialog.extra-account {
  width: 331px;

  .el-dialog__header {
    padding: 14px 24px 0;
  }

  .el-dialog__title {
    font-size: 24px;
    display: block;
    border-bottom: 1px solid #C1C1C1;
    padding-bottom: 14px;
    text-align: left;
  }

  .el-dialog__body {
    padding: 14px 24px 26px;
  }

  .info-text {
    margin-bottom: 20px;
  }

  .action-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      text-transform: uppercase;
      background: #6A12CB;
      border-radius: 100px;
      line-height: 16px;
      font-size: 16px;
      padding: 14px 25px;
    }
  }
}

.v-modal.extra-style {
  opacity: 1 !important;
  background: linear-gradient(237.78deg, rgba(34, 106, 247, 0.85) 8.65%, rgba(98, 45, 206, 0.85) 63.91%);
}
</style>
