import FjMenuItem from '../menu/src/menuItem';

FjMenuItem.install = function (Vue) {
  Vue.component(FjMenuItem.name, FjMenuItem);
};

export default FjMenuItem;
