import Vue from 'vue'
import App from './registration.vue'
import analytics from '../analytics'

import '../elementui'
import '../components/uikit';

console.log(analytics);

analytics.init();

Vue.mixin({
  methods: {
    sendAnalyticEvent(event, payload) {
      const { fbq, dataLayer, dhGa, location } = window;

      try {
        if (fbq) {
          fbq('track', event, payload);
        }

        if (dataLayer) {
          dataLayer.push({ event, ...payload})
        }

        if (dhGa) {
          dhGa('event', event, location.href);
        }
      } catch(error) {
        console.dir(error);
      }
    }
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
