<template>
  <fj-slide-dialog
    title="快编模板"
    :visible.sync="dialogVisible"
    width="500px"
    @close="close"
  >

    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
      <fj-form-item label="标志">
        <fj-input v-model="formData._id" :disabled="type!=='add'"></fj-input>
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
      <fj-form-item label="字幕合成" prop="subtitleType">
        <div class="template-subtitle">
          <fj-checkbox-group v-model="formData.subtitleType">
            <fj-checkbox class="template-subtitle-checkbox" v-for="item in subtitleType" :label="item.value" :key="item.value">{{item.label}}</fj-checkbox>
          </fj-checkbox-group>
        </div>
      </fj-form-item>
      <fj-form-item label="转码模板" prop="editorTemplate">
        <div class="group-input">
          <fj-input v-model="formData.transcodeTemplateName" :readonly="true"></fj-input>
        </div>
        <fj-button @click.stop.prevent="transcodeBrowserVisible=true">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="路径脚本" prop="script">
        <fj-input type="textarea" :rows="7" v-model="formData.script"></fj-input>
        <p class="template-download-link" @click="scriptDialogVisible=true">* 查看脚本说明</p>
      </fj-form-item>
      <fj-form-item label="描述">
        <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div class="library-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <bucket-browser-view
            :visible.sync="bucketBrowserVisible"
            @confirm="bucketConfirm"
    ></bucket-browser-view>
    <transcode-browser-view
            :visible.sync="transcodeBrowserVisible"
            @confirm="transcodeConfirm"
    ></transcode-browser-view>
    <script-dialog-view
            :visible.sync="scriptDialogVisible"
    ></script-dialog-view>
  </fj-slide-dialog>
</template>
<script>
  import BucketBrowserView from '../../../bucket/component/browser';
  import TranscodeBrowserView from '../../../template/download/component/transcodeBrowser';
  import ScriptDialogView from '../../../template/download/component/scriptDialog';

  const api = require('../../../../../api/shelfManage');

  const templateInfo = {
    _id: '',
    name: '',
    bucketId: '',
    description: '',
    script: '',
    transcodeTemplateId: '',
    transcodeTemplateName: '',
    subtitleType: []
  };

  const subtitleType = [
    {label: '外挂字幕', value: '0'},
    {label: '流式字幕', value: '1'},
    {label: '内嵌字幕', value: '2'}
  ];

  export default {
    name: 'fastEditTemplate',
    props: {
      templateInfo: Object,
      type: String,
      visible: { type: Boolean, default: false }
    },
    components: {
      TranscodeBrowserView,
      BucketBrowserView,
      ScriptDialogView
    },
    watch: {
      visible(val) {
        if (val) {
          this.dialogVisible = true;
        } else {
          this.dialogVisible = false;
        }
      },
      type(val) {
        if (val === 'add') {
          this.formData = JSON.parse(JSON.stringify(this.templateInfo));
        } else {
          this.formData = JSON.parse(JSON.stringify(templateInfo));
        }
      },
      templateInfo(val) {
        if (val) {
          this.formData = JSON.parse(JSON.stringify(val));
        } else {
          this.formData = JSON.parse(JSON.stringify(templateInfo));
        }
      }
    },
    created() {
    },
    data() {
      return {
        dialogVisible: false,
        scriptDialogVisible: false,
        transcodeBrowserVisible: false,
        transcodeScriptDialogVisible: false,
        libraryTemplateBrowserVisible: false,
        bucketBrowserVisible: false,
        formData: templateInfo,
        isBtnLoading: false,
        subtitleType,
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          bucketId: [
            { required: true, message: '请选择存储区' }
          ],
          script: [
            { required: true, message: '请输入路径脚本' }
          ],
          transcodeTemplateName: [
            { required: true, message: '请选择转码模板' }
          ],
        }
      };
    },
    methods: {
      close() {
        this.dialogVisible = false;
        this.$emit('update:visible', false);
      },
      submitForm() {
        const me = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (me.type === 'add') {
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
        api.addFastEditTemplate(data, me).then((res) => {
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
        api.updateFastEditTemplate(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      transcodeConfirm(val) {
        this.formData.transcodeTemplateId = val._id;
        this.formData.transcodeTemplateName = val.name;
      },
      bucketConfirm(val) {
        this.formData.bucketId = val._id;
      },
    }
  };
</script>
