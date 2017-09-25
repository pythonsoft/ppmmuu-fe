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
            当前版本1.2.0.0（已是最新版本）
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>1.树组件--子结点没对齐问题</li>
              <li>2.媒体库--检索框蓝色按钮会挡住最后的字无法显示完全。</li>
              <li>3.管理--将任务管理中的模板管理移到与之同级，并添加两个子结点，分别为：下载模板以及转码模板。</li>
              <li>4.使用凤云快传下载时可以授权列表。</li>
              <li>5.媒体库 -- 分页修改。</li>
              <li>6.用户默认头像显示不正常。</li>
              <li>7.登录用户名及密码去掉前后空格再提交。</li>
              <li>8.管理--帐户--添加帐户-调整部门。</li>
              <li>9.用户头像显示于原退出位置。</li>
              <li>10.凤云快传下载接口对接。</li>
              <li>11.添加入库服务接口。</li>
              <li>12.切换检索服务，将原来的solr变更为es。</li>
              <li>13.获取快传授信列表。</li>
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
