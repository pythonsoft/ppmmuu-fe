<template>
  <div class="edit-panel-warpper">
    <h1>属性（{{ name }}）</h1>
    <div class="edit-panel-section basic">
      <h2>基本信息</h2>
      <div></div>
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
    <div class="edit-group-btn-group">
      <fj-button type="primary" @click.stop="submitForm">保存</fj-button><!--
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
  import ContactDialog from '../../role/searchAddUser';
  import { formatQuery } from '../../../../common/utils';
  import groupAPI from '../../../../api/group';

  const MEMBERCOUNT_LIST = [
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 500, label: '500' }
  ];

  const GROUP_CONFIG = {
    company: { type: '0', text: '公司' },
    department: { type: '1', text: '部门' },
    group: { type: '2', text: '小组' }
  };

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
        searchResult: [],
        isShowContactDialog: false,
        formData: {
          name: '',
          memberCount: '',
          contact: {
            name: '',
            phone: '',
            email: ''
          },
          deleteDeny: '',
          ad: ''
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
            groupAPI.postUpdateGroupInfo(requestData)
              .then((res) => {
                this.$message.success('保存成功');
                this.cancel();
              }).catch((error) => {
                this.$message.error(error);
              });
          }
        });
      }
    },
    components: {
      ContactDialog
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
    font-size: 16px;
    line-height: 62px;
  }
  .edit-panel-section {
    border-top: 1px solid #EBF3FB;
    padding-top: 30px;
  }
  .edit-panel-section h2 {
    font-size: 14px;
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
</style>
