import FjCell from './src/cell';

FjCell.install = function (Vue) {
  Vue.component(FjCell.name, FjCell);
};

export default FjCell;
