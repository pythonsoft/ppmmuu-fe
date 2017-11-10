<template>
  <div class="edit-panel-warpper">
    <h1>属性（{{ name }}）</h1>
    <div class="edit-panel-section basic">
      <h2>基本信息</h2>
      <div class="edit-group-logo">
        <upload-img :imgPath="formData.logo" @img-change="imgChange"></upload-img>
      </div>
      <fj-form :model="formData" :rules="rules" label-width="71px" ref="basicForm" custom-class="edit-group-form">
        <fj-form-item label="名称" prop="name">
          <fj-input v-model="formData.name" />
        </fj-form-item>
        <fj-form-item label="企业规模" v-if="isCompanyForm">
          <fj-select placeholder="请选择" v-model="formData.memberCount">
            <fj-option
              v-for="item in MEMBERCOUNT_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </fj-option>
          </fj-select>
        </fj-form-item>
      </fj-form>
    </div>
    <div class="edit-panel-section">
      <h2>联系信息</h2>
      <fj-form label-width="71px" custom-class="edit-group-form">
        <fj-form-item label="联系人">
          <fj-input
            v-model="formData.contact.name"
            icon="搜"
            @on-icon-click="openContactDialog" />
        </fj-form-item>
        <fj-form-item label="联系电话">
          <fj-input v-model="formData.contact.phone" />
        </fj-form-item>
        <fj-form-item label="邮箱">
          <fj-input v-model="formData.contact.email" />
        </fj-form-item>
      </fj-form>
    </div>
    <div class="edit-panel-section">
      <h2>配置</h2>
      <fj-form label-width="71px" custom-class="edit-group-form">
        <fj-form-item label="删除保护">
          <fj-radio-group v-model="formData.deleteDeny" custom-class="radio-group">
            <fj-radio label="1">开启</fj-radio>
            <fj-radio label="0">关闭</fj-radio>
          </fj-radio-group>
        </fj-form-item>
        <fj-form-item label="域地址" v-if="isCompanyForm">
          <fj-input v-model="formData.ad" />
        </fj-form-item>
      </fj-form>
    </div>
    <div class="edit-panel-section" v-if="isCompanyForm">
      <h2>绑定快传用户</h2>
      <span v-if="tips">快传用户信息： {{tips}}</span>
      <fj-form label-width="71px" custom-class="edit-group-form">
        <fj-form-item label="用户名">
          <fj-input v-model="formData.mediaExpressUser.username" />
        </fj-form-item>
        <fj-form-item label="密码">
          <fj-input v-model="formData.mediaExpressUser.password" type="password"/>
        </fj-form-item>
      </fj-form>
    </div>
    <div class="edit-group-btn-group">
      <fj-button type="primary" :loading="isBtnLoading" @click.stop="submitForm">保存</fj-button><!--
      --><fj-button @click.stop="cancel">取消</fj-button>
    </div>
    <contact-dialog
      :visible.sync="isShowContactDialog"
      @add-owner="updateContact"
      :searchOwner="searchResult"
      @search-user-api="searchUser"
      title="添加用户"></contact-dialog>
  </div>
</template>
<script>
  import UploadImg from '../../../personalCenter/information/uploadImg';
  import ContactDialog from '../../role/searchAddUser';
  import { formatQuery } from '../../../../common/utils';
  import groupAPI from '../../../../api/group';
  import { MEMBERCOUNT_LIST, GROUP_CONFIG } from '../config';

  const MEDIAEXPRESS_USER_TYPE = {
    COMPANYUSER: 0,   //普通成员
    COMPANYADMIN: 1,  //组织管理员
    PERSONUSER: 3, //个人用户
  }

  const MEDIAEXPRESS_USER_TYPE_MAP = {
    0: '普通成员',   //普通成员
    1: '组织管理员',  //组织管理员
    3: '个人用户', //个人用户
  }

  export default {
    props: {
      data: Object,
      type: String,
      companyId: String,
      name: String
    },
    data() {
      return {
        _id: '',
        tips: '',
        searchResult: [],
        isShowContactDialog: false,
        isBtnLoading: false,
        formData: {
          name: '',
          memberCount: '',
          contact: {
            name: '',
            phone: '',
            email: ''
          },
          deleteDeny: '',
          ad: '',
          logo: '',
          mediaExpressUser: { username: '', password: ''}
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        }
      };
    },
    watch: {
      data(val) {
        this._id = val._id;
        const mediaExpressUser = val.mediaExpressUser || { username: '', password: ''};
        val.mediaExpressUser = mediaExpressUser;
        if(mediaExpressUser && mediaExpressUser.userType && MEDIAEXPRESS_USER_TYPE_MAP[mediaExpressUser.userType]){
          this.tips = mediaExpressUser.companyName + '(' + MEDIAEXPRESS_USER_TYPE_MAP[mediaExpressUser.userType] +')';
        }else{
          this.tips = '';
        }
        this.initFormData(this.formData, val);
      }
    },
    computed: {
      isCompanyForm() {
        return this.type === this.GROUP_CONFIG.company.type;
      }
    },
    created() {
      this.MEMBERCOUNT_LIST = MEMBERCOUNT_LIST;
      this.GROUP_CONFIG = GROUP_CONFIG;
    },
    methods: {
      initFormData(targetObj, initalObj) {
        const keys = Object.keys(targetObj);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (typeof targetObj[key] === 'object') {
            this.initFormData(targetObj[key], initalObj[key]);
          } else {
            this.$set(targetObj, key, initalObj[key]);
          }
        }
      },
      cancel() {
        this.$emit('cancel');
      },
      openContactDialog() {
        this.isShowContactDialog = true;
      },
      updateContact(data) {
        const keys = Object.keys(this.formData.contact);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this.formData.contact[key] = data[key];
        }
        this.isShowContactDialog = false;
      },
      searchUser(query) {
        query = Object.assign({}, { companyId: this.companyId }, query);
        groupAPI.getGroupSearchUser(formatQuery(query, true))
          .then((res) => {
            this.searchResult = res.data;
          }).catch((error) => {
            this.$message.error(error);
          });
      },
      submitForm() {
        this.$refs.basicForm.validate((valid) => {
          if (valid) {
            const requestData = Object.assign({}, this.formData);
            requestData._id = this._id;
            this.isBtnLoading = true;
            groupAPI.postUpdateGroupInfo(requestData)
              .then((res) => {
                this.$message.success('保存成功');
                this.isBtnLoading = false;
                this.$emit('update', { name: this.formData.name });
                const mediaExpressUser = res.data.mediaExpressUser;
                if(mediaExpressUser && mediaExpressUser.userType && MEDIAEXPRESS_USER_TYPE_MAP[mediaExpressUser.userType]){
                  this.tips = mediaExpressUser.companyName + '(' + MEDIAEXPRESS_USER_TYPE_MAP[mediaExpressUser.userType] +')';
                }
                //this.cancel();
              }).catch((error) => {
                this.isBtnLoading = false;
                this.$message.error(error);
              });
          }
        });
      },
      imgChange(imgpath) {
        this.formData.logo = imgpath;
      }
    },
    components: {
      ContactDialog,
      UploadImg
    }
  };
</script>
<style>
  .edit-panel-warpper {
    margin-left: 20px;
    margin-bottom: 20px;
    color: #2A3E52;
  }
  .edit-panel-warpper h1 {
    font-size: 14px;
    line-height: 62px;
  }
  .edit-panel-section {
    position: relative;
    border-top: 1px solid #EBF3FB;
    padding-top: 30px;
  }
  .edit-panel-section h2 {
    font-size: 12px;
  }
  .edit-panel-section.basic {
    min-height: 226px;
  }
  .edit-group-form {
    width: 55%;
    margin-top: 38px;
    margin-left: 149px;
  }
  .edit-group-btn-group {
    margin-left: 220px;
  }
  .edit-group-btn-group button {
    margin-right: 10px;
  }
  .radio-group {
    line-height: 36px;
  }
  .radio-group label {
    margin-right: 34px;
  }
  .edit-group-logo {
    position: absolute;
    top: 97px;
    left: 20px;
  }
</style>
