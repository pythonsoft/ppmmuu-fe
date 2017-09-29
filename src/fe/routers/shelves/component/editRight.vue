<template>
  <div>
    <h1 class="shelf-edit-title">填写内容</h1>
    <fj-form :model="editorInfo" label-width="90px">
      <fj-form-item label="订阅类型">
        <fj-select v-model="editorInfo.subscribeType">
          <fj-option
                  v-for="(value, key) in subscribeType"
                  :key="key"
                  :value="key"
                  :label="value"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="来源">
        <fj-input v-model="editorInfo.source"></fj-input>
      </fj-form-item>
      <fj-form-item label="限制">
        <fj-input v-model="editorInfo.limit"></fj-input>
      </fj-form-item>
      <fj-form-item label="封面">
        <div class="shelf-edit-cover">
          <upload-img :imgPath="editorInfo.cover" @img-change="imgChange"></upload-img>
        </div>
      </fj-form-item>
    </fj-form>
  </div>
</template>

<script>
  import UploadImg from './uploadImg';

  const SUBSCRIBE_TYPE = {
    '0': '政治',
    '1': '体育',
    '2': '娱乐'
  }
  export default {
    components: {
      'upload-img': UploadImg
    },
    props: {
      editorInfo: {type: Object, default: {}}
    },
    data() {
      return {
        subscribeType: SUBSCRIBE_TYPE
      };
    },
    created() {
    },
    methods: {
      imgChange(cover) {
        this.editorInfo.cover = cover;
      }
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
    height: 130px;
  }
</style>