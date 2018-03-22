<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    @close="close"
  >
     <template-view
       v-if="currentType"
       :templateInfo="templateInfo"
       :type="type"
       :groupId="groupId"
       @close="close"
       @listTemplate="listTemplate"
     ></template-view>

  </fj-slide-dialog>
</template>
<script>
  import TemplateView from './component/template';

  const config = require('../../task/config');

  export default {
    components: {
      TemplateView
    },
    props: {
      type: String,
      templateInfo: Object,
      visible: {
        type: Boolean,
        default: false
      },
      groupId: {
        type: String,
        default: ''
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
            this.title = '变更下载模板信息';
            this.currentType = this.templateInfo.type;
          } else {
            this.title = '添加下载模板信息';
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
