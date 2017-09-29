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
            当前版本1.3.0.0（已是最新版本）
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>1.添加入库模块</li>
              <li>2.媒体库--检索结果页添加”HouseNo、資源所屬部門“两个字段信息。</li>
              <li>3.修正媒体库--条目信息--“新闻资料室“左则为空。</li>
              <li>4.修正媒体库--条目信息--節目名稱（英文）節目名稱（中文）内容显示是相反的。</li>
              <li>5.给panel组件加上resize的监听事件，以适应浏览器大小发生改变时自适应</li>
              <li>6.检索历史列表，排序方式改为按时间倒序显示。</li>
              <li>7.修正download接口inpoint outpoint不是整数时下载出错的问题。</li>
              <li>8.添加初始化脚本--凤云快传下载。</li>
              <li>9.用户信息发生变化时要求用户重新登录。</li>
              <li>10.修正引擎状态不正确的问题。</li>
              <li>11.添加下载方式--凤云快传下载。</li>
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
