<template>
  <div class="dh-view dh-accounts-view">
    <dh-header title="Accounts"></dh-header>
    <div class="dh-view-content">
      <div class="dh-accounts-list">
        <div class="dh-account-card" @click="addAccount">
          <div class="dh-account-userpic">
            <div class="dh-account-status">
              <status />
            </div>
          </div>
          <div class="dh-account-full-name">
            Add Account
          </div>
          <div class="dh-account-add-info">
            Add an Instagram account to<br>
            Direct Heroes.
          </div>
        </div>
        <div
          class="dh-account-card"
          :class="{
            'dh-account-card': true,
            'dh-account-fail-status': !account.isLoggedIn,
            'dh-account-success-status': account.isLoggedIn,
            'dh-account-frozen': isFrozen(account)
          }"
          @click="accountClick(account, $event)"
          v-for="account in accounts"
          :key="account.id">
          <el-popover placement="bottom" trigger="click">
            <div class="dh-options">
              <div class="dh-option" @click="toggleFreez(account)">
                <snowflake /> {{isFrozen(account) ? 'Unfreez' : 'Freez'}}
              </div>
              <div class="dh-option" @click="accountToDelete = account">
                <trash /> Delete
              </div>
            </div>
            <div class="dh-account-options-icon" slot="reference" @click="blockEvent">
              <ellipsis />
            </div>
          </el-popover>
          <div class="dh-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
            <div class="dh-account-status">
            </div>
          </div>
          <div class="dh-account-full-name">
            {{ account.fullName }}
          </div>
          <div class="dh-account-ig-name">
            @{{ account.login }}
          </div>
          <div class="dh-account-follow-info">
            <span><strong>{{account.followerCount || 0}}</strong> followers</span>
            <span><strong>{{account.followingCount || 0}}</strong> following</span>
          </div>
          <div class="dh-account-frozen-info" v-if="isFrozen(account)">
            <span>
             <snowflake />Account is frozen<snowflake />
            </span>
          </div>
          <div class="dh-account-connect-error" v-else-if="!account.isLoggedIn">
            <span>
              Click Here To Reconnect<br/>
              <warning />Instagram Account<warning />
            </span>
          </div>
          <div class="dh-account-owner-info" v-if="account.owner">
            Owned by <strong>{{account.owner.firstName}} {{account.owner.lastName}}</strong>
          </div>
        </div>
      </div>
      <dh-confirm-dialog
        v-model="isDeleteAccount"
        title="Delete Instagram account"
        message="Are you sure you want to delete account?"
        @success="deleteAccount">
      </dh-confirm-dialog>
    </div>
    <dh-footer></dh-footer>
    <dh-connection-wizzard v-model="isAddAccount" :account-auth="accountToAuth" @set-auth-account="setAuthAccount" v-if="isAddAccount"></dh-connection-wizzard>
    <!-- <add-account-dialog :is-add-account="isAddAccount" @set-auth-account="setAuthAccount" :account-auth="accountToAuth" @close-dialog="isAddAccount = false"></add-account-dialog> -->
    <el-dialog
      :visible.sync="isExtraAccount"
      custom-class="extra-account"
      @open="overleyClassToggle('extra-style')"
      title="Need more accounts?"
      :center="true"
      >
      <div class="info-text">Not Problem!  To add more accounts,  just purchase a new Instagram account subscription for only $97 per month.</div>
      <div class="action-block">
        <extra-account />
        <router-link class="dh-button" :to="{ name: 'addonBuy', query: { code: extraAccountPlan } }" tag="button">Buy now!</router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhConnectionWizzard from '../components/dh-connection-wizzard'
import dhConfirmDialog from '../components/dh-confirm-dialog'
import addAccountDialog from '../../oldJS/component/addAccountDialog'
import status from '../assets/plus.svg'
import warning from '../assets/warning.svg'
import ellipsis from '../assets/ellipsis.svg'
import trash from '../assets/trash.svg'
import snowflake from '../assets/snowflake.svg'
import extraAccount from '../../oldJS/assets/svg/extra-account.svg'

export default {
  data() {
    return {
      accountToAuth: null,
      isAddAccount: false,
      accountToDelete: false,
      isExtraAccount: false,
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhConfirmDialog,
    addAccountDialog,
    status,
    warning,
    ellipsis,
    snowflake,
    trash,
    extraAccount,
    dhConnectionWizzard
  },

  computed: {
    accounts() {
      const { accounts } = this.$store.state;

      return accounts;
    },

    extraAccountPlan() {
      const { dhAccount } = this;

      return dhAccount.availableAddons.extraAccount;
    },

    isLimitReached() {
      const { dhAccount, accounts} = this;

      return accounts.length >= dhAccount.igAccountLimit;
    },

    isDeleteAccount: {
      get() {
        const { accountToDelete } = this;

        return Boolean(accountToDelete)
      },
      set(value) {
        this.accountToDelete = value;
      }
    }
  },

  methods: {
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
      const { accounts } = this;
      const authAccount = accounts.find(accountItem => accountItem.id === account.id);

      if (!authAccount) {
        accounts.push(account)
      } else {
        accounts.splice(accounts.indexOf(authAccount), 1, account)
      }

      this.accountToAuth = account;
    },

    deleteAccount() {
      const { accountToDelete } = this;

      this.$store.dispatch('deleteAccount', accountToDelete).then(() => {
        this.accountToDelete = false;
      });
    },

    toggleFreez(account) {
      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/stripe/ig-account/${ account.id }/freeze`,
        method: 'post'
      }).then(({ data }) => {
        console.log(data);

      })
    },

    isFrozen(account) {
      return true
    }
  }
}
</script>

<style lang="scss">
.dh-accounts-view {
  .dh-accounts-list {
    display: flex;
    flex-wrap: wrap;
  }

  .dh-account-card {
    position: relative;
    margin: 14px;
    width: 262px;
    height: 324px;
    border-radius: 4px;
    background-color: $sectionBG;
    padding: 28px 32px;
    display: flex;
    color:inherit;
    text-decoration: none;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: box-shadow .3s;

    &:hover {
      box-shadow: 0 0 0 2px $elementActiveColor;

      .dh-account-full-name {
        color: $elementActiveColor;
      }
    }

    &.dh-account-fail-status {
      border: 1px solid $failColor;
      box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);

      .dh-account-userpic {
        border-color: $failColor;
      }

      .dh-account-status {
        width: 14px;
        height: 14px;
        border: 4px solid $failColor;
        bottom: 9px;
        background-color: $sectionBG;
      }
    }

    &.dh-account-success-status {
      .dh-account-userpic {
        border-color: $successColor;
      }

      .dh-account-status {
        width: 14px;
        height: 14px;
        border: 4px solid $successColor;
        bottom: 9px;
        background-color: $sectionBG;
      }
    }

    &.dh-account-frozen {
      border: 1px solid #2CE5F6;
      background-color: rgba($sectionBG, .1);

      .dh-account-userpic {
        border-color: #2CE5F6;
      }

      .dh-account-status {
        border-color: #2CE5F6;
      }

    }
  }

  .dh-account-options-icon {
    position: absolute;
    right:14px;
    top: 9px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }

  .dh-account-userpic {
    position: relative;
    width: 112px;
    height: 112px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    border: 2px solid transparent;
    flex-shrink: 0;
  }

  .dh-account-status {
    color: $textColor;
    position: absolute;
    bottom: 0;
    right: 8px;
    border-radius: 50%;
    border: 2px solid #fff;
    background-color: #fff;
  }

  .dh-account-full-name {
    font-size: 20px;
    line-height: 24px;
    margin-top: 18px;
  }

  .dh-account-ig-name {
    font-size: 14px;
    line-height: 21px;
    color: $textColor;
    margin-top: 3px;
  }

  .dh-account-follow-info {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 16px;
    line-height: 18px;
    text-align: center;
  }

  .dh-account-add-info {
    color: $textColor;
    line-height: 21px;
    text-align: center;
    margin-top: 37px;
  }

  .dh-account-connect-error {
    color: $failColor;
    white-space: nowrap;
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    text-align: center;
  }

  .dh-account-frozen-info {
    color: #2CE5F6;

    span{
      display: flex;
      align-items: center;
    }

    svg {
      width: 20px;
      margin: 15px 5px;
    }
  }

  .dh-account-owner-info {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    color: $textColor;
    margin-bottom: -20px;

    strong {
      margin-left: 5px;
    }
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
    word-break: normal;
  }

  .info-text {
    margin-bottom: 20px;
  }

  .action-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .dh-button {
      min-width: 145px;
    }
  }
}

.v-modal.extra-style {
  opacity: 1 !important;
  background: linear-gradient(237.78deg, rgba(34, 106, 247, 0.85) 8.65%, rgba(98, 45, 206, 0.85) 63.91%);
}
</style>