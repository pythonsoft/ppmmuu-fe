<template>
  <div class="login">
    <div class="login-box">
      <div class="login-top">
        <div>
          <img src="../../img/logo@2x.png" style="width: 57px; height: 57px;">
        </div>
        <div class="login-title">鳳凰衛視媒體中心</div>
      </div>
      <div class="login-content">
        <div class="login-mode" @click="toggleLoginMode">
          <img v-if="isQRCode" src="../../img/icon-computer-bg.png" width="40" title="帐户密码登录"/>
          <img v-else="!isQRCode" src="../../img/icon-qrcode-bg.png" width="40" title="扫码登录"/>
        </div>
        <div style="font-size: 20px; color: #2A3E52;">登录</div>
        <div v-if="!isQRCode" class="login-form">
            <fj-form :model="userInfo" :rules="rules" ref="form" label-width="80px">
              <div class="login-label">账户</div>
              <div class="login-input">
                <fj-input v-model="userInfo.username" ref="usernameInput" icon="icon-fill-close" @on-icon-click="clearUsername" @focus="focusInput()" @blur="handleBlur()" placeholder="请输入邮箱" @keydown.native.enter.prevent="login"></fj-input>
                <div class="login-message" :style="{ display: isDisplay}"><span>{{error}}</span></div>
              </div>
              <div class="login-label login-password">密码</div>
              <div class="login-input">
                <fj-input v-model="userInfo.password" type="password" icon="icon-fill-close" @on-icon-click="clearPassword" @focus="focusInput2()" placeholder="请输入密码" @keydown.native.enter.prevent="login"></fj-input>
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
        <div v-if="isQRCode">
          <div v-if="!qrcodeInfo._id" class="qrcode-loading">二维码加载中...</div>
          <div v-else-if="!isQRCodeExpired" class="qrcode-content">
            <img :src="qrcodeInfo.code" width="140" height="140"/>
            <p>打开 <span class="qrcode-tag">记者云</span> 扫一扫登录</p>
          </div>
          <div v-else="isQRCodeExpired" class="qrcode-content">
            <div class="iconfont icon-circle-error qrcode-invalid"></div>
            <fj-button type="primary" class="refresh-qrcode-btn" :loading="isReloadingQRCode" @click="refreshQRCode">验证码已失效，刷新二维码重新获取</fj-button>
          </div>
          <div class="qrcode-footer">
            <a href="javascript:;">下载记者云APP</a>
          </div>
        </div>
        <router-view></router-view>
      </div>
      <div class="login-footer">
        <span>Copyright © 凤凰卫视版权所有 凤凰卫视研发中心技术支持</span>
      </div>
    </div>
  </div>
</template>
<script>
  import './login.css';
  import { getDefaultPageIndex } from '../../common/utils';

  const api = require('../../api/user');
  const qrcodeAPI = require('../../api/qrcode');

  export default {
    name: 'login',
    data() {
      return {
        isQRCode: false,
        defaultRoute: '/',
        isBtnLoading: false,
        isReloadingQRCode: false,
        isQRCodeExpired: false,
        qrcodeInfo: {},
        rules: {
          username: [
            { required: true, message: '请输入邮箱' }
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
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
      this.isLogin();
    },
    methods: {
      refreshQRCode() {
        this.getQRCode();
      },
      toggleLoginMode() {
        this.isQRCode = !this.isQRCode;
        if(this.isQRCode) {
          this.getQRCode();
        }
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      isLogin() {
        api.getUserAuth().then((res) => {
          const index = getDefaultPageIndex(res.data.menu);
          this.$router.push({ name: index });
        }).catch(() => {});
      },
      login() {
        const me = this;
        me.isBtnLoading = true;
        me.userInfo.username = me.userInfo.username.trim();
        me.userInfo.password = me.userInfo.password.trim();

        api.postUserLogin(this.userInfo).then((res) => {
          this.loginSuccess(res);
        }).catch((error) => {
          this.loginError(error);
        });
      },
      loginSuccess(res) {
        this.$message.success('登录成功!');
        const index = getDefaultPageIndex(res.data.menu);
        this.$router.push({ name: index });
      },
      loginError(error) {
        this.isBtnLoading = false;
        this.error = error || '用户名或密码错误';
        this.isDisplay = '';
        this.$refs.usernameInput.$refs.input.style.borderColor = '#FF3366';
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
      },
      showQRCodeRefreshView() {
        this.qrcodeInfo = { _id: true };
        this.isQRCodeExpired = true;
        this.isReloadingQRCode = false;
      },
      getQRCode() {
        this.qrcodeInfo = {};
        this.isQRCodeExpired = false;
        this.isReloadingQRCode = true;

        qrcodeAPI.qrcodeLogin().then((res) => {
          this.qrcodeInfo = res.data;
          this.isQRCodeExpired = false;
          this.isReloadingQRCode = false;
          this.checkQRCode();
        }).catch((err) => {
          this.$message.error(err);
          this.showQRCodeRefreshView();
        });
      },
      checkQRCode() {
        if(!this.qrcodeInfo._id) { return false; }
        qrcodeAPI.qrcodeQuery({ params: { _id: this.qrcodeInfo._id } }, false, true).then((res) => {
          if(!this.isQRCode) { return false; }

          if(res.data === 'waitingScan') {
            setTimeout(() => {
              this.checkQRCode();
            }, 2000);
            return false;
          }

          this.loginSuccess(res);
        }).catch(res => {
          if(this.isQRCode) {
            this.$message.error(res.statusInfo.message);
            this.showQRCodeRefreshView();
          }
        });
      }
    }
  };
</script>
