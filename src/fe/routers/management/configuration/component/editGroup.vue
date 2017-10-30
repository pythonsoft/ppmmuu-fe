<template>
  <fj-dialog
          title="编辑组"
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
  import groupAPI from '../../../../api/configuration';
  import { formatQuery } from '../../../../common/utils';

  export default {
    props: {
      info: Object,
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
      },
      info(val) {
        this.formData = Object.assign({}, val);
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
            postData._id = this.info.id;
            this.isBtnLoading = true;
            groupAPI.postUpdateGroup(postData)
              .then((response) => {
                me.$emit('edited', { name: me.formData.name });
                me.formData.name = '';
                me.$message.success('保存成功');
                me.isBtnLoading = false;
                me.handleClose();
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
