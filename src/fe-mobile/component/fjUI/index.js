import Vue from 'vue';
import Tabbar from './packages/tabbar';
import TabItem from './packages/tabItem';
import Header from './packages/header';
import Navbar from './packages/navbar';
import TabContainer from './packages/tabContainer';
import TabContainerItem from './packages/tabContainerItem';
import Button from './packages/button';
import Cell from './packages/cell';
import Card from './packages/card';
import Toast from './packages/toast';
import Progress from './packages/progress';
import InputItem from './packages/inputItem';
import DatetimePicker from './packages/datetimePicker';
import './index.css';

const components = [
  Tabbar,
  TabItem,
  Header,
  Navbar,
  Button,
  TabContainer,
  TabContainerItem,
  Cell,
  Card,
  InputItem,
  DatetimePicker
];

const install = function (vue, options = {}) {
  components.forEach((component) => {
    vue.component(component.name, component);
  });
  vue.$toast = Toast;
  vue.$progress = Progress;
  vue.prototype.$toast = Toast;
  vue.prototype.$progress = Progress;
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const FjUI = {
  install,
  Tabbar,
  TabItem,
  Header,
  Navbar,
  Button,
  TabContainer,
  TabContainerItem,
  Cell,
  Card,
  Toast,
  InputItem,
  DatetimePicker,
  Progress
};
Vue.use(FjUI);
