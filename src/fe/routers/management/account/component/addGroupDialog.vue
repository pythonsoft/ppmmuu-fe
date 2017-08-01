<template>
  <fj-dialog
    :title="`新建${title}`"
    :visible.sync="visible"
    @close="handleClose">
      <fj-form :model="formData" :rules="rules" ref="form" label-position="top">
        <fj-form-item :label="`请输入${title}名称`" prop="name">
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
  import groupAPI from '../../../../api/group';
  import { formatQuery } from '../../../../common/utils';

  export default {
    props: {
      title: String,
      type: String,
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
            postData.type = this.type;
            this.isBtnLoading = true;
            groupAPI.postAddGroup(postData)
              .then((response) => {
                this.formData.name = '';
                this.$emit('added');
                this.$message.success('保存成功');
                this.isBtnLoading = false;
                this.handleClose();
              })
              .catch((error) => {
                this.isBtnLoading = false;
                this.$message.error(error);
              });
          }
        });
      }
    }
  };
</script>
