<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="700px"
    @close="close"
  >
    <div class="template-dialog-select-wrap" v-if="type === 'add'">
      <fj-select placeholder="请选择" size="small" theme="fill" clearable v-model="currentType" >
        <fj-option
          v-for="item in templateType"
          :key="item.key"
          :label="item.text"
          :value="item.value">
        </fj-option>
      </fj-select>
    </div>

     <download-template-view
       v-if="currentType === templateType.DOWNLOAD.value"
       :templateInfo="templateInfo"
       :type="type"
       @close="close"
       @listTemplate="listTemplate"
     ></download-template-view>

  </fj-slide-dialog>
</template>
<script>
  const config = require('../config');
  import downloadTemplateView from './component/download';

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
          if(this.type !== 'add') {
            this.title = '变更模板信息';
            this.currentType = this.templateInfo.type;
          }else {
            this.title = '添加模板信息';
          }
        } else {
          this.dialogVisible = false;
          this.currentType = '';
        }
      },
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
      },
    }
  };
</script>
