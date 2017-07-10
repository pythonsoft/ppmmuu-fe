import Vue from 'vue';

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
import Tree from './packages/tree';
import SlideDialog from './packages/slideDialog';

import './index.css';

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
  SubmenuGroup,
  Tree,
  SlideDialog
];

const install = function (vue, options = {}) {
  components.forEach((component) => {
    vue.component(component.name, component);
  });
  vue.prototype.$message = Message;
};

// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
install(Vue);

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
  SubmenuGroup,
  Tree,
  SlideDialog
};

Vue.use(FjUI);
