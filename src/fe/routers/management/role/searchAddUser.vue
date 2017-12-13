<template>
  <fj-dialog
          :title="title"
          :visible.sync="addOwnerDialogVisible"
          @close="close">

    <div class="manage-search">
      <fj-input placeholder="输入名字搜索" size="mini" v-model="keyword" icon="icon-search input-search-icon" @on-icon-click="searchOwnerClick" @keydown.native.enter.prevent="searchOwnerClick"></fj-input>
    </div>
    <div v-if="searchOwner.length" class="manage-search-content">
      <fj-table :data="searchOwner" name="table" ref="table" @current-change="searchOwnerHandleCurrentChange" :showThead=false highlight-current-row>
        <fj-table-column prop="_id">
          <template slot-scope="props">
            <div class="search-item-icon"><img class="search-item-icon-img" :src="props.row.photo ? props.row.photo : props.row.logo"></div>
            <span>{{props.row.name}}</span>
          </template>
        </fj-table-column>
      </fj-table>
    </div>
    <div class="manage-search-nodata" v-else>无数据</div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import { formatQuery } from '../../../common/utils';

  const api = require('../../../api/role');

  export default {
    name: 'addUser',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      searchOwner: {
        type: Array,
        default() { return []; }
      },
      title: {
        type: String,
        default: ''
      },
      departmentId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        addOwnerDialogVisible: false,
        keyword: ''
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.searchOwnerClick();
          this.addOwnerDialogVisible = val;
        } else {
          this.addOwnerDialogVisible = val;
        }
      }
    },
    methods: {
      close() {
        this.keyword = '';
        this.$emit('update:visible', false);
      },
      searchOwnerClick() {
        const query = {
          keyword: this.keyword,
          departmentId: this.departmentId
        };
        this.$emit('search-user-api', query);
      },
      searchOwnerHandleCurrentChange(row) {
        this.searchOwnerCurrentRow = row;
      },
      addOwnerConfirm() {
        this.keyword = '';
        this.$emit('add-owner', this.searchOwnerCurrentRow);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>

<style>
  .manage-search {
    margin-top: 14px;
    margin-bottom: 16px;
    height: 30px;
    width: 100%;
    font-size: 12px;
  }

  .manage-search-content {
    max-height: 1080px;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #CED9E5;
    border-radius: 4px;
  }

  .search-item-icon {
    position: relative;
    display: inline-block;
    float: left;
    margin-right: 10px;
    border-radius: 50%;
    overflow: hidden;
    width: 20px;
    height: 20px;
  }

  .search-item-icon-img {
    position: absolute;
    top: 0;
    width: 20px;
    height: 20px;
  }

  .manage-search-nodata {
    text-align: center;
  }
</style>
