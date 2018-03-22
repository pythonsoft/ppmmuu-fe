<template>
  <div>
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="120px">
      <template v-for="(section, key) in fields">
        <h3 class="template-dialog-section-title">{{ key }}</h3>
        <div v-for="item in section" class="template-dialog-section-item">
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
              <div class="template-transcode-watermark" v-if="item.field==='watermarkFile'">
                <upload-img
                  :maxSize="4"
                  :imgPath="watermarkUrl"
                  @img-change="imgChange"></upload-img>
              </div>
              <fj-input v-model="formData[item.field]" v-else></fj-input>
            </template>
          </fj-form-item>
          <span v-if="item.unit" class="template-dialog-unit">{{ item.unit }}</span>
        </div>
      </template>
    </fj-form>
    <div class="dialog-footer template-dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
  </div>
</template>
<script>
  import '../index.css';
  import UploadImg from './uploadImg';
  import { formatQuery } from '../../../../../common/utils';

  const api = require('../../../../../api/job');
  const config = require('../config');
  const templateApi = require('../../../../../api/template');

  export default {
    name: 'templateDownloadForm',
    props: {
      templateInfo: Object,
      type: String
    },
    components: {
      'upload-img': UploadImg
    },
    created() {
      if (this.type !== 'add') {
        this.initParam();
        this.formData = Object.assign({}, this.formData, this.templateInfo);
        if(this.templateInfo.watermarkFile && this.templateInfo.watermarkFile !== 'null'){
          this.watermarkUrl = templateApi.getWatermark(formatQuery(this.templateInfo.watermarkFile));
        }
      }else{
        this.initParam();
      }
    },
    data() {
      return {
        fields: Object.assign({}, config.basicFields, config.videoFields, config.audioFields),
        formData: config.getFormData(),
        isBtnLoading: false,
        watermarkUrl: '',
        rules: config.getFormRules(),
        fieldsType: 'video'
      };
    },
    watch: {
      'formData.fileformat'(val) {
        if (config.videoType.indexOf(val) > -1 && this.fieldsType !== 'video') {
          this.fields = Object.assign({}, config.basicFields, config.videoFields);
          this.rules = config.getFormRules();
          this.fieldsType = 'video';
        } else if(config.audioType.indexOf(val) > -1 && this.fieldsType !== 'audio') {
          this.fields = Object.assign({}, config.basicFields, config.audioFields);
          this.rules = config.getFormRules(['basicFields', 'audioFields']);
          this.fieldsType = 'audio';
        }
      }
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
            let fieldNames = [];
            if (this.fieldsType === 'video') {
              fieldNames = Object.keys(config.getFormData());
            } else {
              fieldNames = Object.keys(config.getFormData(['basicFields', 'audioFields']));
            }

            const reqData = {};
            const formData = this.formData;
            const fields = this.fields;
            const fieldKeys = Object.keys(fields);
            fieldNames.forEach(key => {
              reqData[key] = formData[key];
              for (let i = 0, len = fieldKeys.length; i < len; i++) {
                const field = fields[fieldKeys[i]];
                if (field[key]) {
                  if (field[key].formatter) {
                    reqData[key] = field[key].formatter(formData[key]);
                  }
                  break;
                }
              }
            });
            if (me.type === 'add') {
              this.add(reqData);
            } else {
              this.update(reqData);
            }
          }
        });
      },
      add(reqData) {
        const me = this;
        const wh = reqData.wh.split('x');
        reqData.w = wh[0];
        reqData.h = wh[1];

        api.createTemplate({createJson: reqData}, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      update(reqData) {
        const me = this;
        const wh = reqData.wh.split('x');
        reqData.w = wh[0];
        reqData.h = wh[1];

        api.updateTemplate({updateJson: reqData}, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error || '保存出错');
        });

        return false;
      },
      imgChange(cover) {
        this.formData['watermarkFile'] = cover;
        this.watermarkUrl = templateApi.getWatermark(formatQuery(cover));
      }
    }
  };
</script>
