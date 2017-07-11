<template>
  <table-list-layout>
    <span slot="search-left">hello</span>
    <span slot="search-right">

    </span>
  </table-list-layout>
</template>
<script>
  import TableListLayout from '../../../component/layout/tableListLayout/tableListLayout';

  export default {
    data() {
      return {
        defaultRoute: '/'
      };
    },
    components: {
      'table-list-layout': TableListLayout
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      }
    }
  };
</script>
