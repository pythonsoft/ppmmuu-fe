<template>
  <div class="login-root">
    <div :class="['login-header', { 'loading': showLoading }]">
      <img class="login-header-icon" src="./phoenixtv.png" />
      <h1 class="login-header-title">凤凰卫视全媒体平台</h1>
    </div>
    <transition name="fade" :duration="600">
      <div class="login-content" v-show="!showLoading">
        <div class="login-input-wrap">
          <i class="iconfont icon-email"></i>
          <input
            class="login-input"
            type="text"
            placeholder="yourname@phoenixtv.com"
            v-model="username">
        </div>
        <div class="login-input-wrap">
          <i class="iconfont icon-lock"></i>
          <input
            class="login-input password"
            type="password"
            placeholder="密码"
            v-model="password">
        </div>
        <div class="login-btn-wrap">
          <fj-button type="default" @click.native="login" :disabled="isBtnDisabled">{{ btnText }}</fj-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  const userAPI = require('../../../fe/api/user');

  export default {
    data() {
      return {
        showLoading: true,
        username: '',
        password: '',
        disabled: false,
        btnText: '登录'
      };
    },
    created() {
      this.isLogin();
    },
    mounted() {
      setTimeout(()=> {
        this.showLoading = false;
      }, 2000);
    },
    computed: {
      isBtnDisabled() {
        return this.disabled || !(this.username.trim().length > 0 && this.password.length > 0);
      }
    },
    methods: {
      isLogin() {
        userAPI.getUserAuth()
          .then((res) => {
            window.location.href = '/trends';
          }).catch(() => {});
      },
      login() {
        this.disabled = true;
        this.btnText = '登录中...';
        const reqData = {};
        reqData.username = this.username.trim();
        reqData.password = this.password.trim();
        userAPI.postUserLogin(reqData)
          .then((res) => {
            this.disabled = false;
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo));
            localStorage.setItem('jwtToken', JSON.stringify(res.data.jwtToken));
            this.$router.push({ name: 'trends' });
          })
          .catch((error) => {
            this.btnText = '登录';
            this.disabled = false;
            this.$toast.error(error || '用户名或密码错误');
          });
      }
    }
  };
</script>
<style>
  .login-root {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-image: linear-gradient(90deg, #00B7CF 0%, #0082C0 100%);
    text-align: center;
    flex-direction: column;
    align-items: stretch;
    flex-shrink: 0;
  }
  .loading .login-header-icon {
    height: 63px;
    width: 63px;
    margin-bottom: 21px;
  }
  .login-header-icon {
    width: 50px;
    height: 50px;
    margin-top: 21px;
    margin-bottom: 11px;
    /*margin-bottom: 17px;*/
    transition: all .6s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
  .loading .login-header-title {
    font-size: 16px;
    line-height: 22.5px;
  }
  .login-header-title {
    margin-bottom: 30px;
    color: #FFFFFF;
    font-size: 16px;
    line-height: 25px;
    letter-spacing: 4px;
    transition: all .6s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
  .login-content {
    height: 400px;
  }
  .login-btn-wrap {
    margin: 30px 32.5px;
  }
  .login-input-wrap {
    display: flex;
    height: 50px;
    line-height: 50px;
    margin-bottom: 1px;
    padding: 0 23px;
    background-image: linear-gradient(90deg, #34C7DB 0%, #209FE6 97%);
    text-align: left;
    color: #fff;
  }
  .login-input-wrap .iconfont {
    font-size: 18px;
  }
  .login-input {
    flex: 1;
    margin: 0;
    margin-left: 15px;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    text-align: left;
    color: #fff;
    background: transparent;
    font-size: 17px;
    line-height: 23px;
  }
  .login-input.password {
    font-size: 15px;
    letter-spacing: 2px;
  }
  .fade-enter-active, .fade-leave {
    opacity: 1;
    transform-origin: bottom;
    transition: all .6s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    height: 0;
  }

</style>
