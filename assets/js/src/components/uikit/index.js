import Vue from 'vue';
import { Button, Input, Checkbox, Switch } from 'element-ui';
import DhButton from './dh-button.vue';
import DhInput from "./dh-input.vue";
import DhCheckbox from "./dh-checkbox.vue";

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

/**
 * * Dh-checkbox
 */
Vue.use(Checkbox);
Vue.use(Switch);
import 'element-ui/lib/theme-chalk/checkbox.css';
import 'element-ui/lib/theme-chalk/switch.css';
Vue.component('dh-checkbox', DhCheckbox);