<template>
  <div class="personal-information">
    <div></div>
    <div class="personal-information-title">密码修改</div>
    <div class="personal-information-base personal-information-no-border">
      <div class="personal-information-base-title">密码修改</div>
      <div class="personal-information-base-right">
        <fj-form :model="passwordInfo" ref="form" label-width="80px">
          <fj-form-item label="旧密码" prop="password">
            <fj-input v-model="userInfo.phone" ></fj-input>
          </fj-form-item>
          <fj-form-item label="邮箱" prop="email">
            <fj-input v-model="userInfo.email" ></fj-input>
          </fj-form-item>
        </fj-form>
        <div class="personal-information-operation">
          <fj-button type="primary" @click="saveClick">保存</fj-button>
            <span class="personal-information-btn-margin">
              <fj-button @click="cancelClick">取消</fj-button>
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const api = require('../../../api/user');

  export default {
    name: 'changePassword',
    data() {
      return {
        defaultRoute: '/',
        rules: {
          name: [
            { required: true, message: '请输入中文名' }
          ],
          displayName: [
            { required: true, message: '请输入英文名' }
          ]
        },
        passwordInfo: {
          photo: 'https://console.szdev.cn/img/avatar.png',
          name: '许亚文'
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
            me.userInfo = res.data;
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      saveClick() {
        const me = this;
        api.postUserUpdate(this.userInfo)
          .then((res) => {
            me.$message.success('保存成功!');
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      cancelClick() {
        this.getUserDetail();
      }
    }
  };
</script>
