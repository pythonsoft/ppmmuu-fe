<template>
  <fj-dialog
    title="提交"
    :visible.sync="visible"
  >
    <ul v-show="step === 1" :class="$style.listWrap">
      <li>大洋新闻系统</li>
    </ul>
    <fj-form v-show="step === 2" :model="formData" label-width="80px">
      <template v-for="configItem in config">
        <fj-form-item :label="configItem.label" :key="configItem.key">
          <fj-radio-group v-if="configItem.type === 'label'" v-model="configItem.selected" :custom-class="$style.radioGroup">
            <fj-radio v-for="radio in configItem.items" :key="radio.label+radio.value" :label="radio.value">{{ radio.label }}</fj-radio>
          </fj-radio-group>
          <fj-select v-else-if="configItem.type === 'select'" placeholder="请选择" v-model="configItem.selected">
            <fj-option
              v-for="item in configItem.items"
              :key="item.label+item.value"
              :label="item.label"
              :value="item.value">
            </fj-option>
          </fj-select>
        </fj-form-item>
      </template>
    </fj-form>
    <div slot="footer" class="dialog-footer">
      <fj-button @click.stop="handleClose">取消</fj-button><!--
      --><fj-button type="primary" @click="handleSubmitBtnClick" :loading="isLoading">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import manuscriptAPI from '../../../api/manuscript';
  export default {
    props: {
      dialogVisible: Boolean
    },
    data() {
      return {
        step: 1,
        visible: this.dialogVisible,
        config: [],
        formData: {},
        isLoading: false
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
        this.isLoading = false;
        if (val && this.config.length === 0) {
          this.getCopyConfig();
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false);
      },
      getCopyConfig() {
        manuscriptAPI.getManuscriptConfig()
          .then((response) => {
            this.config = response.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSubmitBtnClick() {
        if (this.step === 1) {
          this.step = 2;
        } else if (this.step === 2) {
          this.isLoading = true;
          const data = { toWhere: 'DAYANG' };
          this.config.forEach(item => {
            data[item.key] = item.selected;
          });
          this.$emit('submit', data);
        }
      }
    }
  };
</script>
<style module>
  .listWrap {
    padding: 8px 0;
    background: #fff;
    border: 1px solid #CED9E5;
    border-radius: 4px;
    max-height: 300px;
    overflow: auto;
  }
  .listWrap li {
    background: #9FB3CA;
    font-size: 12px;
    padding: 6px 20px;
    color: #fff;
  }
  .radioGroup {
    line-height: 36px;
  }
  .radioGroup label {
    margin-right: 20px;
  }
</style>
