import Vue from 'vue';
import { Button, Input } from 'element-ui';
import DhButton from './dh-button.vue';
import DhInput from './dh-input.vue';

/**
 * * Dh-button
 */
Vue.use(Button);
import 'element-ui/lib/theme-chalk/button.css';
Vue.component('dh-button', DhButton);

/**
 * * Dh-input
 */
Vue.use(Input);
import 'element-ui/lib/theme-chalk/input.css';
Vue.component('dh-input', DhInput);