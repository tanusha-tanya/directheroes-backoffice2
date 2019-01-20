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
  </div>
</template>
<script>
import addAccountDialog from '../component/addAccountDialog.vue'
import igAvatar from '../assets/ig-avatar.jpg'

export default {
  beforeRouteEnter(to, from, next) {
    const { body } = document;

    body.classList.add('no-overlay')
    next();
  },

  beforeRouteLeave(to, from, next) {
    const { body } = document;

    body.classList.remove('no-overlay')
    next();
  },

  data() {
    return {
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
  },

  methods: {
    deleteAccount(account) {
      this.$store.dispatch('deleteAccount', account)
    },

    addAccount() {
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

.no-overlay .v-modal {
  opacity: 0;
}
</style>