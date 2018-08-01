import Vue from 'vue';
import vueKanban from 'vue-kanban'
Vue.use(vueKanban);

import app from './vue/App';

window.app = new Vue({
  el: '#vue-app',
  components: {
    app: app,
  },
  data: data,
  template: '<app :board="board"></app>',
});
