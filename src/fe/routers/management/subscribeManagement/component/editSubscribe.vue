<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
      <fj-form-item label="公司名称" prop="companyName">
        <fj-input v-model="formData.companyName" :readonly="true" icon="icon-gongsi" @on-icon-click="addCompanyDialogVisible=true" v-if="type === 'add'"></fj-input>
        <fj-input v-model="formData.companyName" :readonly="true" icon="icon-gongsi" v-else></fj-input>
      </fj-form-item>
      <fj-form-item label="订阅类型" prop="subscribeType">
        <fj-select placeholder="请选择" v-model="formData.subscribeType">
          <fj-option
                  v-for="item in SUBSCRIBE_TYPE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="下载时长" prop="downloadSeconds">
        <div class="group-input">
          <fj-input v-model="formData.downloadSeconds"></fj-input>
        </div>
        <div class="group-input-unit">小时</div>
      </fj-form-item>
      <fj-form-item label="使用期限" prop="periodOfUse">
        <fj-select placeholder="请选择" v-model="formData.periodOfUse">
          <fj-option
                  v-for="item in PERIOD_OF_USE"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="开始时间" prop="startTime">
        <fj-date-picker
                type="date"
                placeholder="请选择开始时间"
                v-model="formData.startTime"
                v-if="!isUsing"
        ></fj-date-picker>
        <fj-input v-model="formData.startTime" :readonly="true" icon="icon-date" v-else></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <search-add-company
            :visible.sync="addCompanyDialogVisible"
            @add-owner="addOwner"
            :searchOwner="searchOwner"
            @search-user-api="searchOwnerClick"
            title="添加用户">
    </search-add-company>
  </fj-slide-dialog>
</template>
<script>
  import searchAddCompany from '../../role/searchAddUser';
  import { formatQuery } from '../../../../common/utils';

  const api = require('../../../../api/subscribeManagement');
  const config = require('../config');

  export default {
    props: {
      type: String,
      title: String,
      id: String,
      isUsing: {
        type: Boolean,
        default: false
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-add-company': searchAddCompany
    },
    data() {
      return {
        isBtnLoading: false,
        SUBSCRIBE_TYPE: config.SUBSCRIBE_TYPE,
        PERIOD_OF_USE: config.PERIOD_OF_USE,
        formData: {
          _id: '',
          companyName: '',
          subscribeType: '',
          downloadSeconds: '',
          periodOfUse: '',
          startTime: ''
        },
        rules: {
          companyName: [
            { required: true, message: '请选择公司' }
          ],
          subscribeType: [
            { required: true, message: '请选择订阅类型' }
          ],
          downloadSeconds: [
            { required: true, message: '请输入下载时长' }
          ],
          periodOfUse: [
            { required: true, message: '请选择使用期限' }
          ],
          startTime: [
            { required: true, message: '请选择开始时间' }
          ]
        },
        dialogVisible: false,
        addCompanyDialogVisible: false,
        searchOwner: [],
      };
    },
    watch: {
      type(val) {
        if (this.type === 'edit' && this.dialogVisible === true) {
          this.initEditUser();
        } else {
          this.resetFormData();
        }
      },
      visible(val) {
        if (val) {
          this.dialogVisible = true;
          if (this.type === 'edit') {
            this.initEditUser();
          } else {
            this.resetFormData();
          }
        } else {
          this.dialogVisible = false;
        }
      }
    },
    created() {

    },
    methods: {
      initEditUser() {
        this.dialogVisible = true;
        const me = this;
        api.getSubscribeInfo({ params: { _id: this.id } })
          .then((res) => {
            me.formData = res.data;
            me.formData.subscribeType = me.formData.subscribeType.join(',');
            me.formData.downloadSeconds = me.formData.downloadSeconds/(60*60);
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      resetFormData() {
        this.formData = {
          _id: '',
          companyName: '',
          subscribeType: '',
          downloadSeconds: '',
          periodOfUse: '',
          startTime: ''
        };
      },
      submitForm() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (this.type === 'add') {
              this.add();
            } else {
              this.edit();
            }
          }
        });
      },
      add() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.subscribeType = this.formData.subscribeType.split(',');

        api.createSubscribeInfo(this.formData)
          .then((response) => {
            me.dialogVisible = false;
            me.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.isBtnLoading = false;
            me.resetFormData();
          })
          .catch((error) => {
            me.isBtnLoading = false;
            me.$message.error(error);
          });
      },
      edit() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.subscribeType = this.formData.subscribeType.split(',');
        api.updateSubscribeInfo(this.formData)
          .then((response) => {
            me.dialogVisible  = false;
            me.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.isBtnLoading = false;
            me.resetFormData();
          })
          .catch((error) => {
            this.isBtnLoading = false;
            this.$message.error(error);
          });
      },
      close() {
        this.dialogVisible = false;
        this.resetFormData();
        this.$emit('update:visible', false);
      },
      addOwner(row) {
        row = row.info ? row.info : row;
        this.formData._id = row._id;
        this.formData.companyName = row.name;
        this.addCompanyDialogVisible = false;
      },
      searchOwnerClick(query) {
        const me = this;
        api.searchCompany(formatQuery(query, true))
          .then((res) => {
            me.searchOwner = res.data;
          }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      handleTabClick() {

      }
    }
  };
</script>
<style scope>
  .group-input {
    float: left;
    width: 246px;
  }

  .group-input-unit {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px solid #CED9E5;
    border-radius: 4px;
  }
</style>

