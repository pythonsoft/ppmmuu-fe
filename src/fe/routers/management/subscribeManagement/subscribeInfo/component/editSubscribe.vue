<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
      <fj-form-item label="公司名称" prop="companyName">
        <fj-input v-model="formData.companyName" icon="icon-company" @focus="addCompanyDialogVisible=true" @on-icon-click="addCompanyDialogVisible=true" v-if="type === 'add'"></fj-input>
        <fj-input v-model="formData.companyName" :disabled="true" icon="icon-company" v-else></fj-input>
      </fj-form-item>
      <fj-form-item label="订阅类型" prop="subscribeType">
        <fj-select placeholder="请选择" v-model="formData.subscribeType" multiple v-if="status !== STATUS.EXPIRED">
          <fj-option
            v-for="item in SUBSCRIBE_TYPE"
            :key="item.value"
            :label="item.label"
            :value="item.key">
          </fj-option>
        </fj-select>
        <div class="subscribe-type-tag" v-else><fj-tag v-for="tag in formData.subscribeType" :key="tag">{{getLabelByValue(tag, SUBSCRIBE_TYPE)}}</fj-tag></div>
      </fj-form-item>
      <fj-form-item label="下载时长" prop="downloadSeconds">
        <div class="group-input">
          <fj-input v-model="formData.downloadSeconds" :disabled="status === STATUS.EXPIRED"></fj-input>
        </div>
        <div class="group-input-unit">小时</div>
      </fj-form-item>
      <fj-form-item label="使用期限" prop="periodOfUse">
        <fj-select placeholder="请选择" v-model="formData.periodOfUse" :disabled="status === STATUS.EXPIRED">
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
          type="datetime"
          placeholder="请选择开始时间"
          v-model="formData.startTime"
          v-if="this.status == STATUS.UNUSED || this.type === 'add'"
        ></fj-date-picker>
        <fj-input :value="formatTime(formData.startTime)" :disabled="true" icon="icon-date" v-else></fj-input>
      </fj-form-item>
      <fj-form-item label="自动推送">
        <div class="subscribe-autopush">
          <fj-radio-group v-model="formData.autoPush">
            <fj-radio class="subscribe-autopush-checkbox"  :label="false">否</fj-radio>
            <fj-radio class="subscribe-autopush-checkbox"  :label="true">是</fj-radio>
          </fj-radio-group>
        </div>
      </fj-form-item>
      <fj-form-item label="转码模版">
        <transcode-template-list
          :data="formData.transcodeTemplates"
          @add-template="addTemplate"
          @delete-template="deleteTemplate"
        ></transcode-template-list>
      </fj-form-item>
      <fj-form-item label="转码脚本">
        <fj-input type="textarea" :rows="7" v-model="formData.transcodeTemplateSelector"></fj-input>
        <p class="template-download-link" @click="transcodeScriptDialogVisible=true">* 查看脚本说明</p>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm" v-if="status !== STATUS.EXPIRED">保存</fj-button>
    </div>
    <search-add-company
      :visible.sync="addCompanyDialogVisible"
      @add-owner="addOwner"
      :searchOwner="searchOwner"
      @search-user-api="searchOwnerClick"
      title="添加公司">
    </search-add-company>
    <transcode-script-dialog-view
      :visible.sync="transcodeScriptDialogVisible"
    ></transcode-script-dialog-view>
  </fj-slide-dialog>
</template>
<script>
  import searchAddCompany from '../../../role/searchAddUser';
  import { formatQuery, formatTime } from '../../../../../common/utils';
  import { getLabelByValue, getSubScribeTypeOptions } from '../config';
  import transcodeTemplateList from '../../../template/download/component/transcodeTemplateList';
  import transcodeScriptDialogView from '../../../template/download/component/transcodeScriptDialog';

  const api = require('../../../../../api/subscribeManagement');
  const configurationAPI = require('../../../../../api/configuration');
  const config = require('../config');

  export default {
    props: {
      type: String,
      title: String,
      id: String,
      status: {
        type: String
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-add-company': searchAddCompany,
      'transcode-template-list': transcodeTemplateList,
      'transcode-script-dialog-view': transcodeScriptDialogView
    },
    data() {
      return {
        transcodeScriptDialogVisible: false,
        mediaexpressDialogDisplay: false,
        isBtnLoading: false,
        SUBSCRIBE_TYPE: [],
        PERIOD_OF_USE: config.PERIOD_OF_USE,
        STATUS: config.STATUS,
        oldExpiredTime: '',
        formData: {
          _id: '',
          companyName: '',
          subscribeType: [],
          downloadSeconds: '',
          periodOfUse: '',
          startTime: '',
          autoPush: true,
          transcodeTemplateSelector: '',
          transcodeTemplates: [],
        },
        rules: {
          companyName: [
            { required: true, message: '请选择公司' }
          ],
          subscribeType: [
            { required: true, message: '请选择订阅类型' },
            { message: '请选择订阅类型', validator: (rule, value, callback) => {
              if (!value || value.length === 0) return false;
              return true;
            } }
          ],
          downloadSeconds: [
            { required: true, message: '请输入下载时长' },
            { message: '下载时长格式有误,请重新输入数字', validator: (rule, value, callback) => {
              value = value * 1;
              if (isNaN(value)|| value.constructor.name.toLocaleLowerCase() !== 'number') return false;
              return true;
            } }
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
      id(val) {
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
      this.initSubScribeType();
    },
    methods: {
      addTemplate(rows) {
        rows.forEach((item) => {
          this.formData.transcodeTemplates.push(item);
        });
      },
      deleteTemplate(rows) {
        rows.forEach(item => {
          const index = this.formData.transcodeTemplates.indexOf(item);
          if (index > -1) {
            this.formData.transcodeTemplates.splice(index, 1);
          }
        });
      },
      mediaExpressListConfirm(row) {
        this.formData.mediaExpressWhite = row.sender;
      },
      initEditUser() {
        this.$refs.editForm.clearErrors();
        this.dialogVisible = true;
        const me = this;
        if(this.status === this.STATUS.USING || this.status === this.STATUS.EXPIRED) {
          this.rules['startTime'] = [
            {required: true, message: '请选择开始时间'},
          ];
        }else{
          this.rules['startTime'] = [
            { required: true, message: '请选择开始时间' },
            { message: '开始时间不得早于当前时间', validator: (rule, value, callback) => {
              if (new Date(value) < new Date()) return false;
              return true;
            } }];
        }
        api.getSubscribeInfo(formatQuery({ _id: this.id }, true))
          .then((res) => {
            me.formData = Object.assign({}, me.formData, res.data);
            me.formData.downloadSeconds = me.formData.downloadSeconds/(60*60);
            me.oldStartTime = res.data.startTime;
            const templateDetail = me.formData.transcodeTemplateDetail;
            me.formData.transcodeTemplates = templateDetail ? templateDetail.transcodeTemplates : [];
            me.formData.transcodeTemplateSelector = templateDetail ? templateDetail.transcodeTemplateSelector : '';
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      initSubScribeType(){
        const query = { pageSize: 999 };
        const me = this;
        api.listSubscribeType(formatQuery(query, true))
          .then((res) => {
            me.SUBSCRIBE_TYPE = getSubScribeTypeOptions(res.data.docs);
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      resetFormData() {
        this.$refs.editForm.clearErrors();
        this.formData = {
          _id: '',
          companyName: '',
          subscribeType: [],
          downloadSeconds: '',
          periodOfUse: '',
          startTime: '',
          autoPush: true,
          transcodeTemplateSelector: '',
          transcodeTemplates: []
        };
        this.rules['startTime'] = [
          { required: true, message: '请选择开始时间' },
          { message: '开始时间不得早于当前时间', validator: (rule, value, callback) => {
            console.log(value);
            if (new Date(value) < new Date()) return false;
            return true;
          } }];
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
        me.formData.transcodeTemplateDetail = {
          transcodeTemplates: me.formData.transcodeTemplates,
          transcodeTemplateSelector: me.formData.transcodeTemplateSelector
        }
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
        me.formData.transcodeTemplateDetail = {
          transcodeTemplates: me.formData.transcodeTemplates,
          transcodeTemplateSelector: me.formData.transcodeTemplateSelector
        }
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

      },
      formatTime,
      getLabelByValue
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

  .subscribe-type-tag {
    padding-top: 5px;
  }

  .subscribe-type-tag .fj-tag {
    background-color: #F4F4F4;
  }

  .subscribe-autopush-checkbox {
    margin-right: 10px;
  }

  .subscribe-autopush {
    margin-left: -22px;
    padding-top: 7px;
  }
</style>

