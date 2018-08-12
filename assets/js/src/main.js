import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

import store from './store/store'

// import 'element-ui/lib/theme-chalk/index.css';

/**
 * Import routes components
 */
import account from './routes/account.vue'
import accountDetails from './routes/accountDetails.vue'
import accountCampaign from './routes/accountCampaign.vue'

const router = new VueRouter({
  routes:[
    { path: '/', component: account,
      children: [
        { name: 'home', path: '', component: accountDetails },
        { name: 'accountCampaign', path: ':accountId/campaign/:campaignId', component: accountCampaign },
        { name: 'accountCurrent', path: ':accountId', component: accountDetails }
      ]
    }
  ]
})

store.dispatch('getAccounts');

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
