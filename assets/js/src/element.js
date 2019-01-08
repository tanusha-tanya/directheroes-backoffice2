import Vue from 'vue';
import { 
  Select, 
  Option, 
  Input, 
  InputNumber, 
  Slider, 
  Switch, 
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Popover
} from 'element-ui';

import 'element-ui/lib/theme-chalk/select.css';
import 'element-ui/lib/theme-chalk/switch.css';
import 'element-ui/lib/theme-chalk/select-dropdown.css';
import 'element-ui/lib/theme-chalk/dropdown.css';
import 'element-ui/lib/theme-chalk/icon.css';
import 'element-ui/lib/theme-chalk/slider.css'
import 'element-ui/lib/theme-chalk/input-number.css';
import 'element-ui/lib/theme-chalk/tag.css';
import 'element-ui/lib/theme-chalk/dialog.css';
import 'element-ui/lib/theme-chalk/popover.css';

Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Dialog);
Vue.use(Popover)