<template>
  <fj-slide-dialog
    title="实例信息详情"
    :visible.sync="dialogVisible"
    @close="close">
    <fj-form :model="formData" label-width="80px">
      <fj-form-item v-for="item in FIELD_CONFIG" :key="item.name" :label="item.label">
        <fj-input v-if="item.type === 'input'" v-model="formData[item.name]" :readonly="true"></fj-input>
        <fj-input v-else-if="item.type === 'textarea'" v-model="formData[item.name]" type="textarea" :rows="5" :readonly="true"></fj-input>
        <div v-else-if="item.type === 'iconGroup'" :class="$style.iconGroup">
          <i :class="['iconfont icon-global', $style.iconfont]" @click="updateParms('global')"></i>
          <i :class="['iconfont icon-in', $style.iconfont]" @click="updateParms('in')"></i>
          <i :class="['iconfont icon-out', $style.iconfont]" @click="updateParms('out')"></i>
        </div>
      </fj-form-item>
    </fj-form>
    <parms-dialog :visible.sync="isShowParmsDialog" :info="parms"></parms-dialog>
  </fj-slide-dialog>
</template>
<script>
  import ParmsDialog from './parmsDialog';
  import { formatQuery, formatTime } from '../../../../../common/utils';
  const api = require('../../../../../api/wokflow');
  const FIELD_CONFIG = [
    { label: '序号', name: 'id', type: 'input' },
    { label: '类别', name: 'className', type: 'input' },
    { label: '名称', name: 'name', type: 'input' },
    { label: '定义序号', name: 'workflowId', type: 'input' },
    { label: '状态', name: 'status', type: 'input' },
    { label: '工程序号', name: 'engineId', type: 'input' },
    { label: '工程名称', name: 'engineName', type: 'input' },
    { label: '优先级', name: 'priority', type: 'input' },
    { label: '参数', name: 'parms', type: 'iconGroup' },
    { label: '当前节点', name: 'current', type: 'input' },
    { label: '下一节点', name: 'next', type: 'input' },
    { label: '创建时间', name: 'createdTime', type: 'input' },
    { label: '活跃时间', name: 'activedTime', type: 'input' },
    { label: '完成时间', name: 'completedTime', type: 'input' },
    { label: '错误信息', name: 'message', type: 'textarea' }
  ];
  export default {
    components: {
      ParmsDialog
    },
    props: {
      id: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        formData: {},
        FIELD_CONFIG: FIELD_CONFIG,
        isShowParmsDialog: false,
        parms: {}
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) this.updateDetail();
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      updateDetail() {
        api.workflow_instance_detail(formatQuery({ id: this.id }, true), this).then((res) => {
          const data = res.data;
          data.createdTime = formatTime(data.createdTime);
          data.activedTime = formatTime(data.activedTime);
          data.completedTime = formatTime(data.completedTime);
          this.formData = data;
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      updateParms(type) {
        this.parms = this.formData[type] || {};
        this.isShowParmsDialog = true;
      }
    }
  };
</script>
<style module>
  .iconGroup {
    width: 100%;
    height: 36px;
    line-height: 36px;
  }
  .iconfont {
    color: #9FB3CA;
    font-size: 14px;
  }
  .iconfont:hover {
    color: #4C637B;
  }
  .iconfont:active {
    color: #38B1EB;
  }
  .iconfont+.iconfont {
    margin-left: 20px;
  }
</style>
