import Input from './packages/input';
import Button from './packages/button';
import Radio from './packages/radio';
import RadioGroup from './packages/radioGroup';
import Checkbox from './packages/checkbox';
import CheckboxGroup from './packages/checkboxGroup';
import Select from './packages/select';
import Option from './packages/option';
import Form from './packages/form';
import FormItem from './packages/formItem';
import Table from './packages/table';
import TableColumn from './packages/tableColumn';
import Dialog from './packages/dialog';
import Tag from './packages/tag';
import Message from './packages/message';
import Pagination from './packages/pagination';
import Tabs from './packages/tabs';
import TabPane from './packages/tabPane';
import Menu from './packages/menu';
import MenuItem from './packages/menuItem';
import Submenu from './packages/submenu';
import SubmenuItem from './packages/submenuItem';
import SubmenuGroup from './packages/submenuGroup';

import './index.css';
import Vue from 'vue';

const components = [
  Input,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Form,
  FormItem,
  Table,
  TableColumn,
  Dialog,
  Tag,
  Pagination,
  Tabs,
  TabPane,
  Menu,
  MenuItem,
  Submenu,
  SubmenuItem,
  SubmenuGroup
];

const install = function (Vue, options = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
  Vue.prototype.$message = Message;
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// module.exports = {
const FjUI = {
  install,
  Input,
  Button,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Form,
  FormItem,
  Table,
  TableColumn,
  Dialog,
  Tag,
  Message,
  Pagination,
  Tabs,
  TabPane,
  Menu,
  MenuItem,
  Submenu,
  SubmenuItem,
  SubmenuGroup
};

Vue.use(FjUI);
