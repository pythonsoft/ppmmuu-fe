<template>
  <div class="page-wrap">
    <div class="return-bar">
      <i class="iconfont icon-arrow-left icon-return" @click="linkToPersonalCenter"></i>
      <h3 class="category-title has-return-btn">个人信息</h3>
    </div>
    <div class="info-group" v-for="group in INFORMATION_LIST">
      <h4 class="info-group-title">{{ group.title }}</h4>
      <ul>
        <template v-for="item in group.items">
          <fj-cell v-if="item.readonly" :title="item.label" :value="item.subName && userInfo[item.name] ? userInfo[item.name][item.subName] : userInfo[item.name]"></fj-cell>
          <fj-input-item v-else :key="item.name" :label="item.label" v-model="item.subName && userInfo[item.name] ? userInfo[item.name][item.subName] : userInfo[item.name]" :placeholder="item.placeholder"></fj-input-item>
        </template>
      </ul>
    </div>
    <div class="submit-btn">
      <fj-button @click.native="submit">保存</fj-button>
    </div>
  </div>
</template>
<script>
  const userAPI = require('../../../fe/api/user');

  const INFORMATION_LIST = [
    { title: '基本信息', items: [
      { label: '中文名', placeholder: '', name: 'name' },
      { label: '英文名', placeholder: '', name: 'displayName' }]
    },
    { title: '组织信息', items: [
      { readonly: true, label: '所属组织', placeholder: '', name: 'company', subName: 'name' },
      { readonly: true, label: '所属部门', placeholder: '', name: 'department', subName: 'name' },
      { readonly: true, label: '所属小组', placeholder: '', name: 'team', subName: 'name' }]
    },
    { title: '联系信息', items: [
      { label: '联系电话', placeholder: '', name: 'phone' },
      { readonly: true, label: '邮箱', placeholder: '', name: 'email' }]
    }
  ];

  export default {
    data() {
      return {
        INFORMATION_LIST: INFORMATION_LIST,
        userInfo: {}
      };
    },
    created() {
      this.getUserDetail();
    },
    methods: {
      linkToPersonalCenter() {
        this.$router.push({ name: 'personalCenter' });
      },
      getUserDetail() {
        userAPI.getUserDetail()
          .then((res) => {
            this.userInfo = res.data;
          }).catch((error) => {
            this.$toast.error(error);
          });
      },
      submit() {
        userAPI.postUserUpdate(this.userInfo, this)
          .then((res) => {
            this.$toast.success('保存成功!');
          })
          .catch((error) => {
            this.$toast.error(error);
          });
      },
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
  .return-bar {
    display: flex;
    position: relative;
    height: 49px;
    line-height: 49px;
    padding: 0 15px;
    background-color: #fff;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .return-bar .icon-return {
    position: absolute;
    top: 0;
    left: 15px;
    padding: 0 5px;
    font-size: 18px;
    color: #767676;
  }
  .category-title {
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    color: #333333;
  }
  .category-title.has-return-btn {
    text-align: center;
  }
  .info-group {
    margin-top: 15px;
  }
  .info-group-title {
    padding: 0 15px 5px;
    font-size: 12px;
    color: #959595;
  }
  .submit-btn {
    position: relative;
    margin: 30px;
    background: #fff;
    text-align: center;
    font-size: 15px;
    color: #333333;
  }
</style>
