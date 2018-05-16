<template>
  <fj-slide-dialog
    title="定义信息详情"
    :visible.sync="dialogVisible"
    @close="close">
    <fj-form :model="formData" label-width="110px">
      <fj-form-item label="序号">
        <fj-input v-model="formData.id" :readonly="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称">
        <fj-input v-model="formData.name" :readonly="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="版本">
        <fj-input v-model="formData.version" :readonly="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="创建时间">
        <fj-input v-model="formData.createdTime" :readonly="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="定义">
        <fj-input v-model="formData.definition" type="textarea" :rows="5" :readonly="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="描述">
        <fj-input v-model="formData.description" type="textarea" :rows="5" :readonly="true"></fj-input>
      </fj-form-item>
    </fj-form>
  </fj-slide-dialog>
</template>
<script>
  import { formatQuery, formatTime } from '../../../../../common/utils';
  const api = require('../../../../../api/wokflow');

  export default {
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
        formData: {
          id: '',
          name: '',
          version: '',
          createdTime: '',
          definition: '',
          description: ''
        },
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) this.updateDetail();
      }
    },
    methods: {
      updateDetail() {
        api.workflow_definition_detail(formatQuery({ id: this.id }, true), this).then((res) => {
          const data = res.data;
          data.createdTime = formatTime(data.createdTime);
          this.formData = data;
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      close() {
        this.$emit('update:visible', false);
      }
    }
  };
</script>
