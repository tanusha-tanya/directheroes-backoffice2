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
        <dh-account-card
          v-for="account in accounts" :account="account"
          :key="account.id"
          @click.native="accountClick(account, $event)"
          @delete-account="accountToDelete = $event"
          @toggle-freez="toggleFreez"
          @share-account="onShareAccount"
          ref="accountCards"
          ></dh-account-card>
      </div>
      <dh-confirm-dialog
        v-model="isDeleteAccount"
        title="Delete Instagram account"
        message="Are you sure you want to delete account?"
        @success="deleteAccount">
      </dh-confirm-dialog>
    </div>
    <dh-footer></dh-footer>
    <dh-connection-wizard v-model="isAddAccount" :account-auth="accountToAuth" @set-auth-account="setAuthAccount" v-if="isAddAccount"></dh-connection-wizard>
    <dh-sharing-trusted-wizzard v-model="sharing.trusted" :account-share="accountToShare" :delegate-share="delegateToShare" />
    <dh-sharing-wizzard v-model="sharing.common" :account-share="accountToShare" :delegates="delegates"/>
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
import dhConnectionWizard from '../components/dh-connection-wizard'
import dhConfirmDialog from '../components/dh-confirm-dialog'
import dhAccountCard from '../components/dh-account-card'
import status from '../assets/plus.svg'
import dhSharingWizzard from '../components/dh-sharing-wizzard'
import dhSharingTrustedWizzard from '../components/dh-sharing-trusted-wizzard'

import extraAccount from '../../oldJS/assets/svg/extra-account.svg'

export default {
  beforeRouteEnter(to, from, next) {
    next((component) => {
      const { checkAction } = component;

      checkAction(to, from);
    })

  },

  beforeRouteUpdate(to, from, next) {
    const { checkAction } = this;

    checkAction(to, from, next);
  },

  data() {
    return {
      accountToAuth: null,
      isAddAccount: false,
      accountToDelete: false,
      accountToShare: null,
      delegates: null,
      delegateToShare: null,
      isExtraAccount: false,
      sharing: {
        trusted: false,
        common: false
      }
    };
  },

  components: {
    dhHeader,
    dhFooter,
    dhConfirmDialog,
    status,
    extraAccount,
    dhConnectionWizard,
    dhAccountCard,
    dhSharingWizzard,
    dhSharingTrustedWizzard
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

  watch: {
    isAddAccount(newValue, oldValue) {
      const { accountToAuth, delegateRequestHandler } = this;
      if (!newValue && accountToAuth.connectStep === "account.success") {
        delegateRequestHandler().then(delegates => {
          const trusted = delegates.find(d => d.isTrusted);
          if (trusted) {
            this.delegateToShare = trusted;
            this.sharing.trusted = true;
            this.accountToShare = accountToAuth;
          }
        });
      }
    }

  },

  methods: {
    addAccount() {
      const { isLimitReached } = this;

      if (isLimitReached) {
        this.isExtraAccount = true;
        return;
      }

      this.accountToAuth = null;
      this.isAddAccount = true;
    },

    onShareAccount(account) {
      this.delegates = null;
      this.sharing.common = true;
      this.delegateRequestHandler().then(d => {
        this.delegates = d;
        this.accountToShare = account;
      });
    },

    delegateRequestHandler() {
      return axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/dh-account/delegate`
      }).then(({ data }) => {
        return data.response.body.list || [];
      });
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
      const { subscriptions } = this.dhAccount;
      const accountCard = this.$refs.accountCards.find(accountCard => accountCard.account === account);

      if (!accountCard) return;

      accountCard.updating = true;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/stripe/subscription/${ account.subscriptionId }/${accountCard.isFrozen ? 'unfreeze' : 'freeze'}`,
        method: 'post'
      }).then(({ data }) => {
        const { subscription } = data.response.body;
        const { subscription: accountSubscription } = accountCard;

        subscriptions.splice(subscriptions.indexOf(accountSubscription), 1, subscription);

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/ig_account/${ account.id }/subscription-capabilities`,
        }).then(({ data }) => {
          account.subscriptionCapabilities = data.response.body;
          accountCard.updating = false;
        })
      }).catch(() => {
        accountCard.updating = false;
      })
    },

    checkAction(to, from, next) {
      const { accounts, accountClick, addAccount } = this;
      const { action } = to.query;

      if (!action) {
        if (next) next();
        return;
      }

      if (action === 'new') {
        addAccount();

        if (from.name !== 'accounts') {
          this.$router.replace({ name: 'accounts'})
        }
      } else {
        const actionAccount = accounts.find(account => account.id == action);

        accountClick(actionAccount);

        if (!actionAccount.isLoggedIn && from.name !== 'accounts') {
          this.$router.replace({ name: 'accounts'})
        }
      }
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
