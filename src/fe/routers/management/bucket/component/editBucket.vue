<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
      <fj-form-item label="标志" v-if="type === 'edit'">
        <fj-input v-model="id" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="存储类型" prop="type">
        <fj-select v-model="formData.type">
          <fj-option
            v-for="(value, key) in TYPE"
            :key="key"
            :value="value"
            :label="key"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="读写权限" prop="permission">
        <fj-select v-model="formData.permission">
          <fj-option
                  v-for="(value, key) in PERMISSION"
                  :key="key"
                  :value="value"
                  :label="key"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="删除保护">
        <fj-radio-group v-model="formData.deleteDeny" custom-class="radio-group">
          <fj-radio label="1">开启</fj-radio>
          <fj-radio label="0">关闭</fj-radio>
        </fj-radio-group>
      </fj-form-item>
      <fj-form-item label="描述" prop="description">
        <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="dialogVisible=false">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>

  </fj-slide-dialog>
</template>
<script>
  import { TYPE, PERMISSION } from '../config';

  const api = require('../../../../api/storage');

  export default {
    props: {
      type: String,
      title: String,
      id: String
    },
    data() {
      return {
        isBtnLoading: false,
        formData: {
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        },
        dialogVisible: false
      };
    },
    watch: {
      id(val) {
        if (this.type === 'edit') {
          this.initEditUser();
        }
      },
      type(val) {
        if (this.type === 'add') {

        } else {
          this.initEditUser();
        }
      }
    },
    created() {
    },
    methods: {
      initEditUser() {
        this.dialogVisible = true;
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
        const keys = Object.keys(this.formData);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          this.formData[key] = '';
        }
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
        api.addBucket(this.formData)
          .then((response) => {
            me.$message.success('保存成功');
            me.$emit('updateList');
            me.isBtnLoading = false;
            me.resetFormData();
            me.dialogVisible = false;
          })
          .catch((error) => {
            me.isBtnLoading = false;
            me.$message.error(error);
          });
      },
      editUser() {
        const data = Object.assign(
          {},
          this.formData,
          { companyId: this.companyId },
          { _id: this.id }
        );
        this.isBtnLoading = true;
        groupAPI.postGroupUpdateUser(data)
          .then((response) => {
            this.$message.success('保存成功');
            this.$emit('updateList');
            this.isBtnLoading = false;
            this.resetFormData();
            this.handleClose();
          })
          .catch((error) => {
            this.isBtnLoading = false;
            this.$message.error(error);
          });
      },
      addOwner(row, parentNode) {
        if (parentNode) {
          this.groupName = `${parentNode.name} / ${row.name}`;
          this.formData.teamId = row.info._id;
          this.formData.departmentId = parentNode.info._id;
        } else {
          this.groupName = row.name;
          this.formData.teamId = row.info._id;
          this.formData.departmentId = '';
        }
        this.addGroupDialogVisible = false;
      }
    },
    components: {
      AddGroup
    }
  };
</script>
<style>
  .edit-user-dialog-footer {
    text-align: right;
  }
  .edit-user-dialog-footer button {
    margin-left: 10px;
  }
  .group-input {
    float: left;
    width: 215px;
    margin-right: 10px;
  }
</style>
