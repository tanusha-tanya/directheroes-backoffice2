import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { Message } from 'element-ui'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faEnvelopeOpen, faEnvelope, faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUser, faEnvelopeOpen, faEnvelope, faCheck, faClock, faEye, faEyeSlash);

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
import campaignBuilder from './routes/campaignBuilder.vue'
import accountThread from './routes/accountThread.vue'
import accountDashboard from './routes/accountDashboard.vue'
import accountThreadMessages from './routes/accountThreadMessages.vue'

const router = new VueRouter({
  routes:[
    { path: '/', name: 'accounts', component: accounts },
    { path: '/:accountId', component: accountDetails, 
      children: [
        { name: 'accountHome', path: '', component: accountDashboard },
        { name: 'accountCampaign', path: 'campaign/:campaignId?', component: campaignBuilder },
        { name: 'audience', path: 'audience', component: accountThread },
        { name: 'accountThreadMessages', path: 'messages/:threadId', component: accountThreadMessages },
        // { name: 'accountCurrent', path: ':accountId', component: accountDetails }
      ]
    }
  ]
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
    }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
