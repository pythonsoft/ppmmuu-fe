<template>
  <div style="position:relative;">
    <div class="upload-img-content">
      <img :src="path" class="upload-img-content-photo" :style="imgStyle">
    </div>
    <input id="img-input" accept="image/gif,image/png,image/jpeg,image/bmp" class="upload-img-input" @change='chooseImg' type="file">
    <label for="img-input" class="upload-img-content-change">修改头像</label>
  </div>
</template>
<script>
  const api = require('../../../api/upload');

  export default {
    name: 'uploadImg',
    props: {
      imgPath: {
        type: String,
        default: ''
      },
      maxSize: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        path: this.imgPath,
        imgStyle: {}
      };
    },
    mounted() {
    },
    created() {
      if (!this.path) {
        this.imgStyle = { background: 'url(../../../img/avatar.png) no-repeat', backgroundSize: '100% 100%', overflow: 'hidden' };
      }
    },
    watch: {
      imgPath(val) {
        this.path = val;
      }
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      addImg() {

      },
      chooseImg(event) {
        const img = event.target.files[0];
        const me = this;
        if (!/^image/.test(img.type)) {
          this.$message.error('文件不是图片类型!');
          return false;
        }
        const size = Math.floor(img.size / 1024);
        if (size > 1024 * this.maxSize) {
          this.$message.error(`图片不能大于${this.maxSize}M!`);
          return false;
        }

        const param = new FormData(); // 创建form对象
        param.append('file', img, img.name);// 通过append向form对象添加数据
        param.append('chunk', '0');// 添加form表单中其他数据
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }; // 添加请求头

        api.upload(param, config)
          .then((res) => {
            me.path = res.data;
            me.$emit('img-change', res.data);
          })
          .catch((error) => {
            me.$message.error(error);
          });
        return true;
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

  .upload-img-input {
    position: absolute;
    left: -9999px;
  }

  .upload-img-content-change {
    font-size: 12px;
    color: #1497D6;
    position: absolute;
    top: 74px;
    left: 5px;
    z-index: 1;
  }
</style>
