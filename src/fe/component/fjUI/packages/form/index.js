import FjForm from './src/form';

FjForm.install = function (Vue) {
  Vue.component(FjForm.name, FjForm);
};

export default FjForm;
