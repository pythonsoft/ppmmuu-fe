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
    <fj-form-item label="传输方式" prop="type">
      <div class="template-dialog-checkbox-item">
        <fj-checkbox-group v-model="formData.type">
          <fj-checkbox label="2" class="template-dialog-checkbox"></fj-checkbox>
          <div class="template-dialog-checkbox-label">使用凤云快传</div>
        </fj-checkbox-group>
      </div>
    </fj-form-item>
    <fj-form-item label="转码模版">
      <transcode-template-list
        :data="formData.transcodeTemplates"
        @add-template="addTemplate"
        @delete-template="deleteTemplate"></transcode-template-list>
    </fj-form-item>
    <fj-form-item label="转码脚本">
      <fj-input type="textarea" :rows="7" v-model="formData.transcodeTemplateSelector"></fj-input>
      <p class="template-download-link" @click="transcodeScriptDialogVisible=true">* 查看脚本说明</p>
    </fj-form-item>
    <fj-form-item label="下载脚本" prop="script">
      <fj-input type="textarea" :rows="7" v-model="formData.script"></fj-input>
      <p class="template-download-link" @click="scriptDialogVisible=true">* 查看脚本说明</p>
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

    <transcode-script-dialog-view
      :visible.sync="transcodeScriptDialogVisible"
    ></transcode-script-dialog-view>
  </div>
</template>
<script>
  import '../index.css';
  import bucketBrowserView from '../../../bucket/component/browser';
  import scriptDialogView from './scriptDialog';
  import transcodeScriptDialogView from './transcodeScriptDialog.vue';
  import TranscodeTemplateList from './transcodeTemplateList';
  import FjCheckboxGroup from "../../../../../component/fjUI/packages/checkboxGroup/src/checkboxGroup.vue";

  const config = require('../../../task/config');
  const api = require('../../../../../api/template');

  export default {
    name: 'templateDownloadForm',
    props: {
      templateInfo: Object,
      type: String,
      groupId: {
        type: String,
        default: ''
      }
    },
    components: {
      FjCheckboxGroup,
      'bucket-browser-view': bucketBrowserView,
      'script-dialog-view': scriptDialogView,
      'transcode-script-dialog-view': transcodeScriptDialogView,
      TranscodeTemplateList
    },
    created() {
      if (this.type !== 'add') {
        this.formData.id = this.templateInfo._id;
        this.formData.name = this.templateInfo.name;
        this.formData.bucketId = this.templateInfo.details.bucketId;
        this.formData.script = this.templateInfo.details.script;
        this.formData.description = this.templateInfo.description;
        this.formData.type = this.templateInfo.type !== '2' ? [] : [config.getConfig('NODE_TEMPLATE', 'DOWNLOAD_MEDIAEXPRESS').value];
        const templateDetail = this.templateInfo.transcodeTemplateDetail;
        this.formData.transcodeTemplates = templateDetail ? templateDetail.transcodeTemplates : [];
        this.formData.transcodeTemplateSelector = templateDetail ? templateDetail.transcodeTemplateSelector : '';
      }
    },
    data() {
      return {
        scriptDialogVisible: false,
        transcodeScriptDialogVisible: false,
        bucketBrowserVisible: false,
        formData: {
          id: '',
          name: '',
          bucketId: '',
          script: '',
          type: [],
          transcodeTemplateSelector: '',
          transcodeTemplates: [],
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
        data.type = data.type ? (data.type.length !== 0 ? data.type[0] : '') : '';
        data.groupId = this.groupId;
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

        if(data.type && data.type.length > 0) {
          data.type = data.type[0];
        }else {
          delete data.type;
        }

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
