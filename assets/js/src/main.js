import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { Message } from 'element-ui'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faCheckCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpen, faEnvelope, faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './directives/move'
// import sodium from 'libsodium-wrappers'

library.add(faUser, faEnvelopeOpen, faEnvelope, faCheckCircle, faClock, faEye, faEyeSlash);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueRouter)

Vue.prototype.$message = Message;

import store from './store/store'


import './assets/fonts/stylesheet.css'

import './element'
import './styles/main.scss'
import './styles/common.scss'



/**
 * Import routes components
 */
import accounts from './routes/accounts.vue'
import accountDetails from './routes/accountDetails.vue'
// import accountCampaign from './routes/accountCampaign.vue'
import broadcastList from './routes/broadcastList.vue'
import broadcastBuilder from './routes/broadcastBuilder.vue'
import campaignList from './routes/campaignList.vue'
import campaignBuilder from './routes/campaignBuilder.vue'
import accountThread from './routes/accountThread.vue'
import accountDashboard from './routes/accountDashboard.vue'
import accountThreadMessages from './routes/accountThreadMessages.vue'
import accountThreadInfo from './routes/accountThreadInfo.vue'
import accountDH from './routes/accountDH.vue'
import accountDHProfile from './routes/accountDHProfile.vue'
import accountDHPayment from './routes/accountDHPayment.vue'
import accountDHSubscription from './routes/accountDHSubscription.vue'
import videoHelp from './routes/videoHelp.vue'
import bookHelp from './routes/bookHelp.vue'
import addonBuy from './routes/addonBuy.vue'
import addonPayment from './routes/addonPayment.vue'
// import extraAccountBuy from './routes/extraAccountBuy.vue'
// import extraAccountPayment from './routes/extraAccountPayment.vue'

const router = new VueRouter({
  routes:[
    { path: '/bookhelp', name: 'book-help', component: bookHelp },
    { path: '/videohelp', name: 'video-help', component: videoHelp },
    { path: '/settings', component: accountDH,
      children: [
        { name: 'dhProfile', path: '', component: accountDHProfile },
        { name: 'dhPayments', path: 'payments', component: accountDHPayment },
        { name: 'dhSubscriptions', path: 'subscriptions', component: accountDHSubscription },
      ]
    },
    { name: 'addonBuy', path: '/addon-buy', component: addonBuy },
    { name: 'addonPayment', path: '/addon-buy/payment', component: addonPayment },
    // { name: 'accountBuy', path: '/account-buy', component: extraAccountBuy },
    // { name: 'accountPayment', path: '/account-buy/payment', component: extraAccountPayment },
    { path: '/:accountId', component: accountDetails,
      children: [
        { name: 'accountHome', path: '', component: accountDashboard },
        { name: 'accountCampaignList', path: 'campaigns', component: campaignList },
        { name: 'accountCampaign', path: 'campaigns/:campaignId', component: campaignBuilder },
        { name: 'accountBroadcastList', path: 'broadcasts', component: broadcastList },
        { name: 'accountBroadcast', path: 'broadcasts/:broadcastId', component: broadcastBuilder },
        { name: 'audience', path: 'audience', component: accountThread },
        { name: 'accountThreadMessages', path: 'messages/:threadId/:subscribed?', component: accountThreadMessages },
        { name: 'accountThreadInfo', path: 'subscriber/:subscriberId', component: accountThreadInfo },
      ]
    },
    { path: '/:isBuy?', name: 'accounts', component: accounts },
  ]
})

router.beforeEach((to, from, next) => {
  const { dhAccount } = store.state;

  store.state.isfullSideBar = !['accountCampaign','accountBroadcast'].includes(to.name)

  if (dhAccount && !dhAccount.subscription.isActive && to.name !== 'dhPayments') {
    next({name: 'dhPayments'})
  } else {
    next()
  }
})

store.dispatch('getAccounts');

Vue.mixin({
  computed: {
    utils() {
      return {
        dynId: () => {
            return 'dynid-' + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        },
        uuidv4: () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
      }
    },

    dhAccount() {
      return this.$store.state.dhAccount
    },

    isAdmin() {
      const { isViewedByAdmin } = this.dhAccount;

      return isViewedByAdmin;
    }
  },

  methods: {
    blockEvent() {
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

// (async () => {
//   await sodium.ready;

//   const clientKey = store.state.clientKey = sodium.crypto_box_keypair();
//   const serverKey =store.state.serverKey = sodium.crypto_box_keypair();
//   const nonce = store.state.nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);


//   // console.log(store.state.clientKey);

//   const password = sodium.crypto_box_easy('supepuperpassword', nonce, serverKey.publicKey, clientKey.privateKey);

//   const message = sodium.crypto_box_open_easy(password, nonce, clientKey.publicKey, serverKey.privateKey);

//   console.log(new TextDecoder("utf-8").decode(message));


// })();


new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});


