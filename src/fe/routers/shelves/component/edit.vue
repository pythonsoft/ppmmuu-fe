<template>
  <four-row-layout-right-content :isIncludeArrow="true" @back="handleClickCancel">
    <template slot="search-left">编辑中</template>
    <template slot="operation">
      <div class="operation-btn-group">
         <span class="permission-btn-mini-margin">
           <fj-button type="info" size="mini" @click="handleClickSave">保存</fj-button>
         </span>
        <span class="permission-btn-mini-margin">
           <fj-button type="info" size="mini" @click="handleClickSubmit">提交</fj-button>
         </span>
      </div>
      <div class="operation-btn-group">
         <span class="permission-btn-mini-margin">
           <fj-button type="info" size="mini" @click="handleClickCancel">取消</fj-button>
         </span>
      </div>
    </template>
    <template slot="table">
      <div class="shelf-edit clearfix">
        <div class="shelf-edit-left">
          <edit-left :shelfInfo="shelfInfo"></edit-left>
        </div>
        <div class="shelf-edit-right">
          <edit-right :editorInfo="shelfInfo.editorInfo" ref="editRight"></edit-right>
        </div>
      </div>
    </template>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime} from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import EditLeft from './editLeft';
  import EditRight from './editRight';

  const api = require('../../../api/shelves');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'edit-left': EditLeft,
      'edit-right': EditRight
    },
    props: {
      shelfInfo: { type: Object, default: {}}
    },
    data() {
      return {
        defaultRoute: '/',
      };
    },
    created() {
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickSave() {
        const me =this;
        const postData = {
          _id: me.shelfInfo._id,
          editorInfo: me.shelfInfo.editorInfo
        }
        this.$refs.editRight.$refs.editorInfoForm.validate((valid) => {
          if (valid) {
            api.saveShelf(postData)
              .then((res)=>{
                me.showSuccessInfo('保存成功');
              })
              .catch((error)=>{
                me.showErrorInfo(error);
              });
          }
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
<style>
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
    float:left;
    padding: 16px 40px 0 20px;
    width: 50%;
    height: 100%;
    min-width: 600px;
    overflow: hidden;
    border-right: 4px solid #EBF3FB;
  }

  .shelf-edit-right {
    float:left;
    padding: 16px 10% 0 10%;
    width: 50%;
    height: 100%;
    min-width: 600px;
    overflow: hidden;
  }
</style>
