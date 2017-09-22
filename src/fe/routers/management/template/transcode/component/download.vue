<template>
  <div>
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="120px">
      <template v-for="item in fields">
        <fj-form-item :label="item.text" :prop="item.field">
          <template v-if="item.type==='select'">
            <fj-select v-model="formData[item.field]">
              <fj-option
                      v-for="option in item.options"
                      :key="option.key"
                      :value="option.value"
                      :label="option.text"></fj-option>
            </fj-select>
          </template>
          <template v-else>
            <fj-input v-model="formData[item.field]"></fj-input>
          </template>
        </fj-form-item>
      </template>
    </fj-form>
    <div class="template-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
  </div>
</template>
<script>
  import '../index.css';

  const api = require('../../../../../api/job');
  const config = require('../config');

  export default {
    name: 'templateDownloadForm',
    props: {
      templateInfo: Object,
      type: String,
    },
    created() {
      if (this.type !== 'add') {
        this.formData = Object.assign({}, this.templateInfo);
      }else{
        this.initParam();
      }
    },
    data() {
      return {
        fields: config.fields,
        formData: config.getFormData(),
        isBtnLoading: false,
        rules: config.getFormRules()
      };
    },
    methods: {
      initParam() {
        this.formData = config.getFormData()
      },
      close() {
        this.$emit('close');
      },
      submitForm() {
        const me = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (me.type === 'add') {
              this.add();
            } else {
              this.update();
            }
          }
        });
      },
      add() {
        const me = this;
        const wh = this.formData.wh.split('x');
        this.formData.w = wh[0];
        this.formData.h = wh[1];

        api.createTemplate({createJson: this.formData}, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      update() {
        const me = this;
        const wh = this.formData.wh.split('x');
        this.formData.w = wh[0];
        this.formData.h = wh[1];

        api.updateTemplate({updateJson: this.formData}, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error || '保存出错');
        });

        return false;
      },
    }
  };
</script>
