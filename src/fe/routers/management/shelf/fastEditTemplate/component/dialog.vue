<template>
  <fj-slide-dialog
    title="上架模板"
    :visible.sync="dialogVisible"
    width="500px"
    @close="close"
  >

    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
      <fj-form-item label="标志">
        <fj-input v-model="formData._id" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
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
      <fj-form-item label="下载路径" prop="downloadWorkPath">
        <fj-input v-model="formData.downloadWorkPath"></fj-input>
      </fj-form-item>
      <fj-form-item label="转码路径" prop="transcodeWorkPath">
        <fj-input v-model="formData.transcodeWorkPath"></fj-input>
      </fj-form-item>
      <fj-form-item label="存储路径" prop="storagePath">
        <fj-input v-model="formData.storagePath"></fj-input>
      </fj-form-item>
      <fj-form-item label="描述">
        <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div class="library-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <transcode-browser-view
            :visible.sync="transcodeBrowserVisible"
            @confirm="transcodeConfirm"
    ></transcode-browser-view>
  </fj-slide-dialog>
</template>
<script>
  import TranscodeBrowserView from '../../../template/download/component/transcodeBrowser';


  const api = require('../../../../../api/shelfManage');

  const templateInfo = {
    _id: '',
    name: '',
    description: '',
    downloadWorkPath: '',
    transcodeWorkPath: '',
    storagePath: '',
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
          downloadWorkPath: [
            { required: true, message: '请输入下载路径' }
          ],
          transcodeWorkPath: [
            { required: true, message: '请输入转码路径' }
          ],
          storagePath: [
            { required: true, message: '请输入存储路径' }
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
    }
  };
</script>
