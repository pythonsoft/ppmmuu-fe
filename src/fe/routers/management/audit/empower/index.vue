<template>
  <div>正在开发中</div>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import utils from '../../../../common/utils';

  const config = require('../config');

  export default {
    components: {
      'layout-four-row': fourRowLayout
    },
    data() {
      return {
        isDisabled: true,
        status: config.config.STATUS,
        formData: {
          keyword: '',
          status: '-1'
        },
        table: {
          currentRowInfo: {}
        },
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0
      };
    },
    created() {
    },
    methods: {

    }
  };
</script>
