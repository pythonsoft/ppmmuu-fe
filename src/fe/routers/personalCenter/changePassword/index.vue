<template>
  <div class="change-password">
    <div class="change-password-notice" v-if="!showChangePassword">
      <span class="change-password-notice-content">当前使用域验证方式登录,如需修改,请联系管理员</span>
    </div>
    <div class="change-password-title" v-if="showChangePassword">密码修改</div>
    <div class="change-password-base change-password-no-border" v-if="showChangePassword">
      <div class="change-password-base-title">密码修改</div>
      <div class="change-password-base-right">
        <fj-form :model="passwordInfo" :rules="rules" ref="form" label-width="160px">
          <fj-form-item label="旧密码" prop="password">
            <fj-input v-model="passwordInfo.password" type="password"></fj-input>
          </fj-form-item>
          <fj-form-item label="新密码" prop="newPassword">
            <fj-input v-model="passwordInfo.newPassword" type="password" placeholder="请输入以数字或字母或下划线组成的6-20位字符"></fj-input>
          </fj-form-item>
          <fj-form-item label="再次输入新密码" prop="confirmNewPassword">
            <fj-input v-model="passwordInfo.confirmNewPassword" type="password"></fj-input>
          </fj-form-item>
        </fj-form>
        <div class="change-password-operation">
          <fj-button type="primary" @click="saveClick">保存</fj-button>
            <span class="change-password-btn-margin">
              <fj-button @click="cancelClick">取消</fj-button>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import './changePassword.css';

  const api = require('../../../api/user');

  export default {
    name: 'changePassword',
    data() {
      return {
        defaultRoute: '/',
        rules: {
          password: [
            { required: true, message: '请输入旧密码' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码' }
          ],
          confirmNewPassword: [
            { required: true, message: '请再次输入新密码' },
            { message: '两次输入新密码不相同',
              validator: (rule, value) => {
                if (value !== this.passwordInfo.newPassword) {
                  return false;
                }
                return true;
              }
            }
          ]
        },
        showChangePassword: false,
        passwordInfo: {
          password: '',
          newPassword: '',
          confirmNewPassword: ''
        }
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
      this.getUserDetail();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      getUserDetail() {
        const me = this;
        api.getUserDetail()
          .then((res) => {
            me.showChangePassword = res.data.verifyType === '0';
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      saveClick() {
        const me = this;
        api.postUserChangePassword(this.passwordInfo)
          .then((res) => {
            me.$message.success('保存成功!');
            me.getUserDetail();
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      cancelClick() {
        this.passwordInfo = {
          password: '',
          newPassword: '',
          confirmNewPassword: ''
        };
      }
    }
  };
</script>
