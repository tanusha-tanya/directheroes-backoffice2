import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.use(VueRouter)

import store from './store/store'

/**
 * Import routes components
 */
import account from './routes/account.vue'

const router = new VueRouter({
  routes:[
    {name: 'home', path: '/', component: account}
  ]
})

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
