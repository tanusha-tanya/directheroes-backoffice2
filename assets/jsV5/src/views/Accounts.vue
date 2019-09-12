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
            'dh-account-success-status': account.isLoggedIn
          }"
          @click="accountClick(account, $event)"
          v-for="account in accounts"
          :to="{ name: 'accountHome', params: { accountId: account.id }}"
          :key="account.id">
          <el-popover placement="bottom" trigger="click"  v-if="dhAccount">
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
          <div class="dh-account-connect-error" v-if="!account.isLoggedIn">
            <span><warning /> Connect Instagram Account</span>
          </div>
        </div>
      </div>
    </div>
    <dh-footer></dh-footer>
    <add-account-dialog :is-add-account="isAddAccount" @set-auth-account="setAuthAccount" :account-auth="accountToAuth" @close-dialog="isAddAccount = false"></add-account-dialog>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import addAccountDialog from '../../../js/src/component/addAccountDialog'
import status from '../assets/plus.svg'
import warning from '../assets/warning.svg'
import ellipsis from '../assets/ellipsis.svg'

export default {
  data() {
    return {
      accountToAuth: null,
      isAddAccount: false,
    }
  },

  components: {
    dhHeader,
    dhFooter,
    addAccountDialog,
    status,
    warning,
    ellipsis
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
    }
  },

  methods: {
    addAccount() {
      // const { isLimitReached} = this;

      // if (isLimitReached) {
      //   this.isExtraAccount = true;
      //   return;
      // }

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

    &:hover {
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
  }

  .dh-account-options-icon {
    position: absolute;
    right:21px;
    top: 17px;
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
  }
}
</style>