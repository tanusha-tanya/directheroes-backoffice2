import Vue from 'vue'
import { Button } from "element-ui";
import DhButton from "./dh-button.vue"

/**
 * * Dh-button
 */
Vue.use(Button);
import 'element-ui/lib/theme-chalk/button.css';
Vue.component('dh-button', DhButton);