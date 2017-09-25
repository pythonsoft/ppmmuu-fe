<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    @close="close"
  >
     <download-template-view
       v-if="currentType"
       :templateInfo="templateInfo"
       :type="type"
       @close="close"
       @listTemplate="listTemplate"
     ></download-template-view>

  </fj-slide-dialog>
</template>
<script>
  import downloadTemplateView from './component/download';

  const config = require('../../task/config');

  export default {
    components: {
      'download-template-view': downloadTemplateView
    },
    props: {
      type: String,
      templateInfo: Object,
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        title: '',
        currentType: '',
        info: {},
        templateType: config.getConfig('TEMPLATE_TYPE'),
        dialogVisible: false
      };
    },
    watch: {
      visible(val) {
        if (val) {
          this.dialogVisible = true;
          if (this.type !== 'add') {
            this.title = '变更转码模板信息';
            this.currentType = '2';
          } else {
            this.title = '添加转码模板信息';
            this.currentType = '1';
          }
        } else {
          this.dialogVisible = false;
          this.currentType = '';
        }
      }
    },
    created() {
    },
    methods: {
      close() {
        this.dialogVisible = false;
        this.currentView = '';
        this.$emit('update:visible', false);
      },
      listTemplate() {
        this.$emit('listTemplate');
      }
    }
  };
</script>
