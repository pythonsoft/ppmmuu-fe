<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
      <fj-form-item label="序号" v-show="type==='edit'">
        <fj-input v-model="formData.id" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="定义" prop="definition">
        <fj-input v-model="formData.definition" type="textarea" :rows="5"></fj-input>
      </fj-form-item>
      <fj-form-item label="描述" prop="description">
        <fj-input v-model="formData.description" type="textarea" :rows="5"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer" :class="$style.footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import { formatQuery, isEmptyObject } from '../../../../../common/utils';
  const api = require('../../../../../api/wokflow');

  export default {
    props: {
      info: {
        type: Object,
        default: {}
      },
      visible: {
        type: Boolean,
        default: false
      },
      type: String
    },
    data() {
      return {
        title: '添加定义信息',
        dialogVisible: false,
        isBtnLoading: false,
        formData: {
          id: '',
          name: '',
          definition: '',
          description: ''
        },
        rules: {}
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
      },
      type(val) {
        if (val === 'create') {
          this.formData = {
            id: '',
            name: '',
            definition: '',
            description: ''
          };
          this.title = '添加定义信息';
        } else if (val === 'edit') {
          const info = this.info;
          this.formData = {
            id: info.id,
            name: info.name,
            definition: info.definition,
            description: info.description
          };
          this.title = '修改定义信息';
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      submitForm() {
        if (this.type === 'create') {
          this.create();
        } else if (this.type === 'edit') {
          this.edit();
        }
      },
      create() {
        const { name, definition, description } = this.formData;
        const postData = { name, definition, description };
        this.isBtnLoading = true;
        api.workflow_definition_create(postData)
          .then((response) => {
            this.$message.success('保存成功');
            this.close();
            this.$emit('update-list');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isBtnLoading = false;
          });
      },
      edit() {
        this.isBtnLoading = true;
        api.workflow_definition_update(this.formData)
          .then((response) => {
            this.$message.success('保存成功');
            this.close();
            this.$emit('update-list');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isBtnLoading = false;
          });
      }
    }
  };
</script>
<style module>
  .footer button {
    margin-left: 10px;
  }
</style>

