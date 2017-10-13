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
            当前版本1.4.0.0（已是最新版本）
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>1.引擎管理--安装客户端时显示安装进度</li>
              <li>2.引擎管理--安装过后的机器一直显示宕机状态。</li>
              <li>3.下载任务--修改时间有些为空。</li>
              <li>4.下载任务列表需要按时间倒序排列。</li>
              <li>5.转码模板不能更新</li>
              <li>6.下载任务fileName为空。</li>
              <li>7.不同的用户下载路径不正确。</li>
              <li>8.下载模板关联转码模板。</li>
              <li>9.帐户同步接口--允许批量提交数据。</li>
              <li>10.帐户同步接口--开放帐户类型。</li>
              <li>11.添加上架模块。</li>
              <li>12.引擎安装时需要输入目录机器帐户及密码。</li>
              <li>13.添加订阅管理模块。</li>
              <li>14.添加下载审核接口。</li>
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
