import FjOption from '../select/src/option';

FjOption.install = function (Vue) {
  Vue.component(FjOption.name, FjOption);
};

export default FjOption;
