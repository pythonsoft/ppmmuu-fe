<template>
  <four-row-layout-right-content :isIncludeArrow="true" @back="handleClickCancel">
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
              <edit-left :shelfInfo="shelfInfo"></edit-left>
            </div>
          </template>
          <template slot="1" slot-scope="props">
            <div class="shelf-edit-right">
              <edit-right :editorInfo="shelfInfo.editorInfo" ref="editRight"></edit-right>
            </div>
          </template>
        </panel-view>
      </div>
    </template>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime} from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import EditLeft from './editLeft';
  import EditRight from './editRight';
  import PanelView from '../../../component/layout/panel/index';

  const api = require('../../../api/shelves');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'edit-left': EditLeft,
      'edit-right': EditRight,
      'panel-view': PanelView
    },
    props: {
      shelfInfo: { type: Object, default: {}}
    },
    data() {
      return {
        defaultRoute: '/',
        size: { width: document.body.clientWidth - 206, height: document.body.clientHeight }
      };
    },
    created() {
      this.resize();
    },
    mounted() {
      window.addEventListener('resize', this.resize);
    },
    methods: {
      resize(e) {
        this.size = { width: document.body.clientWidth - 206, height: document.body.clientHeight };
      },
      handleClickSave() {
        const me =this;
        const postData = {
          _id: me.shelfInfo._id,
          editorInfo: me.shelfInfo.editorInfo
        }
        api.saveShelf(postData)
          .then((res)=>{
            me.shelfInfo.name = me.shelfInfo.editorInfo.name;
            me.showSuccessInfo('已保存');
          })
          .catch((error)=>{
            me.showErrorInfo(error);
          });
      },
      handleClickSubmit() {
        const me =this;
        const postData = {
          _id: me.shelfInfo._id,
          editorInfo: me.shelfInfo.editorInfo
        }

        this.$refs.editRight.$refs.editorInfoForm.validate((valid) => {
          if (valid) {
            api.submitShelf(postData)
              .then((res)=>{
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
      handleClickCancel(){
        this.$emit('update-list');
        this.$emit('show-back');
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

  .shelf-edit {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .shelf-edit-left {
    padding: 16px 40px 0 20px;
    height: 100%;
    overflow: hidden;
  }

  .shelf-edit-right {
    padding: 16px 10% 0 10%;
    height: 100%;
    overflow: hidden;
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
