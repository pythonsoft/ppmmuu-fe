<template>
  <layout-two-row-title>
    <template slot="title">
      关于
    </template>
    <template slot="content">
      <div class="about-item">
        <h1>简介</h1>
        <p>
          凤凰卫视控股有限公司是全球性华语卫星电视频道。凤凰卫视的主持人来自于中国大陆、港澳和台湾地区。
          凤凰卫视是华语媒体中最有影响力的媒体之一，是中国大陆地区最先获得落地权的境外电视媒体之一。
          总部位于香港，大陆中心在深圳。凤凰卫视在香港取得的只是“非本地电视节目服务牌照”。
        </p>
        <p>
          前身是星空传媒旗下的卫视中文台，于1991年开播。
          其后，卫星电视有限公司被新闻集团收购，随即进行改组，并引入刘长乐和陈永棋等人作为投资人。
        </p>
        <p>
          港澳和台湾地区。凤凰卫视是华语媒体中最有影响力的媒体之一，是中国大陆地区最先获得落地权的境外电视媒体之一。
          总部位于香港，大陆中心在深圳。
          凤凰卫视在香港取得的只是“非本地电视节目服务牌照”。
        </p>
      </div>
      <div class="about-item">
        <h1>相关系统</h1>
        <div class="about-system-item">
          <h2>ump系统</h2>
          <div class="about-system-item-title">
            当前版本10.10.10.10（已是最新版本）
          </div>
          <div>
            <h3>版本信息</h3>
            <ul>
              <li>1. 凤凰卫视卫星频道随着凤凰卫视有限公司的成立同步启播。</li>
              <li>2.凤凰卫视正式启用“快博客”三拼域名kuaiboke com推出凤凰快博分享平台。</li>
              <li>3.凤凰卫视还拥有凤凰周刊和凤凰网，使集团成为一间在国际社会享有盛誉的多媒体跨国机构。</li>
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
