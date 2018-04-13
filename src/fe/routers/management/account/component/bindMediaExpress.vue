<template>
  <div>
    <fj-form :model="formData" :rules="rules" ref="editBindForm" label-width="90px">
      <fj-form-item label="账户" prop="username">
        <fj-input v-model="formData.username"></fj-input>
      </fj-form-item>
      <fj-form-item label="密码" prop="password">
        <fj-input v-model="formData.password" type="password"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer" class="edit-user-dialog-footer">
      <fj-button @click="handleClose">取消</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm">{{btnText}}</fj-button>
    </div>
  </div>
</template>
<script>
  import api from '../../../../api/group';
  import { formatQuery } from '../../../../common/utils';

  export default {
    props: {
      title: String,
      id: String,
      dialogVisible: Boolean
    },
    data() {
      return {
        visible: this.dialogVisible,
        isBtnLoading: false,
        btnText: '开始验证',
        formData: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入账户' }
          ],
          password: [
            { required: true, message: '请输入密码' }
          ]
        }
      };
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.initEditUser();
        }
      }
    },
    methods: {
      initEditUser() {
        api.getGroupUserDetail(formatQuery({ _id: this.id }, true))
          .then((response) => {
            const user = response.data.mediaExpressUser || '';
            this.formData.username = user ? user.username : '';
            this.formData.password = user ? user.password : '';
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleClose() {
        this.$emit('cancel');
      },
      submitForm(formName) {
        this.$refs.editBindForm.validate((valid) => {
          if (valid) {
            const me = this;
            const postData = {};
            postData._id = me.id;
            postData.username = me.formData.username;
            postData.password = me.formData.password;
            this.isBtnLoading = true;
            this.btnText = '正在验证';
            api.postBindMediaExpressUser(postData)
              .then((response) => {
                me.formData.username = '';
                me.formData.password = '';
                me.$emit('added');
                me.$message.success('绑定成功');
                me.btnText = '开始验证';
                me.handleClose();
              })
              .catch((error) => {
                me.btnText = '开始验证';
                me.$message.error(error);
              })
              .then(() => {
                me.isBtnLoading = false;
              });
          }
        });
      }
    }
  };
</script>
<style>
  .edit-user-dialog-footer {
    text-align: right;
  }
  .edit-user-dialog-footer button {
    margin-left: 10px;
  }
</style>
