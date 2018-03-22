<template>
  <div class="profile-popover">
    <div class="profile-content clearfix" @click="linkToPersonalCenter">
      <div class="profile-avatar-box">
        <img :src="avatar || '/static/img/avatar.png'" class="profile-avatar" width="24" height="24">
      </div>
      <div class="profile-info-box">
        <p class="profile-info-name">{{name | valueLengthLimit(12)}}</p>
        <p class="profile-info-email">{{email | valueLengthLimit(12)}}</p>
      </div>
    </div>
    <div class="profile-footer" @click="signOut">
      <i class="iconfont icon-logout"></i>
      <span>退出</span>
    </div>
  </div>
</template>
<script>
  const userAPI = require('../api/user');

  export default {
    props: {
      name: String,
      avatar: String,
      email: String
    },
    methods: {
      linkToPersonalCenter() {
        this.parent.$emit('unmount-menu');
        this.router.push('/personalCenter');
      },
      signOut() {
        userAPI.postUserLogout({}, this).then((res) => {
          localStorage.setItem('menu', '');
          localStorage.setItem('userInfo', '');
          this.$message.success('成功退出当前帐户，期待下次光临.');
          window.location.href = '/login';
        }).catch((error) => {
          this.$message.error(error);
        });
      }
    }
  };
</script>
<style>
  .profile-popover {
    position: absolute;
    left: 76px;
    bottom: 18px;
    width: 210px;
    background: #FFFFFF;
    border: 1px solid #CED9E5;
    border-radius: 4px;
  }
  .profile-content {
    height: 55px;
    cursor: pointer;
  }
  .profile-footer {
    border-top: 1px solid #EBF3FB;
    height: 32px;
    line-height: 31px;
    font-size: 12px;
    color: #4C637B;
    cursor: pointer;
  }
  .profile-footer i {
    font-size: 12px;
    padding: 0 19px;
  }
  .profile-avatar-box {
    float: left;
    width: 50px;
    padding-top: 15px;
    text-align: center;
  }
  .profile-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
  }
  .profile-info-box {
    float: left;
    padding-top: 12px;
  }
  .profile-info-name {
    color: #2A3E52;
  }
  .profile-info-email {
    color: #9FB3CA;
  }
  .imgStyle {
    background: url(../img/avatar.png) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
</style>
