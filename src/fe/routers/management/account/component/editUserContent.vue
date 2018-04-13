<template>
  <div>
    <fj-form :model="formData" :rules="rules" ref="editUserForm" label-width="90px">
      <fj-form-item label="标志" v-if="type === 'edit'">
        <fj-input v-model="id" :disabled="true"></fj-input>
      </fj-form-item>
      <fj-form-item label="邮箱" prop="email">
        <fj-input v-model="formData.email" :disabled="type==='edit'"></fj-input>
      </fj-form-item>
      <fj-form-item label="姓名" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="英文名">
        <fj-input v-model="formData.displayName"></fj-input>
      </fj-form-item>
      <fj-form-item label="电话">
        <fj-input v-model="formData.phone"></fj-input>
      </fj-form-item>
      <fj-form-item label="验证方式" prop="verifyType">
        <fj-select v-model="formData.verifyType">
          <fj-option
            v-for="(value, key) in VERIFY_TYPE_CONFIG"
            :key="key"
            :value="key"
            :label="value"></fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="密码" prop="password" v-show="formData.verifyType === '0'">
        <fj-input v-model="formData.password"></fj-input>
      </fj-form-item>
      <fj-form-item label="部门／小组">
        <div class="edit-user-group-input"><fj-input v-model="groupName" :readonly="true"></fj-input></div>
        <fj-button @click.stop.prevent="addGroupDialogVisible=true">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="有效日期" prop="expiredTime">
        <fj-date-picker
                type="date"
                placeholder="请选择有效日期"
                v-model="formData.expiredTime"
        ></fj-date-picker>
      </fj-form-item>
      <fj-form-item label="备注">
        <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer" class="edit-user-dialog-footer">
      <fj-button @click="handleClose">取消</fj-button><!--
      --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <add-group
      :visible.sync="addGroupDialogVisible"
      :parent-id="companyId"
      type="1"
      @add-owner="addOwner"
      title="调整部门"></add-group>
  </div>
</template>
<script>
  import AddGroup from '../../role/searchAddGroup';
  import { checkEmail, checkPassword, formatQuery } from '../../../../common/utils';
  import groupAPI from '../../../../api/group';
  import { VERIFY_TYPE_CONFIG } from '../config';

  export default {
    props: {
      type: String,
      companyId: String,
      id: String,
      visible: Boolean
    },
    data() {
      return {
        isBtnLoading: false,
        formData: {
          email: '',
          name: '',
          displayName: '',
          phone: '',
          verifyType: '',
          password: '',
          departmentId: '',
          teamId: '',
          description: '',
          expiredTime: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        },
        rules: {
          email: [
            { required: true, message: '请输入邮箱' },
            {
              message: '请输入正确的邮箱',
              validator: (rule, value, callback) => {
                if (checkEmail(value)) {
                  return true;
                }
                return false;
              }
            }
          ],
          name: [
            { required: true, message: '请输入姓名' }
          ],
          verifyType: [
            { required: true, message: '请选择验证方式' }
          ],
          password: [
            {
              message: '请输入6-20位的密码',
              validator: (rule, value, callback) => {
                if (this.formData.verifyType === '0') {
                  if (checkPassword(value)) return true;
                  return false;
                }
                return true;
              }
            }
          ]
        },
        addGroupDialogVisible: false,
        groupName: ''
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
          const keys = Object.keys(this.formData);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.formData[key] = '';
          }
          this.formData.expiredTime = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          this.groupName = '';
        } else {
          this.initEditUser();
        }
        this.$refs.editUserForm.clearErrors();
      },
      visible(val) {
        if (val && this.type === 'edit') {
          this.initEditUser();
        }
      }
    },
    created() {
      this.VERIFY_TYPE_CONFIG = VERIFY_TYPE_CONFIG;
    },
    methods: {
      initEditUser() {
        groupAPI.getGroupUserDetail(formatQuery({ _id: this.id }, true))
          .then((response) => {
            const keys = Object.keys(this.formData);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              this.formData[key] = response.data[key];
            }
            this.formData.departmentId = response.data.department._id;
            this.formData.teamId = response.data.team._id;
            this.formData.expiredTime = new Date(response.data.expiredTime);
            this.groupName = `${response.data.department.name} / ${response.data.team.name}`;
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
        this.groupName = '';
      },
      handleClose() {
        this.$emit('close');
      },
      submitForm() {
        this.$refs.editUserForm.validate((valid) => {
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
        const data = Object.assign({}, this.formData, { companyId: this.companyId });
        this.isBtnLoading = true;
        groupAPI.postGroupAddUser(data)
          .then((response) => {
            this.$message.success('保存成功');
            this.$emit('updateList');
            this.resetFormData();
            this.handleClose();
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isBtnLoading = false;
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
            this.resetFormData();
            this.handleClose();
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isBtnLoading = false;
          });
      },
      addOwner(row, parentNode) {
        if (parentNode) {
          this.groupName = `${parentNode.name} / ${row.name}`;
          this.formData.teamId = row._id;
          this.formData.departmentId = parentNode._id;
        } else {
          this.groupName = row.name;
          this.formData.teamId = row._id;
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
  .edit-user-group-input {
    float: left;
    width: 198px;
    margin-right: 4px;
  }
</style>
