import FjMenu from './src/menu';

FjMenu.install = function (Vue) {
  Vue.component(FjMenu.name, FjMenu);
};

export default FjMenu;
