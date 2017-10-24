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
            当前版本1.5.1.0
            <div class="about-system-update-bar">
              <fj-button type="primary" size="mini" :loading="isBtnLoading" @click="upload">上传安装包</fj-button>
            </div>
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>*.视频播放路径变更</li>
              <li>*.媒体库－从其他页面跳转到媒体库页面时没有上架按钮，需要重新刷新页面才出现上架按钮 。</li>
              <li>*.订阅－视频详情页条目信息改为“节目简介”，字段信息顺序调整。</li>
              <li>*.媒体库--首页及检索结果页默认使用发布时间排倒序。</li>
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
      upload() {

      },
    }
  };
</script>
