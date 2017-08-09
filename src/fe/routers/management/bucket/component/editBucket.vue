<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
      <fj-form-item label="标志">
        <fj-input v-model="formData._id" :disabled="type==='edit'? true: false"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="存储类型" prop="type">
        <fj-select v-model="formData.type">
          <fj-option
            v-for="item in TYPE"
            :key="item.key"
            :value="item.value"
            :label="item.text"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="读写权限" prop="permission">
        <fj-select v-model="formData.permission">
          <fj-option
                  v-for="item in PERMISSION"
                  :key="item.key"
                  :value="item.value"
                  :label="item.text"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="删除保护">
        <fj-radio-group v-model="formData.deleteDeny" custom-class="edit-bucket-radio-group">
          <fj-radio label="1">开启</fj-radio>
          <fj-radio label="0">关闭</fj-radio>
        </fj-radio-group>
      </fj-form-item>
      <fj-form-item label="描述" prop="description">
        <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  const config = require('../config');
  const api = require('../../../../api/storage');

  export default {
    props: {
      type: String,
      title: String,
      id: String,
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isBtnLoading: false,
        formData: {
          deleteDeny: '1',
          type: '',
          permission: '',
          name: '',
          status: '0'
        },
        rules: {
          _id: [
            { required: true, message: '请输入标识' }
          ],
          name: [
            { required: true, message: '请输入名称' }
          ]
        },
        TYPE: config.TYPE,
        PERMISSION: config.PERMISSION,
        dialogVisible: false
      };
    },
    watch: {
      type(val) {
        if (this.type === 'edit' && this.dialogVisible === true) {
          this.initEditUser();
        }else{
          this.resetFormData();
        }
      },
      visible(val) {
        if(val){
          this.dialogVisible = true;
          if(this.type === 'edit'){
            this.initEditUser();
          }
        }else{
          this.dialogVisible = false;
        }
      }
    },
    created() {
    },
    methods: {
      initEditUser() {
        const me = this;
        api.getBucketDetail({ params: { _id: this.id } })
          .then((res) => {
            me.formData = res.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      resetFormData() {
        this.formData = {
          deleteDeny: '1',
          type: '',
          permission: '',
          name: '',
          status: '0'
        };
      },
      submitForm() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (this.type === 'add') {
              this.addUser();
            } else {
              this.editUser();
            }
          }
        });
      },
      addUser() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.status = '0';
        api.addBucket(this.formData)
          .then((response) => {
            me.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.isBtnLoading = false;
            me.resetFormData();
          })
          .catch((error) => {
            me.isBtnLoading = false;
            me.$message.error(error);
          });
      },
      editUser() {
        this.isBtnLoading = true;
        const me = this;
        api.updateBucket(this.formData)
          .then((response) => {
            this.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.isBtnLoading = false;
            me.resetFormData();
          })
          .catch((error) => {
            this.isBtnLoading = false;
            this.$message.error(error);
          });
      },
      close() {
        this.dialogVisible = false;
        this.resetFormData();
        this.$emit('update:visible', false);
      }
    }
  };
</script>
<style>
  .edit-bucket-radio-group {
    line-height: 36px;
  }
  .edit-bucket-radio-group label {
    margin-right: 34px;
  }
</style>

