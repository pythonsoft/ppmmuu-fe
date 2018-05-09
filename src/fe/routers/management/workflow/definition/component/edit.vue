<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
      <fj-form-item label="序号">
        <fj-input v-model="formData.id" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="定义" prop="definition">
        <fj-input v-model="formData.definition"></fj-input>
      </fj-form-item>
      <fj-form-item label="描述" prop="description">
        <fj-input v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm" v-if="status !== STATUS.EXPIRED">保存</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import { formatQuery, isEmptyObject } from '../../../../../common/utils';
  const api = require('../../../../../api/wokflow');

  export default {
    props: {
      info: {
        type: Object,
        default: {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        isBtnLoading: false,
        formData: {
          id: '',
          name: '',
          definition: '',
          description: ''
        }
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
      }
    },
    created() {
      const info = this.info;

      if(!isEmptyObject(info)) {
        this.formData = {
          id: info.id,
          name: info.name,
          definition: info.definition,
          description: info.description
        }
      }


    },
    methods: {

    }
  };
</script>
<style module>

</style>

