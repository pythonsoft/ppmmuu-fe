import FjTree from './src/tree';

FjTree.install = function (Vue) {
  Vue.component(FjTree.name, FjTree);
};

export default FjTree;
