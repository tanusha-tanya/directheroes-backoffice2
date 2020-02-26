import './elementui';

import Vue from 'vue'
import App from './App.vue'
import { Message, Notification } from 'element-ui'
import router from './router'
import store from './store'

import 'c3/c3.min.css';

import 'intersection-observer';

Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;

router.beforeEach((to, from, next) => {
  const { dhAccount } = store.state;

  store.state.isfullSideBar = !['accountCampaign','accountBroadcast'].includes(to.name)

  if (dhAccount && !dhAccount.subscription.isActive && !['addonBuy', 'addonPayment'].includes(to.name)) {
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
      const { dhAccount } = this.$store.state;

      return dhAccount
    },

    isAdmin() {
      const { isViewedByAdmin } = this.dhAccount;

      return isViewedByAdmin;
    },

    currentAccount() {
      const { currentAccount } = this.$store.state;

      return currentAccount
    },
  },

  methods: {
    blockEvent(event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },

    getTariffParameter(codeName) {
      const { currentAccount } = this;

      if (!currentAccount) return;

      const { subscriptionCapabilities } = currentAccount;

      return subscriptionCapabilities && subscriptionCapabilities.find && subscriptionCapabilities.find(parameter => parameter.code === codeName)
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
