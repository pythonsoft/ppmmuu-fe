<template>
  <div class="login-content">
    <div class="login-form">
        <fj-form :model="userInfo" :rules="rules" ref="form" label-width="80px">
          <fj-form-item label="用户名" prop="username">
            <fj-input v-model="userInfo.username"></fj-input>
          </fj-form-item>
          <fj-form-item label="密码" prop="password">
            <fj-input v-model="userInfo.password" type="password"></fj-input>
          </fj-form-item>
          <div class="login-form-button">
            <fj-button type="primary" @click="login">登录</fj-button>
          </div>
        </fj-form>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import './login.css';

  const api = require('../../api/user');

  export default {
    name: 'login',
    data() {
      return {
        defaultRoute: '/',
        rules: {
          username: [
            { required: true, message: '请输入用户名' }
          ],
          password: [
            { required: true, message: '请输入密码' }
          ]
        },
        userInfo: {
          username: '',
          password: ''
        }
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      login() {
        const me = this;
        api.postUserLogin(this.userInfo)
          .then((res) => {
            me.$message.success('登陆成功!');
        console.log(router.push);
            me.$router.push({ name: 'management'});
          })
          .catch((error) => {
            me.$message.error(error);
          });
      }
    }
  };
</script>