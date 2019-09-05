import Vue from 'vue'
import App from './App.vue'
import { Message } from 'element-ui'
import router from './router'
import store from './store'

import './elementui'

Vue.prototype.$message = Message;

router.beforeEach((to, from, next) => {
  const { dhAccount } = store.state;

  store.state.isfullSideBar = !['accountCampaign','accountBroadcast'].includes(to.name)

  if (dhAccount && !dhAccount.subscription.isActive && to.name !== 'addonBuy') {
    next({name: 'addonBuy'})
  } else {
    next()
  }
})

store.dispatch('getAccounts');

Vue.config.productionTip = false

Vue.mixin({
  computed: {
    dhAccount() {
      return this.$store.state.dhAccount
    },

    isAdmin() {
      const { isViewedByAdmin } = this.dhAccount;

      return isViewedByAdmin;
    }
  },

  methods: {
    blockEvent(event) {
      event.stopPropagation();
      return false;
    }
  },

  watch: {
    '$store.state.dhAccount'(dhAccount) {
      if (!dhAccount || dhAccount.subscription.isActive) return;

      this.$router.push({ name: 'dhPayments'})
    }
  }
});

if (module.hot) {
  module.hot.accept('./App', () => {
    require('./App')
  });
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
