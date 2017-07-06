import FjPagination from './src/pagination';

FjPagination.install = function (Vue) {
  Vue.component(FjPagination.name, FjPagination);
};

export default FjPagination;
