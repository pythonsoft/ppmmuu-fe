<template>
  <fj-dialog
    title="快传白名单选择列表"
    :visible.sync="dialogVisible"
    @close="close">
    <div class="bucket-browser-content">
      <div v-if="permissions.length === 0">{{ tips }}</div>
      <fj-table v-else style="font-size: 12px;" :data="permissions" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="sender" width="60" label="发送方类型">
          <template scope="props">
            {{ getTargetType(props.row.sender.targetType) }}
          </template>
        </fj-table-column>
        <fj-table-column prop="sender" label="发送方名称">
          <template scope="props">
            <span>{{ props.row.sender.name }}</span>
          </template>
        </fj-table-column>
        <fj-table-column prop="acceptor" width="60" label="接收方类型">
          <template scope="props">
            {{ getTargetType(props.row.acceptor.targetType) }}
          </template>
        </fj-table-column>
        <fj-table-column prop="acceptor" label="接收方名称">
          <template scope="props">
            <span>{{ props.row.acceptor.name }}</span>
          </template>
        </fj-table-column>
      </fj-table>
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
    name: 'mediaExpressWhitelistDialog',
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
          this.getPermission();
        } else {
          this.permissions = [];
        }
      }
    },
    data() {
      return {
        currentRow: {},
        dialogVisible: this.visible,
        permissionViewVisible: false,
        permissions: [],
        tips: '正在加载数据...',
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
        this.currentRow = current;
      },
      dialogConfirm() {
        this.$emit('confirm', this.currentRow);
        this.close();
      },
      getTargetType(v) {
        return config.getTextByValue(v + '', 'TARGET_TYPE');
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
