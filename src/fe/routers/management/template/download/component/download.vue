<template>
  <div>
  <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
    <fj-form-item label="标志">
      <fj-input v-model="formData.id" :disabled="type==='update'"></fj-input>
    </fj-form-item>
    <fj-form-item label="名称" prop="name">
      <fj-input v-model="formData.name"></fj-input>
    </fj-form-item>
    <fj-form-item label="存储" prop="bucketId">
      <div class="group-input">
        <fj-input v-model="formData.bucketId" :readonly="true"></fj-input>
      </div>
      <fj-button @click.stop.prevent="bucketBrowserVisible=true">修改</fj-button>
    </fj-form-item>
    <fj-form-item label="脚本" prop="script">
      <fj-input type="textarea" :rows="7" v-model="formData.script"></fj-input>
      <p class="template-download-link" @click="scriptDialogVisible=true">* 查看脚本说明</p>
    </fj-form-item>
    <fj-form-item label="转码模版">
      <transcode-template-list
        :data="formData.transcodeTemplates"
        @add-template="addTemplate"
        @delete-template="deleteTemplate"></transcode-template-list>
    </fj-form-item>
    <fj-form-item label="转码脚本">
      <fj-input type="textarea" :rows="7" v-model="formData.transcodeTemplateSelector"></fj-input>
    </fj-form-item>
    <fj-form-item label="描述">
      <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
    </fj-form-item>
  </fj-form>

    <div class="template-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>

    <bucket-browser-view
      :visible.sync="bucketBrowserVisible"
      @confirm="bucketConfirm"
    ></bucket-browser-view>

    <script-dialog-view
      :visible.sync="scriptDialogVisible"
    ></script-dialog-view>
  </div>
</template>
<script>
  import '../index.css';
  import bucketBrowserView from '../../../bucket/component/browser';
  import scriptDialogView from './scriptDialog';
  import TranscodeTemplateList from './transcodeTemplateList';

  const api = require('../../../../../api/template');

  export default {
    name: 'templateDownloadForm',
    props: {
      templateInfo: Object,
      type: String
    },
    components: {
      'bucket-browser-view': bucketBrowserView,
      'script-dialog-view': scriptDialogView,
      TranscodeTemplateList
    },
    created() {
      if (this.type !== 'add') {
        this.formData.id = this.templateInfo._id;
        this.formData.name = this.templateInfo.name;
        this.formData.bucketId = this.templateInfo.details.bucketId;
        this.formData.script = this.templateInfo.details.script;
        this.formData.description = this.templateInfo.description;
        this.formData.transcodeTemplates = this.templateInfo.transcodeTemplateDetail.transcodeTemplates;
        this.formData.transcodeTemplateSelector = this.templateInfo.transcodeTemplateDetail.transcodeTemplateSelector;
      }
    },
    data() {
      return {
        scriptDialogVisible: false,
        bucketBrowserVisible: false,
        formData: {
          id: '',
          name: '',
          bucketId: '',
          script: '',
          transcodeTemplateSelector: '',
          transcodeTemplates: []
        },
        isBtnLoading: false,
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          bucketId: [
            { required: true, message: '请选择存储' }
          ],
          script: [
            { required: true, message: '请填写脚本' }
          ]
        }
      };
    },
    methods: {
      addTemplate(rows) {
        rows.forEach((item) => {
          this.formData.transcodeTemplates.push(item);
        });
      },
      deleteTemplate(rows) {
        rows.forEach(item => {
          const index = this.formData.transcodeTemplates.indexOf(item);
          if (index > -1) {
            this.formData.transcodeTemplates.splice(index, 1);
          }
        });
      },
      initParam() {
        this.formData = {
          id: '',
          name: '',
          bucketId: '',
          script: ''
        };
      },
      close() {
        this.$emit('close');
      },
      submitForm() {
        const me = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (!me.templateInfo) {
              this.add();
            } else {
              this.update();
            }
          }
        });
      },
      add() {
        const me = this;
        const data = Object.assign({}, this.formData);
        data.transcodeTemplates = JSON.stringify(data.transcodeTemplates);

        api.createDownloadTemplate(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      update() {
        const me = this;
        const data = Object.assign({}, this.formData);
        data.transcodeTemplates = JSON.stringify(data.transcodeTemplates);

        api.update(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      bucketConfirm(val) {
        this.formData.bucketId = val._id;
      }
    }
  };
</script>
