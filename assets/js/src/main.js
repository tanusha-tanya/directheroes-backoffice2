import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

import store from './store/store'

/**
 * Import routes components
 */
import account from './routes/account.vue'
import accountDetails from './routes/accountDetails.vue'
import accountCompaign from './routes/accountCompaign.vue'

const router = new VueRouter({
  routes:[
    { path: '/', component: account,
      children: [
        { name: 'home', path: '', component: accountDetails },
        { name: 'accountCompaign', path: ':accountId/compaign/:compaignId', component: accountCompaign },
        { name: 'accountCurrent', path: ':accountId', component: accountDetails }
      ]
    }
  ]
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
