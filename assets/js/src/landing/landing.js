import Vue from 'vue'
import App from './landing.vue'

import "../components/uikit";

Vue.mixin({
  methods: {
    sendAnalyticEvent(event, payload) {
      const { fbq, dataLayer } = window;

      if (fbq) {
        fbq('track', event, payload);
      }

      if (dataLayer) {
        dataLayer.push({ event, ...payload})
      }
    }
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
