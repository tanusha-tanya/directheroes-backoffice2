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

// import 'element-ui/lib/theme-chalk/index.css';

/**
 * Import routes components
 */
import account from './routes/account.vue'
import accountDetails from './routes/accountDetails.vue'
import accountCampaign from './routes/accountCampaign.vue'
import accountThread from './routes/accountThread.vue'
import accountThreadMessages from './routes/accountThreadMessages.vue'

const router = new VueRouter({
  routes:[
    { path: '/', component: account,
      children: [
        { name: 'home', path: '', component: accountDetails },
        { name: 'accountCampaign', path: ':accountId/campaign/:campaignId', component: accountCampaign },
        { name: 'accountThread', path: ':accountId/thread/:threadId', component: accountThread },
        { name: 'accountThreadMessages', path: ':accountId/messages/:threadId', component: accountThreadMessages },
        { name: 'accountCurrent', path: ':accountId', component: accountDetails }
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
