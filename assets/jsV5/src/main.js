import './elementui';

import Vue from 'vue'
import App from './App.vue'
import { Message, Notification } from 'element-ui'
import router from './router'
import store from './store'

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

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
      event.preventDefault();
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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
