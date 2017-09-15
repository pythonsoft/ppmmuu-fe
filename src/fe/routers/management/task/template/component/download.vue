<template>
  <div>
  <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
    <fj-form-item label="标志">
      <fj-input v-model="formData.id"></fj-input>
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

  const api = require('../../../../../api/template');

  export default {
    name: 'templateDownloadForm',
    props: {
      info: Object
    },
    components: {
      'bucket-browser-view': bucketBrowserView,
      'script-dialog-view': scriptDialogView
    },
    watch: {
      info(v) {
        if(v) {
          this.formData.id = v._id;
          this.name = v.name;
          this.bucketId = v.details.bucketId;
          this.script = v.details.script;
        }
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
          ],
        },
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      submitForm() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (!this.info) {
              this.add();
            } else {
              this.update();
            }
          }
        });
      },
      add() {
        const me = this;

        api.createDownloadTemplate(this.formData).then((res) => {
          me.$message.success('保存成功');
          me.$emit();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      update() {

      },
      bucketConfirm(val) {
        this.formData.bucketId = val._id;
      }
    }
  }
</script>
