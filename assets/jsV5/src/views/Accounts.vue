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
          @click="accountClick(account, $event)"
          v-for="account in accounts"
          :to="{ name: 'accountHome', params: { accountId: account.id }}"
          :key="account.id">
          <div class="dh-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
            <div :class="{
              'dh-account-status': true,
              'dh-account-fail-status': !account.isLoggedIn,
              'dh-account-success-status': account.isLoggedIn
              }">
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
      // if (account.isLoggedIn) {
        this.$router.push({ name: 'accountHome', params: { accountId: account.id } })
      // } else {
      //   this.accountToAuth = account;
      //   this.isAddAccount = true;
      // }
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
  }

  .dh-account-userpic {
    position: relative;
    width: 112px;
    height: 112px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
  }

  .dh-account-status {
    color: $textColor;
    position: absolute;
    bottom: 0;
    right: 10px;

    &.dh-account-fail-status {
      width: 14px;
      height: 14px;
      border: 4px solid $failColor;
      border-radius: 50%;
      bottom: 10px;
      background-color: $sectionBG;
    }

    &.dh-account-success-status {
      width: 14px;
      height: 14px;
      border: 4px solid $successColor;
      border-radius: 50%;
      bottom: 10px;
      background-color: $sectionBG;
    }
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
}
</style>