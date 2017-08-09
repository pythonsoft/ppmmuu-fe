<template>
  <fj-dialog
          title="存储区"
          :visible.sync="addBucketDialogVisible"
          @close="close">

    <div class="manage-search">
      <fj-input placeholder="输入关键字搜索" size="mini" v-model="keyword" icon="icon-search input-search-icon" @on-icon-click="searchClick" @keydown.native.enter.prevent="searchClick"></fj-input>
    </div>
    <div v-if="tableData.length" class="manage-search-content">
      <fj-table :data="tableData" name="table" ref="table" @current-change="searchOwnerHandleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态" >
          <template scope="props"><div v-html="formatStatus(props.row.status)"></div></template>
        </fj-table-column>
        <fj-table-column prop="_id" width="90" label="标识" ></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="permission" width="90" label="读写权限">
          <template scope="props">{{ formatPermission(props.row.permission) }}</template>
        </fj-table-column>
      </fj-table>
    </div>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const utils = require('../../../../common/utils');
  const api = require('../../../../api/storage');
  const config = require('../config');

  export default {
    name: 'addUser',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        addBucketDialogVisible: false,
        keyword: '',
        tableData: []
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.searchClick();
          this.addBucketDialogVisible = val;
        } else {
          this.addBucketDialogVisible = val;
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      searchClick() {
        const me = this;
        const query = {
          keyword: this.keyword,
          page: 1,
          pageSize: 6
        };

        api.listBucket({ params: query})
                .then((res) => {
          me.tableData = res.data.docs;
        }).catch((error) => {
          me.showErrorInfo(error);
        })
      },
      searchOwnerHandleCurrentChange(row) {
        this.searchOwnerCurrentRow = row;
      },
      addOwnerConfirm() {
        this.$emit('update:visible', false);
        this.$emit('add-bucket', this.searchOwnerCurrentRow);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      formatStatus(v) {
        if (v === config.STATUS.NORMAL.value) {
          return '<span class="bucket-status-span bucket-enable">正常</span>';
        }else{
          return '<span class="bucket-status-span bucket-disable">挂起</span>';
        }
      },
      formatPermission(v) {
        return utils.getTextByValue(config, v, 'PERMISSION');
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
</style>