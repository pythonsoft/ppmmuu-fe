<template>
  <layout-two-row-title>
    <template slot="title">
      关于
    </template>
    <template slot="content">
      <div class="about-item">
        <div class="title">简介</div>
        <p class="content">
          凤凰卫视控股有限公司是全球性华语卫星电视频道。凤凰卫视的主持人来自于中国大陆、港澳和台湾地区。
          凤凰卫视是华语媒体中最有影响力的媒体之一，是中国大陆地区最先获得落地权的境外电视媒体之一。
          总部位于香港，大陆中心在深圳。凤凰卫视在香港取得的只是“非本地电视节目服务牌照”。
        </p>
        <p class="content">
          前身是星空传媒旗下的卫视中文台，于1991年开播。
          其后，卫星电视有限公司被新闻集团收购，随即进行改组，并引入刘长乐和陈永棋等人作为投资人。
        </p>
        <p class="content">
          港澳和台湾地区。凤凰卫视是华语媒体中最有影响力的媒体之一，是中国大陆地区最先获得落地权的境外电视媒体之一。
          总部位于香港，大陆中心在深圳。
          凤凰卫视在香港取得的只是“非本地电视节目服务牌照”。
        </p>
      </div>
      <div class="about-item">
        <div class="title">相关系统</div>
        <div class="about-system-item">
          <div class="subtitle">ump系统</div>
          <div class="about-system-item-title">
            当前版本1.5.4.0
            <div class="about-system-update-bar">
              <fj-button type="primary" size="mini" :loading="isBtnLoading" @click="handleClick">
                上传安装包(.zip)
              </fj-button>
              <input ref="helpPackageUploadBtn" accept="application/zip" class="about-upload-input" @change="(event) => upload(event)" type="file">
            </div>
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>*.下载模板--分组不能删除</li>
              <li>*.转码模板--添加水印设置</li>
              <li>*.下载模板--转码脚本优化</li>
              <li>*.条目信息如果没有内容显示无 </li>
              <li>*.添加用户时，需要明显提显是什么原因失败 </li>
              <li>*.订阅－非视频详情页的视频播放按钮去掉 </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </layout-two-row-title>
</template>
<script>
  import './index.css';
  import utils from '../../../../common/utils';
  import LayoutTwoRowTitle from '../../../../component/layout/twoRowTitle/index';
  import FjInput from "../../../../component/fjUI/packages/input/src/input.vue";

  const api = require('../../../../api/help');

  export default {
    components: {
      FjInput,
      LayoutTwoRowTitle
    },
    data() {
      return {
        isBtnLoading: false,
      };
    },
    created() {

    },
    destroyed() {
    },
    methods: {
      handleClick() {
        const fileBtnEl = this.$refs.helpPackageUploadBtn;
        if(!this.isBtnLoading) {
          fileBtnEl.click();
        }
      },
      upload(event) {
        const me = this;
        const file = event.target.files[0];

        if (file.type !== 'application/zip') {
          this.$message.error('文件zip类型!');
          return false;
        }

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        };
        const param = new FormData(); // 创建form对象
        param.append('file', file, file.name); // 通过append向form对象添加数据
        me.isBtnLoading = true;

        api.uploadPackage(param).then((res) => {
          me.isBtnLoading = false;
        }).catch((error) => {
          me.isBtnLoading = false;
          me.$message.error(error);
        });

        return true;
      }
    }
  }
</script>
