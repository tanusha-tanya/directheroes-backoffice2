import Vue from 'vue'
import App from './registration.vue'

import '../elementui'
import "../components/uikit";

Vue.mixin({
  methods: {
    sendAnalyticEvent(event, payload) {
      const { fbq, dataLayer, ga, location } = window;

      console.log('Event', event);

      if (fbq) {
        fbq('track', event, payload);
        // fbq('trackSingleCustom', event, payload);
      }

      if (dataLayer) {
        dataLayer.push({ event, ...payload})
      }

      if (ga) {
        ga('send', 'event', event, location.href)
      }
    }
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
