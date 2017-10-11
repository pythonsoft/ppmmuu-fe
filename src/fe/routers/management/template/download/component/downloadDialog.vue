<template>
  <fj-dialog
    title="下载地址选择列表"
    :visible.sync="dialogVisible"
    @close="close">
    <div class="bucket-browser-content">

      <fj-table v-if="!permissionViewVisible" style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" width="160" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>

      <div v-else>
        <div v-if="permissions.length === 0">{{ tips }}</div>
        <fj-table v-else style="font-size: 12px;" :data="permissions" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
          <fj-table-column prop="acceptor" width="60" label="类型">
            <template scope="props">
              {{ getTargetType(props.row.acceptor.targetType) }}
            </template>
          </fj-table-column>
          <fj-table-column prop="acceptor" label="名称">
            <template scope="props">
              <span>{{ props.row.acceptor.name }}</span>
            </template>
          </fj-table-column>
        </fj-table>
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

        api.list({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
        }).catch((error) => {
          me.$message.error(error);
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
