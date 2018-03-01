<template>
  <four-row-layout-right-content :isIncludeArrow="true" @back="handleClickBack">
    <template slot="search-left">编辑中</template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" @click="handleClickSave">保存</fj-button>
        <fj-button type="primary" size="mini" @click="handleClickSubmit">提交</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" @click="handleClickCancel">取消</fj-button>
      </div>
    </template>
    <template slot="table">
      <div class="shelf-edit-list">
        <ul style="padding: 16px 0 0 20px;">
          <li @click="handleClickShelfItem(item)" v-for="(item, index) in shelfInfo">
            <div :class="['shelf-edit-item', {'active': item === activeShelfInfo}]">
              <div class="shelf-edit-item-img">
                <img style="width: 52px; height: 29px;" :src="getIcon(item)">
              </div>
              <div class="shelf-edit-item-content">
                <span class>{{getTitle(item.name)}}</span>
                <span>{{getDuration(item)}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="shelf-edit-slider-bar"></div>
      <div class="shelf-edit" ref="shelfEdit">
        <panel-view
                :limitResize="true"
                :limitResizeScale="230"
                :parentSize="size"
                panels="#/2,#-p0"
                direction="x"
                name="child1"
        >
          <template slot="0" slot-scope="props">
            <div class="shelf-edit-left">
              <edit-left :shelfInfo="activeShelfInfo" :vueInstance="vueInstance"></edit-left>
            </div>
          </template>
          <template slot="1" slot-scope="props">
            <div class="shelf-edit-right">
              <edit-right :editorInfo="activeShelfInfo.editorInfo" ref="editRight" :vueInstance="vueInstance"></edit-right>
            </div>
          </template>
        </panel-view>
      </div>
    </template>
  </four-row-layout-right-content>
</template>
<script>
  import Vue from 'vue';
  import { formatQuery, formatTime, valueLengthLimit, formatDuration} from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import EditLeft from './editLeft';
  import EditRight from './editRight';
  import PanelView from '../../../component/layout/panel/index';

  const api = require('../../../api/shelves');
  const uploadApi = require('../../../api/upload');
  const mediaApi = require('../../../api/media');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'edit-left': EditLeft,
      'edit-right': EditRight,
      'panel-view': PanelView
    },
    props: {
      shelfInfo: { type: Array, default: []}
    },
    data() {
      return {
        defaultRoute: '/',
        size: { width: document.body.clientWidth - 556, height: document.body.clientHeight },
        vueInstance: null,
        cover: '',
        activeShelfInfo: {},
        isFirstSave: true,
      };
    },
    created() {
      this.resize();
      this.vueInstance = new Vue();
      this.vueInstance.$on('lastCover', (cover)=>{
        this.cover = cover;
      });
      this.isFirstSave = true;
      if( this.shelfInfo && this.shelfInfo.length){
        this.activeShelfInfo = this.shelfInfo[0];
      }
    },
    mounted() {
      window.addEventListener('resize', this.resize);
    },
    methods: {
      resize(e) {
        this.size = { width: document.body.clientWidth - 556, height: document.body.clientHeight };
      },
      getPostData(isSave) {
        const me =this;
        let postData = {};
        let func = '';
        if(this.isFirstSave){
          const _ids = [];
          me.shelfInfo.forEach((item)=>{
            _ids.push(item._id);
          })
          postData = {
            _ids: _ids.join(','),
            editorInfo: me.activeShelfInfo.editorInfo,
            firstId: this.activeShelfInfo._id
          };
          const cloneEditorInfo = JSON.parse(JSON.stringify(this.activeShelfInfo.editorInfo));
          delete cloneEditorInfo.name;
          for(let i = 0, len = this.shelfInfo.length; i < len; i++){
            if(this.shelfInfo[i] !== this.activeShelfInfo) {
              const name = this.shelfInfo[i].editorInfo.name;
              this.shelfInfo[i].editorInfo = JSON.parse(JSON.stringify(cloneEditorInfo));
              this.shelfInfo[i].editorInfo.name = name;
            }
          }
          func = isSave ? api.batchSaveShelf : api.batchSubmitShelf;
        }else {
          postData = {
            _id: me.activeShelfInfo._id,
            editorInfo: me.activeShelfInfo.editorInfo
          };
          func = isSave ? api.saveShelf : api.submitShelf;
        }
        return { postData, func};
      },
      handleClickSave() {
        const { postData, func } = this.getPostData(true);
        const me = this;
        func(postData)
            .then((res) => {
              me.activeShelfInfo.name = me.activeShelfInfo.editorInfo.name;
              me.isFirstSave = false;
              me.showSuccessInfo('已保存');
            })
            .catch((error) => {
              me.showErrorInfo(error);
            });
      },
      handleClickSubmit() {
        const { postData, func } = this.getPostData(false);
        const me = this;
        this.$refs.editRight.$refs.editorInfoForm.validate((valid) => {
          if (valid) {
            func(postData)
              .then((res)=>{
                me.isFirstSave = false;
                me.showSuccessInfo('提交成功');
                me.$emit('update-list');
                me.$emit('show-back');
              })
              .catch((error)=>{
                me.showErrorInfo(error);
              });
          }
        });
      },
      handleClickShelfItem(item) {
        this.activeShelfInfo = item;
      },
      getTitle(title) {
        return valueLengthLimit(title, 24);
      },
      getIcon(item) {
        return mediaApi.getIcon(item.objectId, item.fromWhere);
      },
      getDuration(item) {
        const duration = (item.outpoint - item.inpoint) * 1000 / 25;
        return formatDuration(duration);
      },
      handleClickBack(){
        this.$emit('update-list');
        this.$emit('show-back');
      },
      handleClickCancel(){
        this.$emit('update-list');
        this.$emit('show-back');
        if(this.cover){
          uploadApi.remove({path: this.cover})
              .then(() => {

              }).catch(() => {

          })
        }
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style scope>
  .main .right-content {
    overflow: hidden;
  }

  .permission-btn-mini-margin {
    margin-left: 6px;
    font-size: 12px;
  }

  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }

  .shelf-edit-list {
    width: 360px;
    height: 100%;
    padding: 16px 0 0 20px;
    overflow-y: scroll;
    position: absolute;
    left: 0;
    top: 90px;
  }

  .shelf-edit {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 350px;
    top: 106px;
  }

  .shelf-edit-slider-bar {
    overflow: auto;
    background: none;
    z-index: 10;
    position: absolute;
    cursor: default;
    top: 90px;
    left: 351px;
    height: 100%;
    width: 4px;
    border-left: 4px solid #F2F6FA;
  }

  .shelf-edit-left {
    padding: 16px 40px 0 40px;
    height: 100%;
    overflow: hidden;
  }

  .shelf-edit-right {
    padding: 16px 10% 0 10%;
    height: 100%;
    overflow: hidden;
  }

  .shelf-edit-item {
    position: relative;
    font-size: 12px;
    height: 39px;
    width: 100%;
    margin-bottom: 5px;
    color: #4C637B;
  }

  .shelf-edit-item:hover {
    background-color: #EBF3FB;
    color: #2A3E52;
  }
  .shelf-edit-item.active {
    background-color: #EBF3FB;
    color: #2A3E52;
  }

  shelf-edit-item-active {
    background-color: #EBF3FB;
    color: #2A3E52;
  }

  .shelf-edit-item-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 52px;
    height: 29px;
    margin-top: 5px;
  }

  .shelf-edit-item-content {
    position: absolute;
    left: 52px;
    top: 0;
    padding-top: 5px;
    height: 100%;
  }

  .shelf-edit-item-content:hover {
    color: #38B1EB;
  }

  .shelf-edit-item-content span {
    display: inline-block;
    margin-left: 12px;
  }

  /*@media screen and (max-width:1425px){*/
    /*.shelf-edit-left {*/
      /*padding: 16px 40px 0 20px;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*min-width: 600px;*/
      /*overflow: hidden;*/
      /*border-right: 4px solid #EBF3FB;*/
    /*}*/

    /*.shelf-edit-right {*/
      /*padding: 50px 40px 0 20px;*/
      /*width: 100%;*/
      /*height: 100%;*/
      /*min-width: 600px;*/
      /*overflow: hidden;*/
    /*}*/
  /*}*/
</style>
