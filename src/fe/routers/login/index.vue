<template>
  <div  class="login">
    <div class="login-top">
      <div>
        <img src="../../img/logo@2x.png" style="width: 57px; height: 57px;">
      </div>
      <div class="login-title">鳳凰衛視媒體中心</div>
    </div>
    <div class="login-content">
      <div style="font-size: 20px; color: #2A3E52;">登录</div>
      <div class="login-form">
          <fj-form :model="userInfo" :rules="rules" ref="form" label-width="80px">
            <div class="login-label">账户</div>
            <div class="login-input">
              <fj-input v-model="userInfo.username" ref="usernameInput" icon="icon-fill-close" @on-icon-click="clearUsername" @focus="focusInput()" @blur="handleBlur()"></fj-input>
              <div class="login-message" :style="{ display: isDisplay}"><span>{{error}}</span></div>
            </div>
            <div class="login-label login-password">密码</div>
            <div class="login-input">
              <fj-input v-model="userInfo.password" type="password" icon="icon-fill-close" @on-icon-click="clearPassword" @focus="focusInput2()"></fj-input>
            </div>
            <div class="login-extra">
              <fj-checkbox-group v-model="userInfo.autoLogin">
                <fj-checkbox :label="true">下次自动登录</fj-checkbox>
                <span class="login-forget">忘记密码?</span>
              </fj-checkbox-group>
            </div>
          </fj-form>
          <div class="login-form-button">
            <fj-button type="primary" :loading="isBtnLoading" @click="login">登录</fj-button>
          </div>
      </div>
      <router-view></router-view>
    </div>
    <div class="login-footer">
      <span>Copyright © 凤凰卫视版权所有 凤凰卫视研发中心技术支持</span>
    </div>
  </div>
</template>
<script>
  import './login.css';
  import { getCookie } from '../../common/utils';

  const api = require('../../api/user');

  export default {
    name: 'login',
    data() {
      return {
        defaultRoute: '/',
        isBtnLoading: false,
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
          password: '',
          autoLogin: false
        },
        isDisplay: 'none',
        error: ''
      };
    },
    created() {
      const me = this;
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
      this.isLogin();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      isLogin() {
        const me = this;
        api.getUserAuth()
          .then(() => {
            window.location.href = '/mediaCenter';
          }).catch(() => {});
      },
      login() {
        const me = this;
        me.isBtnLoading = true;
        api.postUserLogin(this.userInfo)
          .then((res) => {
            me.$message.success('登陆成功!');
            window.location.href = '/mediaCenter';
          })
          .catch((error) => {
            me.isBtnLoading = false;
            me.error = error || '用户名或密码错误';
            me.isDisplay = '';
            me.$refs.usernameInput.$refs.input.style.borderColor = '#FF3366';
          });
      },
      clearUsername() {
        this.userInfo.username = '';
      },
      clearPassword() {
        this.userInfo.password = '';
      },
      focusInput() {
        this.error = '';
        this.isDisplay = 'none';
        this.$refs.usernameInput.$refs.input.style.borderColor = '#38B1EB';
      },
      focusInput2() {
        this.error = '';
        this.isDisplay = 'none';
        this.$refs.usernameInput.$refs.input.style.borderColor = '#CED9E5';
      },
      handleBlur() {
        this.$refs.usernameInput.$refs.input.style.borderColor = '#CED9E5';
      }
    }
  };
</script>
