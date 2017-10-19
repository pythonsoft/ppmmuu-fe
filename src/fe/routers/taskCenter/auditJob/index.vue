<template>
  <div>111</div>
</template>
<script>
  export default {
    components: {
    },
    data() {
      return {
        isDisabled: true,
        stopDisable: true,
        restartDisable: true,
        title: '',
        isShowSelect: true,

        formData: {
          keyword: '',
          status: '',
          currentStep: ''
        },

        dialog: {
          visible: false
        },

        table: {
          currentRowInfo: {}
        },
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,

        /* child task */
        childTaskDialogVisible: false,

        runTimer: false
      };
    },
    created() {
    },
    destroyed() {
    },
  };
</script>
