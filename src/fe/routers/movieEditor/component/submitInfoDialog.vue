<template>
  <fj-dialog
    width="596px"
    title="填写编目信息"
    :visible.sync="visible"
    @close="handleClose"
  >
    <div :class="['clearfix', $style.content]" ref="dialogContent">
    <fj-form :model="formData" :rules="rules" ref="form" label-width="80px">
      <div
        :class="$style.formItem"
        v-for="(item, index) in FORM_ITEM_BASE"
        :key="'FORM_ITEM_BASE'+index">
        <fj-form-item :label="item.label" :prop="item.propName">
          <fj-input v-if="item.type === 'text'" v-model="formData[item.valueName]" type="text" />
          <fj-select v-else-if="item.type === 'select'" placeholder="请选择" v-model="formData[item.valueName]" :parent-el="parentEl">
            <fj-option
              v-for="option in selectFields[item.propName].items"
              :key="option.label+option.value"
              :label="option.label"
              :value="option.value">
            </fj-option>
          </fj-select>
        </fj-form-item>
      </div>
      <div :class="$style.formItemL">
        <fj-form-item label="内容" prop="content">
          <fj-input v-model="formData.content" type="textarea" :rows="4" />
        </fj-form-item>
      </div>
      <template v-if="isShowMore">
        <div
          :class="$style.formItem"
          v-for="(item, index) in FORM_ITEM_MORE"
          :key="'FORM_ITEM_MORE'+index">
          <fj-form-item :label="item.label" :prop="item.propName" v-if="isShow(item)">
            <fj-input v-if="item.type === 'text'" v-model="formData[item.valueName]" type="text" :disabled="item.disabled" />
            <fj-select v-else-if="item.type === 'select'" placeholder="请选择" v-model="formData[item.valueName]" :parent-el="parentEl">
              <fj-option
              v-for="option in selectFields[item.propName].items"
              :key="option.label+option.value"
              :label="option.label"
              :value="option.value">
              </fj-option>
            </fj-select>
            <fj-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.valueName]" :custom-class="$style.radioGroup">
              <fj-radio v-for="radio in radioFields[item.propName].items" :key="radio.label+radio.value" :label="radio.value">{{ radio.label }}</fj-radio>
            </fj-radio-group>
            <fj-date-picker
              v-else
              type="date"
              format="YYYY-MM-DD"
              theme="stroke"
              placeholder="请选择日期"
              v-model="formData[item.valueName]"
              :parent-el="parentEl"></fj-date-picker>
          </fj-form-item>
        </div>
      </template>
    </fj-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <div :class="$style.showMoreBtn">
        <fj-button type="text" @click="isShowMore=!isShowMore">{{ isShowMore ? '取消高级信息编辑' : '高级信息编辑' }}</fj-button>
      </div>
      <fj-button type="primary" @click="showTemplate" :loading="isBtnLoading">发布</fj-button>
    </div>
    <template-browser
            :visible.sync="templateBrowserVisible"
            groupName="media_editor_export"
            @confirm="warehouse"
    ></template-browser>
  </fj-dialog>
</template>
<script>
  import TemplateBrowser from './templateBrowser';
  import { secondsToTimeCode, formatDuration } from '../../../common/utils';
  import { selectFields, dateFields, radioFields} from '../../library/config';
  import { getItemFromLocalStorage } from '../../../common/utils';

  const api = require('../../../api/ivideo');
  const FORM_ITEM_BASE = [
    { label: '节目类型', propName: 'type', valueName: 'type', type: 'select', options: [] },
    { label: '名称(中文)', propName: 'chineseName', valueName: 'chineseName', type: 'text' },
    { label: '关键字', propName: 'keyword', valueName: 'keyword', type: 'text' },
    { label: '名称(英文)', propName: 'englishName', valueName: 'englishName', type: 'text' }
  ];
  const FORM_ITEM_MORE = require('./formConfig');
  const FIELD_MAP = {
    type: 'FIELD276',
    chineseName: 'FIELD195',
    keyword: 'FIELD56',
    englishName: 'FIELD196',
    name: 'FIELD01',
    ccid: 'CCID',
    newsType: 'FIELD145',
    keyman: 'FIELD100',
    occurCountry: 'FIELD324',
    version: 'FIELD263',
    language: 'FIELD262',
    madeLocation: 'FIELD223',
    newsTime: 'FIELD162',
    airTime: 'FIELD36'
  };

  export default {
    props: {
      dialogVisible: Boolean,
      sequences: Array
    },
    components: {
      TemplateBrowser,
    },
    data() {
      return {
        templateBrowserVisible: false,
        parentEl: '',
        FORM_ITEM_BASE: FORM_ITEM_BASE,
        FORM_ITEM_MORE: FORM_ITEM_MORE,
        selectFields: selectFields,
        radioFields: radioFields,
        dateFields: dateFields,
        visible: this.dialogVisible,
        isShowMore: false,
        formData: {
          type: '',
          chineseName: '',
          keyword: '',
          englishName: '',
          name: '',
          ccid: '',
          owner: '',
          newsType: '',
          keyman: '',
          occurCountry: '',
          duration: '',
          version: '',
          language: 'f_chinese',
          madeLocation: '',
          pigeonhole: '是',
          newsTime: '',
          hdFlag: 1,
          airTime: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          chineseName: [
            { required: true, message: '请输入名称' }
          ],
          type: [
            { required: true, message: '请输入类型' }
          ],
          language: [
            { required: true, message: '请输入语言' }
          ],
          content: [
            { required: true, message: '请输入内容' }
          ],
          resourceDepartment: [
            { required: true, message: '请选择编目类'}
          ],
          hdFlag: [
            { required: true, message: '请选择高标清' }
          ],
        },
        owner: { _id: '', name: '' },
        isBtnLoading: false,
        type: '宣傳',
      };
    },
    watch: {
      dialogVisible(val) {
        const defaultFormData = this.sequences[0].detail;
        const keys = Object.keys(FIELD_MAP);
        keys.forEach(key => {
          this.formData[key] = defaultFormData[FIELD_MAP[key]] || '';
        });
        if (!this.formData.language) {
          this.formData.language = 'f_chinese';
        }
        this.visible = val;
      },
      sequences(val) {
        const duration = val.reduce((accumulator, currentValue)=> {
          return accumulator + parseFloat(currentValue.duration);
        }, 0);
        this.formData.duration = secondsToTimeCode(duration);
      },
      'formData.type'(val) {
        if (val) {
          this.type = val;
        }
      },
    },
    mounted() {
      this.parentEl = this.$refs.dialogContent;
      const userInfo = getItemFromLocalStorage('userInfo');
      this.formData.owner = userInfo.name;
      this.owner = { _id: userInfo._id, name: userInfo.name };
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false);
      },
      showTemplate() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.templateBrowserVisible = true;
          }
        });
      },
      warehouse(row) {
        const processParams = row.params;
        const reqData = {
          workflowId: '',
          priority: 0,
          parms: {
            templateId: '',
            orgFiles: []
          },
        };

        for (let i = 0, len = processParams.length; i< len; i++) {
          if (processParams[i].key === 'workflowId') {
            reqData.workflowId = processParams[i].value;
          } else if (processParams[i].key === 'priority') {
            reqData.priority = processParams[i].value * 0;
          } else if (processParams[i].key === 'templateId') {
            reqData.parms.templateId = processParams[i].value;
          }
        }

        // 根据sequences封装fileinfos
        const fileInfos = [];
        const objectIds = [];
        for (let i = 0, sequences = this.sequences; i < sequences.length; i++) {
          const { objectId, fromWhere, title: fileName, range } = sequences[i];
          const fileType = sequences[i].filetypeid;
          const index = objectIds.indexOf(objectId);
          if (index < 0) {
            objectIds.push(objectId);
            const startTime = formatDuration(range[0]*1000, true);
            const endTime = formatDuration(range[1]*1000, true);
            fileInfos.push({ objectId, fromWhere, fileType,fileName, parts: [startTime, endTime].join(',') });
          } else {
            const startTime = formatDuration(range[0]*1000, true);
            const endTime = formatDuration(range[1]*1000, true);
            const newParts = [startTime, endTime].join(',');
            fileInfos[index].parts = [fileInfos[index].parts, newParts].join('|');
          }
        }
        reqData.parms.orgFiles = fileInfos;

        reqData.parms.catalogInfo = Object.assign({}, this.formData, { ownerId: this.owner._id, ownerName: this.owner.name, inpoint: 0, outpoint: 0 });
        reqData.parms.catalogName = reqData.parms.catalogInfo.chineseName || '';
        this.isBtnLoading = true;
        this.templateBrowserVisible = false;
        api.warehouse(reqData)
            .then((res) => {
              this.$message.success('发布成功');
            })
            .catch((error) => {
              this.$message.error(error);
            })
            .then(() => {
              this.isBtnLoading = false;
              this.visible = false;
            });
      },
      isShow(item) {
        if (!item.show) {
          return true;
        }

        if (item.show && typeof item.show === 'function') {
          if (item.show(this.type)) {
            return true;
          }
        }
        return false;
      }
    }
  };
</script>
<style module>
  .formItem {
    float: left;
    width: 50%;
  }
  .formItemL {
    float: left;
    width: 100%;
  }
  .content {
    max-height: 650px;
    /*margin: 0 -10px;*/
    overflow-y: auto;
  }
  .radioGroup {
    line-height: 36px;
  }
  .radioGroup label {
    margin-right: 20px;
  }
  .showMoreBtn {
    float: left;
    line-height: 34px;
  }
</style>
