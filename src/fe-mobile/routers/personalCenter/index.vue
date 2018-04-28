<template>
  <div class="page-wrap">
    <div class="user-info">
      <div class="user-info-image-box">
        <i v-if="!path" class="iconfont icon-avatar"></i>
        <img :src="path" class="user-info-image">
        <input id="img-input" accept="image/gif,image/png,image/jpeg,image/bmp" class="upload-img-input" @change='chooseImg' type="file">
      </div>
      <div class="user-info-content">
        <span class="user-info-name">{{ userInfo.name }}</span>
        <span class="user-info-email">{{ userInfo.email }}</span>
      </div>
    </div>
    <div class="manage-list">
      <div v-for="group in MANAGE_LIST" :class="['manage-group', { 'has-border': group.length === 1 }]">
        <fj-cell :key="item.linkTo" :link-to="item.linkTo" v-for="item in group" :title="item.title" :icon="item.icon" isLink></fj-cell>
      </div>
      <div class="logout-btn">
        <div class="fj-cell-link-mask" @touchstart="" @click="signOut"></div>
        退出登录
      </div>
    </div>
  </div>
</template>
<script>
  import { getItemFromLocalStorage, ensureLocalData } from '../../../fe/common/utils';
  const userAPI = require('../../../fe/api/user');
  const uploadAPI = require('../../../fe/api/upload');

  const MANAGE_LIST = [
    [
      { title: '个人信息', icon: 'icon-person', linkTo: '/account' }
    ],
    [
      { title: '任务', icon: 'icon-task', linkTo: '/taskCenter' }
    ],
    [
      { title: '观看历史', icon: 'icon-view', linkTo: '/history' },
      { title: '检索历史', icon: 'icon-search-right', linkTo: '/searchHistory' }
    ]
  ];
  export default {
    data() {
      return {
        MANAGE_LIST: MANAGE_LIST,
        maxSize: 5,
        path: '',
        userInfo: {}
      };
    },
    created() {
      const tempUserInfo = getItemFromLocalStorage('userInfo');
      if (!tempUserInfo) {
        this.getUserAuth();
      } else {
        this.userInfo = tempUserInfo;
        this.path = tempUserInfo.photo;
      }
    },
    methods: {
      getUserAuth() {
        userAPI.getUserAuth({}, this, true).then((res) => {
          ensureLocalData(res.data);
          this.userInfo = res.data.userInfo;
          this.path = this.userInfo.photo;
        }).catch((error) => {
          const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004', '-3005'];
          if (loginStatusCodeArr.indexOf(error.status) !== -1) {
            window.location.href = '/login';
          } else {
            this.$toast.error(error);
          }
        });
      },
      signOut() {
        userAPI.postUserLogout({}).then((res) => {
          // this.$message.success('成功退出当前帐户，期待下次光临.');
          window.location.href = '/login';
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      chooseImg(event) {
        const img = event.target.files[0];
        if (!/^image/.test(img.type)) {
          this.$toast.error('文件不是图片类型!');
          return false;
        }
        const size = Math.floor(img.size / 1024);
        if (size > 1024 * this.maxSize) {
          this.$toast.error(`图片不能大于${this.maxSize}M!`);
          return false;
        }

        const param = new FormData(); // 创建form对象
        param.append('file', img, img.name);// 通过append向form对象添加数据
        param.append('chunk', '0');// 添加form表单中其他数据
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }; // 添加请求头

        uploadAPI.upload(param, config)
          .then((res) => {
            this.savePhoto(res.data);
          })
          .catch((error) => {
            this.$toast.error(error);
          });
        return true;
      },
      savePhoto(photo) {
        userAPI.postUserUpdate({ photo: photo })
          .then((res) => {
            this.path = photo;
            this.$toast('上传成功');
          })
          .catch((error) => {
            this.$toast.error(error);
          });
      }
    }
  };
</script>
<style>
  .page-wrap {
    position: relative;
    padding-top: 45px;
    padding-bottom: 55px;
    background: #F8FAFB;
  }
  .manage-group {
    margin-top: 15px;
  }
  .manage-group.has-border {
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    padding-top: 1px;
  }
  .manage-list .iconfont {
    color: #fff;
    font-size: 15px;
    width: 29px;
    height: 29px;
    line-height: 29px;
    border-radius: 6px;
    text-align: center;
  }
  .manage-list .icon-person {
    background: #F4AC32;
  }
  .manage-list .icon-lock-fill {
    background: #2EC4B6;
  }
  .manage-list .icon-view {
    background: #FF3366;
  }
  .manage-list .icon-search-right {
    background: #008CFF;
  }
  .manage-list .icon-task {
    background: #38B1EB;
  }
  .logout-btn {
    position: relative;
    margin-top: 30px;
    padding: 15px 0;
    background: #fff;
    text-align: center;
    font-size: 15px;
    color: #333333;
  }
  .logout-btn:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .logout-btn:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .user-info {
    display: flex;
    position: relative;
    margin-top: 15px;
    padding: 15px;
    background: #fff;
  }
  .user-info:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .user-info:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .user-info-image-box {
    position: relative;
    width: 53px;
    height: 53px;
    margin-right: 15px;
    background: #EBF3FB;
    border-radius: 50%;
    overflow: hidden;
  }
  .user-info-image-box .icon-avatar {
    position: absolute;
    bottom: -5px;
    left: 7px;
    font-size: 40px;
    color: #D4DFEC;
  }
  .user-info-image,
  .upload-img-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 53px;
    height: 53px;
  }
  .upload-img-input {
    padding-top: 100px;
  }
  .user-info-content {
    flex: 1;
  }
  .user-info-name {
    display: block;
    font-size: 16px;
    color: #333333;
  }
  .user-info-email {
    font-size: 15px;
    color: #959595;
  }
</style>
