import FjTabPane from '../tabs/src/tabPane';

FjTabPane.install = function (Vue) {
  Vue.component(FjTabPane.name, FjTabPane);
};

export default FjTabPane;
