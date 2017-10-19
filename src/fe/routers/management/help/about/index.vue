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
            当前版本1.5.0.0（已是最新版本）
          </div>
          <div class="detail">
            <div class="detail-title">版本更新</div>
            <ul>
              <li>*.下载审核授权模块更新</li>
              <li>*.添加订阅－用户模块。</li>
              <li>*.下载审核授权模块。</li>
              <li>*.下载模板--添加"下载审核"关联。</li>
              <li>*.下载模板添加字幕设定。</li>
              <li>*.下载模板--分组名称可变更</li>
              <li>*.下载模板--添加“引用策略”功能。</li>
              <li>*.下载模板进行分组。</li>
              <li>*.点击媒体库时返回默认打开页。</li>
              <li>*.视频编辑器添加主题切换按钮。</li>
              <li>*.视频编辑器，“我的资源”默认打开一级目录。</li>
              <li>*.视频编辑器，打点后的片断缩略图没有显示。</li>
              <li>*.视频编辑器，任务列表显示不正常。</li>
              <li>*.视频编辑器，打点时，入点位置不对。</li>
              <li>*.上架－我的任务－处理中编辑时填写字段添加节目名称，默认为媒体库中的节目名称，可作修改。</li>
              <li>*.检索结果页及检索首页显示标题更换。</li>
              <li>*.检索结果页的时间优化--应该取新闻事件的时间。</li>
              <li>*.媒体库--大文本字段显示优化，将原有换行格式显示。</li>
              <li>*.任务--添加子结点，根据状态显示任务。“全部”，“已完成”，“错误”。</li>
              <li>*.修正媒体库首页数据没有更新。</li>
              <li>*.linux下路径带有空格时导至转码不正常的问题。</li>
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
