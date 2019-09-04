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

import '../../jsV5/src/elementui'
import './styles/main.scss'
import './styles/common.scss'









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



new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});


