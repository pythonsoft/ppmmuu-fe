<template>
  <div>
    <div class="upload-img-content">
      <img :src="imgPath" class="upload-img-content-photo">
    </div>
    <span class="upload-img-content-change">修改头像</span>
  </div>
</template>
<script>

  export default {
    name: 'uploadImg',
    props: {
      imgPath: {
        type: String,
        default: 'https://console.szdev.cn/img/avatar.png'
      }
    },
    data() {
      return {
      };
    },
    mounted() {
    },
    watch: {
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style>
  .upload-img-content {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .upload-img-content-photo {
    width: 62px;
    height: 62px;
  }

  .upload-img-content-change {
    font-size: 12px;
    color: #1497D6;
  }
</style>