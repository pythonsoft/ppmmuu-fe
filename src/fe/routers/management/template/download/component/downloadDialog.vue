<template>
  <fj-dialog
    title="下载地址选择列表"
    :visible.sync="dialogVisible"
    @close="close">
    <div :class="$style.content">

      <!-- <fj-table v-if="!permissionViewVisible" style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" width="160" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table> -->
      <ul v-if="!permissionViewVisible" :class="$style.list">
        <li v-for="item in tableData" :key="item._id" @click="handleCurrentChange(item)" :class="[currentId === item._id ? $style.active : '']">
          <h4 :class="$style.itemName">{{ item.name }}</h4>
          <p :class="$style.itemDesc">{{ item.description }}</p>
        </li>
      </ul>

      <div v-else>
        <div :class="$style.tips" v-if="permissions.length === 0">{{ tips }}</div>
        <!-- <fj-table v-else style="font-size: 12px;" :data="permissions" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
          <fj-table-column prop="acceptor" width="60" label="类型">
            <template slot-scope="props">
              {{ getTargetType(props.row.acceptor.targetType) }}
            </template>
          </fj-table-column>
          <fj-table-column prop="acceptor" label="名称">
            <template slot-scope="props">
              <span>{{ props.row.acceptor.name }}</span>
            </template>
          </fj-table-column>
        </fj-table> -->
        <ul v-else :class="$style.list">
          <li v-for="item in permissions" :key="item._id" @click="handleCurrentChange(item)" :class="[currentId === item._id ? $style.active : '']">
            <h4 :class="$style.itemName">{{ item.acceptor.name }}</h4>
            <p :class="$style.itemDesc">{{ getTargetType(item.acceptor.targetType) }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" @click="dialogConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const api = require('../../../../../api/template');
  const userAPI = require('../../../../../api/user');
  const config = require('../../../task/config');

  export default {
    name: 'mediaCenterDownloadDialogView',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) {
          this.listTemplate();
        } else {
          this.tableData = [];
        }
      }
    },
    data() {
      return {
        tableData: [],
        currentRow: {},
        currentId: '',
        dialogVisible: this.visible,
        permissionViewVisible: false,
        permissions: [],
        tips: '正在加载数据...',
        type: '',
        ext: '_info',
      };
    },
    methods: {
      close() {
        this.permission = [];
        this.permissionViewVisible = false;
        this.type = '';
        this.$emit('update:visible', false);
      },
      handleCurrentChange(current) {
        this.currentId = current._id;
        if(typeof current.type !== 'undefined') {
          this.type = current.type;
        }

        this.currentRow[this.type] = current;

        if(this.type === config.getConfig('NODE_TEMPLATE', 'DOWNLOAD_MEDIAEXPRESS').value) {
          this.permissionViewVisible = true;
          this.getPermission();
          this.type = this.type + this.ext;
          this.currentRow[this.type] = current;
        }

      },
      dialogConfirm() {
        this.$emit('confirm', this.currentRow, this.type.replace(this.ext, ''));
        this.close();
      },
      getTargetType(v) {
        return config.getTextByValue(v + '', 'TARGET_TYPE');
      },
      listTemplate() {
        const me = this;

        const param = {
          page: 1,
          pageSize: 100,
        };

        userAPI.listUsableTemplate({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
        }).catch((error) => {
          me.$message.error(error);
          this.$emit('update:visible', false);
        });
      },
      getPermission() {
        const me = this;

        this.tips = '正在加载数据...';
        userAPI.directAuthorizeAcceptorList({ params: {} }, me).then((res) => {
          me.permissions = res.data;
          if(me.permissions.length === 0) {
            me.tips = '您的授权列表没有相关信息';
          }
        }).catch((error) => {
          me.tips = error;
        });
      }
    }
  };
</script>
<style module>
  .content {
    max-height: 300px;
    margin: 0 -20px;
    overflow-y: auto;
  }
  .list li {
    position: relative;
    /*padding-top: 16px;*/
    /*padding-bottom: 10px;*/
    padding: 16px 20px 10px;
    cursor: pointer;
  }
  .tips {
    padding: 0 20px;
  }
  .list li:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    border-bottom: 1px solid #EBF3FB;
  }
  .itemName {
    font-size: 12px;
    font-weight: bold;
    color: #2A3E52;
  }
  .itemDesc {
    margin-top: 6px;
    font-size: 12px;
    color: #4C637B;
  }
  .list li.active,
  .list li:hover {
    background: #EBF3FB;
  }
  .list li.active {
    background-color: rgba(56, 177, 235, .25);
  }
</style>
