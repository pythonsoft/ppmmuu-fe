import FjDialog from './src/dialog';

FjDialog.install = function (Vue) {
  Vue.component(FjDialog.name, FjDialog);
};

export default FjDialog;
