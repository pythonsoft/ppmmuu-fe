import FjTableColumn from '../table/src/tableColumn';

FjTableColumn.install = function (Vue) {
  Vue.component(FjTableColumn.name, FjTableColumn);
};

export default FjTableColumn;
