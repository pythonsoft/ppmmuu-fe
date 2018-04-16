<template>
  <fj-dialog
    title="新建组"
    :visible.sync="visible"
    @close="handleClose">
      <fj-form :model="formData" :rules="rules" ref="form" label-position="top">
        <fj-form-item :label="`请输入组名称`" prop="name">
          <fj-input v-model="formData.name" />
        </fj-form-item>
      </fj-form>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="handleClose">取消</fj-button><!--
        --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm('form')">确定</fj-button>
      </div>
    </fj-dialog>
</template>
<script>
  import groupAPI from '../../../../../api/processTemplate';
  import { formatQuery } from '../../../../../common/utils';

  export default {
    props: {
      parentId: String,
      dialogVisible: Boolean
    },
    data() {
      return {
        visible: this.dialogVisible,
        isBtnLoading: false,
        formData: {
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        }
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const me = this;
            const postData = {};
            postData.name = this.formData.name;
            postData.parentId = this.parentId;
            this.isBtnLoading = true;
            groupAPI.addGroup(postData)
              .then((response) => {
                this.formData.name = '';
                this.$emit('added');
                this.$message.success('保存成功');
                this.handleClose();
              })
              .catch((error) => {
                this.$message.error(error);
              })
              .then(() => {
                this.isBtnLoading = false;
              });
          }
        });
      }
    }
  };
</script>
