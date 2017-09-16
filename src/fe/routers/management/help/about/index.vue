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
            当前版本1.1.0.0（已是最新版本）
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>1.个人中心添加"历史记录"、"检索记录"两个模块。</li>
              <li>2.优化检索结果。</li>
              <li>3.视频剪辑工具添加下载任务监控。</li>
              <li>4.下载模块管理。</li>
              <li>5.与快传帐户绑定。</li>
              <li>6.添加AD同步接口。</li>
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

//  const api = require('../../../../api/transcode');

  export default {
    components: { LayoutTwoRowTitle },
    data() {
      return {
      };
    },
    created() {

    },
    destroyed() {
    },
    methods: {

    }
  };
</script>
