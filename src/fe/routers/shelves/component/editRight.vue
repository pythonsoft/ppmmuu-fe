<template>
  <div>
    <h1 class="shelf-edit-title">填写内容</h1>
    <fj-form :model="editorInfo" :rules="rules" ref="editorInfoForm" label-width="120px">
      <fj-form-item label="节目名称(中文)" prop="name">
        <fj-input v-model="editorInfo.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="订阅类型" prop="subscribeType">
        <fj-select
                :remote-method="remoteMethod"
                v-model="editorInfo.subscribeType"
                multiple>
          <fj-option
                  v-for="item in subscribeType"
                  :key="item.key"
                  :value="item.value"
                  :label="item.label"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="限制" prop="limit">
        <fj-input v-model="editorInfo.limit"></fj-input>
      </fj-form-item>
      <fj-form-item label="文件名" prop="fileName">
        <fj-input v-model="editorInfo.fileName" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="封面" prop="cover">
        <div class="shelf-edit-cover">
          <upload-img :imgPath="editorInfo.cover" @img-change="imgChange"></upload-img>
        </div>
      </fj-form-item>
    </fj-form>
  </div>
</template>

<script>
  import Vue from 'vue';
  import UploadImg from './uploadImg';
  import { formatQuery } from '../../../common/utils';
  import { getSubScribeTypeOptions } from '../../management/subscribeManagement/subscribeInfo/config';

  const api = require('../../../api/shelves');
  const uploadApi = require('../../../api/upload');

  export default {
    components: {
      'upload-img': UploadImg
    },
    props: {
      editorInfo: { type: Object, default: function(){ return {} } },
      vueInstance: {},
    },
    data() {
      return {
        subscribeType: [],
        rules: {
          name: [
            { required: true, message: '请输入节目名称' }
          ],
          subscribeType: [
            { required: true, message: '请选择订阅类型' },
          ],
          limit: [
            { required: true, message: '请输入限制' }
          ],
          cover: [
            { required: true, message: '请上传封面' }
          ]
        },
      };
    },
    watch: {
      editorInfo(val) {
        if(!val.subscribeType){
          val.subscribeType = [];
        }else if( val.subscribeType.constructor.name === 'String'){
          val.subscribeType = val.subscribeType.split(',');
        }
      }
    },
    created() {
      if(!this.editorInfo.subscribeType){
        this.editorInfo.subscribeType = [];
      }else if( this.editorInfo.subscribeType.constructor.name === 'String'){
        this.editorInfo.subscribeType = this.editorInfo.subscribeType.split(',');
      }
      this.initSubScribeType();
      if(this.vueInstance) {
        this.vueInstance.$on('screenshot', (base64) => {
          const cover = this.editorInfo.cover;
          if(cover){
            uploadApi.remove({path: cover})
              .then(() => {

              }).catch(() => {

              })
          }
          uploadApi.uploadBase64({base64: base64})
            .then((res) => {
              this.editorInfo.cover = res.data;
              this.vueInstance.$emit('uploadComplete');
              this.vueInstance.$emit('lastCover', this.editorInfo.cover);
            }).catch((error) => {
              this.vueInstance.$emit('uploadComplete');
              this.$message.error(error);
            })
        })
      }
    },
    methods: {
      imgChange(cover) {
        this.editorInfo.cover = cover;
      },
      initSubScribeType(){
        const me = this;
        api.listSubscribeType(formatQuery({}, true))
          .then((res) => {
            me.subscribeType = getSubScribeTypeOptions(res.data.docs);
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      remoteMethod() {

      },
    }
  }
</script>

<style scope>
  .shelf-edit-title {
    font-size: 12px;
    color: #2A3E52;
    margin-bottom: 38px;
    margin-left: 30px;
  }

  .shelf-edit-cover {
    margin-top: 20px;
    padding-top: 10px;
    height: 160px;
  }
</style>
