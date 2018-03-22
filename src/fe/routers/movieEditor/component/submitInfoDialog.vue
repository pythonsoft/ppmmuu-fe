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
          <fj-form-item :label="item.label" :prop="item.propName">
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
      <fj-button type="primary" :loading="isBtnLoading" @click="warehouse('1')">入库</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="warehouse('2')">入库并上架</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import { transformSecondsToStr } from '../../../common/utils';
  import { selectFields, dateFields, radioFields} from '../../library/config';
  import { getItemFromLocalStorage } from '../../../common/utils';
  const FORM_ITEM_BASE = [
    { label: '节目类型', propName: 'type', valueName: 'type', type: 'select', options: [] },
    { label: '名称(中文)', propName: 'chineseName', valueName: 'chineseName', type: 'text' },
    { label: '关键字', propName: 'keyword', valueName: 'keyword', type: 'text' },
    { label: '名称(英文)', propName: 'englishName', valueName: 'englishName', type: 'text' }
  ];
  const FORM_ITEM_MORE = [
    { label: '名称', propName: 'name', valueName: 'name', type: 'text' },
    { label: '编目类', propName: 'ccid', valueName: 'ccid', type: 'select', options: [] },
    { label: '编目人', propName: 'owner', valueName: 'owner', type: 'text', disabled: true },
    { label: '新闻类型', propName: 'newsType', valueName: 'newsType', type: 'select', options: [] },
    { label: '人物', propName: 'keyman', valueName: 'keyman', type: 'text' },
    { label: '事发国家', propName: 'occurCountry', valueName: 'occurCountry', type: 'select', options: [] },
    { label: '净长', propName: 'duration', valueName: 'duration', type: 'text', disabled: true },
    { label: '版本', propName: 'version', valueName: 'version', type: 'select', options: [] },
    { label: '语言', propName: 'language', valueName: 'language', type: 'text' },
    { label: '制作地点', propName: 'madeLocation', valueName: 'madeLocation', type: 'select', options: [] },
    { label: '是否归档', propName: 'pigeonhole', valueName: 'pigeonhole', type: 'radio', options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
     ] },
    { label: '新闻日期', propName: 'newsTime', valueName: 'newsTime', type: 'date' },
    { label: '高标清', propName: 'hdFlag', valueName: 'hdFlag', type: 'radio', options: [
      { label: '高清', value: '1' },
      { label: '标清', value: '0' }
     ] },
    { label: '首播日期', propName: 'airTime', valueName: 'airTime', type: 'date' }
  ];
  export default {
    props: {
      dialogVisible: Boolean,
      sequences: Array
    },
    data() {
      return {
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
          language: '',
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
          englishName: [
            { required: true, message: '请输入名称' }
          ],
          keyword: [
            { required: true, message: '请输入关键字' }
          ],
          type: [
            { required: true, message: '请输入类型' }
          ],
          version: [
            { required: true, message: '请输入版本' }
          ],
          keyman: [
            { required: true, message: '请输入人物' }
          ],
          language: [
            { required: true, message: '请输入语言' }
          ],
          content: [
            { required: true, message: '请输入内容' }
          ],
          ccid: [
            { required: true, message: '请选择编目类'}
          ],
          newsType: [
            { required: true, message: '请选择新闻类型'}
          ],
          occurCountry: [
            { required: true, message: '请选择事发国家'}
          ],
          version: [
            { required: true, message: '请选择版本'}
          ],
          madeLocation: [
            { required: true, message: '请选择制作地点'}
          ],
          resourceDepartment: [
            { required: true, message: '请选择编目类'}
          ],
          newsTime: [
            { required: true, message: '请输入新闻日期'}
          ],
          airTime: [
            { required: true, message: '请输入首播日期'}
          ]
        },
        owner: { _id: '', name: '' },
        isBtnLoading: false
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
      },
      sequences(val) {
        const duration = val.reduce((accumulator, currentValue)=> {
          return accumulator + parseFloat(currentValue.duration);
        }, 0);
        this.formData.duration = transformSecondsToStr(duration);
      }
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
      warehouse(warehouseType) {
        const reqData = { warehouseType };

        // 根据sequences封装fileinfos
        const fileInfos = [];
        const objectIds = [];
        for (let i = 0, sequences = this.sequences; i < sequences.length; i++) {
          const { objectId, fromWhere, title: fileName, range } = sequences[i];
          const index = objectIds.indexOf(objectId);
          if (index < 0) {
            objectIds.push(objectId);
            fileInfos.push({ objectId, fromWhere, fileName, inpoint: [range[0]], outpoint: [range[1]] });
          } else {
            fileInfos[index].inpoint.push(range[0]);
            fileInfos[index].outpoint.push(range[1]);
          }
        }
        reqData.fileInfos = fileInfos;

        reqData.catalogInfo = Object.assign({}, this.formData, { owner: this.owner });
        console.log('reqData', reqData);
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log('validate');
          }
        });
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
    max-height: 300px;
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
