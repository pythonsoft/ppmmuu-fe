<template>
  <div style="position:relative;">
    <div class="shelf-upload-img-content" @click="handleClick">
      <template v-if="path">
        <img :src="path" class="shelf-upload-img-content-photo" @mouseenter="isHover=true">
      </template>
      <template v-else>
        <div :class="['shelf-upload-img-content-photo', !isLoading ? 'shelf-img-style': 'fj-button-loading']">
          <i class="iconfont fj-icon-loading shelf-img-loading" v-if="isLoading">&#xe674;</i>
        </div>
      </template>
    </div>
    <div class="img-hover-class" v-if="isHover" @click="handleClick" @mouseleave="isHover=false">
      <div><span class="iconfont icon-shangchuan"></span></div>
      <div class="upload-text">点击更改</div>
    </div>
    <input id="shelf-img-input" ref="fileBtn" accept="image/png,image/jpeg,image/bmp" class="shelf-upload-img-input" @change='chooseImg' type="file">
    <div class="upload-description">＊支持JPG、PNG格式，图片尺寸宽640高360px，大小在5M以内</div>
  </div>
</template>
<script>
  const api = require('../../../../../api/upload');
  const templateApi =require('../../../../../api/template')

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
        path: '',
        isLoading: false,
        isHover: false
      };
    },
    mounted() {
    },
    created() {
    },
    watch: {
      imgPath(val) {
        this.path = templateApi.getWatermark(val);
      }
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      addImg() {

      },
      handleClick() {
        const fileBtnEl = this.$refs.fileBtn;
        if(!this.isLoading) {
          fileBtnEl.click();
        }
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

        this.isLoading = true;
        api.uploadWatermark(param, config)
          .then((res) => {
            me.path = res.data;
            me.isLoading = false;
            me.$emit('img-change', res.data);
          })
          .catch((error) => {
            this.isLoading = false;
            me.$message.error(error);
          });
        return true;
      }
    }
  };
</script>
<style scope>
  .shelf-upload-img-content {
    width: 192px;
    height: 108px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .shelf-upload-img-content-photo {
    width: 192px;
    height: 108px;
    background: #EBF3FB;
  }

  .shelf-upload-img-input {
    position: absolute;
    left: -9999px;
  }

  .upload-description {
    position: absolute;
    top: 116px;
    left: 0;
    font-size: 12px;
    color: #4C637B;
  }

  .img-hover-class {
    width: 192px;
    height: 108px;
    position: absolute;
    padding-top:40px;
    padding-left: 80px;
    top: 0;
    left: 0;
    font-size: 12px;
    color: #9FB3CA;
    opacity: 0.5;
    background: #000000;
    z-index: 999;
  }

  .upload-text {
    margin-left: -10px;
  }

  .shelf-img-style {
    background: url(../../../../../img/clickUpload@2x.png) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }

  .shelf-img-loading {
    font-size: 30px;
    margin-left: 80px;
    margin-top: 30px;
  }
</style>
