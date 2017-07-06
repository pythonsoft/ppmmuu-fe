import FjTag from './src/tag';

FjTag.install = function (Vue) {
  Vue.component(FjTag.name, FjTag);
};

export default FjTag;
