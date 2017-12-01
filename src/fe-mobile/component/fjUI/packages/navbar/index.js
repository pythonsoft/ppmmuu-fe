import FjNavbar from './src/navbar';

FjNavbar.install = function (Vue) {
  Vue.component(FjNavbar.name, FjNavbar);
};

export default FjNavbar;
