<template>
  <div class="account-content" v-if="account">
    <router-view></router-view>
  </div>
</template>
<script>


export default {
  beforeRouteEnter(to, from, next) {
    next(accountComponent => {
      accountComponent.selectAccount(to);
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.selectAccount(to);
    next();
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('set', { path: 'currentAccount', value: null});
    next();
  },

  methods: {
    selectAccount(route) {
      const { $store } = this
      const { accounts } = $store.state
      const { accountId } = route.params

      if (!accountId) return;
      
      $store.commit('selectAccount', accounts.find(account => account.id == accountId))
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount;
    },
  },

  watch: {
    '$store.state.accounts'() {
      if (this.account) return;

      this.selectAccount(this.$route);
    },
  }
}
</script>
<style lang="scss">
.account-content {
  height: calc(100vh - 50px);
  display: flex;
}
</style>
