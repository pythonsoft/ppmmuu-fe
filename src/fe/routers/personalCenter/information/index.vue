<template>
  <div class="personal-information">
    <div class="personal-information-title">个人信息</div>
    <div class="personal-information-base">
      <div class="personal-information-base-title">基本信息</div>
      <div class="personal-information-base-left">
        <upload-img :imgPath="userInfo.photo" @img-change="imgChange"></upload-img>
      </div>
      <div class="personal-information-default-photo" :style="{display: 'none'}"></div>
      <div class="personal-information-base-right">
        <fj-form :model="userInfo" :rules="rules" ref="form" label-width="80px">
          <fj-form-item label="中文名" prop="name">
            <fj-input v-model="userInfo.name"></fj-input>
          </fj-form-item>
          <fj-form-item label="英文名" prop="displayName">
            <fj-input v-model="userInfo.displayName"></fj-input>
          </fj-form-item>
        </fj-form>
      </div>
    </div>
    <div class="personal-information-base">
      <div class="personal-information-base-title">组织信息</div>
      <div class="personal-information-base-right">
        <fj-form :model="userInfo" ref="form" label-width="80px">
          <fj-form-item label="所属组织" prop="company.name">
            <fj-input v-model="userInfo.company.name" :disabled="true"></fj-input>
          </fj-form-item>
          <fj-form-item label="所属部门" prop="department.name">
            <fj-input v-model="userInfo.department.name" :disabled="true"></fj-input>
          </fj-form-item>
          <fj-form-item label="所属小组" prop="team.name">
            <fj-input v-model="userInfo.team.name" :disabled="true"></fj-input>
          </fj-form-item>
        </fj-form>
      </div>
    </div>
    <div class="personal-information-base personal-information-no-border">
      <div class="personal-information-base-title">联系信息</div>
      <div class="personal-information-base-right">
        <fj-form :model="userInfo" ref="form" label-width="80px">
          <fj-form-item label="联系电话" prop="phone">
            <fj-input v-model="userInfo.phone" ></fj-input>
          </fj-form-item>
          <fj-form-item label="邮箱" prop="email">
            <fj-input v-model="userInfo.email" :disabled="true"></fj-input>
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
  import './information.css';
  import UploadImg from './uploadImg';
  import { setItemToLocalStorage, getItemFromLocalStorage } from '../../../common/utils';

  const api = require('../../../api/user');

  export default {
    name: 'information',
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
        userInfo: {
          photo: '',
          name: '',
          displayName: '',
          company: {
            _id: '',
            name: ''
          },
          department: {
            _id: '',
            name: ''
          },
          team: {
            _id: '',
            name: ''
          },
          contact: {
            _id: '',
            phone: '',
            email: ''
          }
        }
      };
    },
    components: {
      'upload-img': UploadImg
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
        api.postUserUpdate(this.userInfo).then(res => {
          me.$message.success('保存成功!');
          const userInfo = getItemFromLocalStorage('userInfo');
          userInfo.photo = me.userInfo.photo;
          setItemToLocalStorage('userInfo', userInfo);
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      cancelClick() {
        this.getUserDetail();
      },
      imgChange(imgpath) {
        this.userInfo.photo = imgpath;
      }
    }
  };
</script>
