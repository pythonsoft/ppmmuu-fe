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
          <fj-select v-else-if="item.type === 'select'" placeholder="请选择" v-model="formData[item.valueName]">
            <fj-option
              v-for="item in item.options"
              :key="item.label+item.value"
              :label="item.label"
              :value="item.value">
            </fj-option>
          </fj-select>
        </fj-form-item>
      </div>
      <div :class="$style.formItemL">
        <fj-form-item label="内容" prop="name">
          <fj-input v-model="formData.name" type="textarea" :rows="4" />
        </fj-form-item>
      </div>
      <template v-if="isShowMore">
        <div
          :class="$style.formItem"
          v-for="(item, index) in FORM_ITEM_MORE"
          :key="'FORM_ITEM_MORE'+index">
          <fj-form-item :label="item.label" :prop="item.propName">
            <fj-input v-if="item.type === 'text'" v-model="formData[item.valueName]" type="text" />
            <fj-select v-else-if="item.type === 'select'" placeholder="请选择" v-model="formData[item.valueName]">
              <fj-option
                v-for="item in item.options"
                :key="item.label+item.value"
                :label="item.label"
                :value="item.value">
              </fj-option>
            </fj-select>
            <fj-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.valueName]" :custom-class="$style.radioGroup">
              <fj-radio v-for="radio in item.options" :key="radio.label+radio.value" :label="radio.value">{{ radio.label }}</fj-radio>
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
      <fj-button type="primary" :loading="isBtnLoading" @click="">入库</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="">入库并上架</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const FORM_ITEM_BASE = [
    { label: '节目类型', propName: 'name', valueName: 'name1', type: 'select', options: [] },
    { label: '名称(中文)', propName: 'name', valueName: 'name2', type: 'text' },
    { label: '关键字', propName: 'name', valueName: 'name3', type: 'text' },
    { label: '名称(英文)', propName: 'name', valueName: 'name4', type: 'text' }
  ];
  const FORM_ITEM_MORE = [
    { label: '名称', propName: 'name', valueName: 'name5', type: 'text' },
    { label: '编目类', propName: 'name', valueName: 'name6', type: 'select', options: [] },
    { label: '编目人', propName: 'name', valueName: 'name7', type: 'text' },
    { label: '新闻类型', propName: 'name', valueName: 'name8', type: 'select', options: [] },
    { label: '人物', propName: 'name', valueName: 'name9', type: 'text' },
    { label: '事发国家', propName: 'name', valueName: 'name11', type: 'select', options: [] },
    { label: '净长', propName: 'name', valueName: 'name22', type: 'text' },
    { label: '版本', propName: 'name', valueName: 'name33', type: 'select', options: [] },
    { label: '语言', propName: 'name', valueName: 'name44', type: 'text' },
    { label: '制作地点', propName: 'name', valueName: 'name55', type: 'select', options: [] },
    { label: '是否归档', propName: 'name', valueName: 'name66', type: 'radio', options: [
      { label: '是', value: '1' },
      { label: '否', value: '0' }
     ] },
    { label: '新闻日期', propName: 'name', valueName: 'name77', type: 'date' },
    { label: '高标清', propName: 'name', valueName: 'name88', type: 'radio', options: [
      { label: '高清', value: '1' },
      { label: '标清', value: '0' }
     ] },
    { label: '首播日期', propName: 'name', valueName: 'name99', type: 'date' }
  ];
  export default {
    props: {
      dialogVisible: Boolean
    },
    data() {
      return {
        parentEl: '',
        FORM_ITEM_BASE: FORM_ITEM_BASE,
        FORM_ITEM_MORE: FORM_ITEM_MORE,
        visible: this.dialogVisible,
        isShowMore: false,
        formData: {
          name1: '',
          name2: '',
          name3: '',
          name4: '',
          name5: '',
          name6: '',
          name7: '',
          name8: '',
          name9: '',
          name11: '',
          name22: '',
          name33: '',
          name44: '',
          name55: '',
          name66: '',
          name77: '',
          name88: '',
          name99: ''
        },
        rules: {
          name: [
            { message: '请输入名称', validator: (rule, value, callback) => { return true; } }
          ]
        },
        isBtnLoading: false
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
      }
    },
    mounted() {
      this.parentEl = this.$refs.dialogContent;
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false);
      },
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
