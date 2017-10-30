<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    @close="close"
  >

  <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
    <fj-form-item label="标志">
      <fj-input v-model="formData.id" :disabled="type==='update'"></fj-input>
    </fj-form-item>
    <fj-form-item label="资源所属" prop="ownerName">
      <fj-input v-model="formData.ownerName"></fj-input>
    </fj-form-item>
    <fj-form-item label="权限" prop="permissionType">
        <fj-radio-group v-model="formData.permissionType">
          <div class="audit-radio-item">
            <fj-radio
              :label="getConfig().AUDIT_RULE_PERMISSTION_TYPE.PUBLIC.value"
            >公开</fj-radio>
          </div>
          <div class="audit-radio-item">
            <fj-radio
              :label="getConfig().AUDIT_RULE_PERMISSTION_TYPE.AUDIT.value"
            >须审核</fj-radio>
          </div>
        </fj-radio-group>
    </fj-form-item>
    <fj-form-item label="审核部门">
      <div class="audit-group-input">
        <fj-input v-model="formData.auditDepartment.name" :readonly="true"></fj-input>
      </div>
      <fj-button @click.stop.prevent="updateDepartmentClick">修改</fj-button>
    </fj-form-item>
    <fj-form-item label="直接授权">
      <div :style="{ lineHeight: '36px' }">
        <fj-button type="info" size="mini" @click.stop.prevent="addDepartmentClick">添加部门</fj-button>
        <fj-button type="danger" size="mini" @click.stop.prevent="deleteDepartmentClick" :disabled="selectedTableSelectedRows.length<1">删除</fj-button>
      </div>
      <div style="borderTop: '1px solid #EBF3FB'; marginTop: '20px'">
        <fj-table :data="formData.whitelist" @selection-change="selectedTableSelectionChange">
          <fj-table-column type="selection" width="20"></fj-table-column>
          <fj-table-column prop="name" label="名称"></fj-table-column>
        </fj-table>
      </div>
    </fj-form-item>
    <fj-form-item label="描述">
      <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
    </fj-form-item>
  </fj-form>
  <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" :title="addGroupDialogTitle"></add-group>
  <div class="audit-dialog-footer">
    <fj-button @click="close">取消</fj-button>
    <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
  </div>
  </fj-slide-dialog>
</template>
<script>
  import '../index.css';
  import AddGroup from '../../../role/searchAddGroup';

  const config = require('../../config');
  const api = require('../../../../../api/audit');

  export default {
    name: 'auditRuleDialog',
    components: {
      'add-group': AddGroup
    },
    props: {
      auditRuleInfo: Object,
      type: String,
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.dialogVisible = true;
          if (this.type !== 'add') {
            this.formData = JSON.parse(JSON.stringify(this.auditRuleInfo));
            this.formData.id = this.formData._id
            this.title = '变更审核授权信息';
          } else {
            this.title = '添加审核授权信息';
          }
        } else {
          this.dialogVisible = false;
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        title: '',
        departmentVisible: false,
        formData: {
          id: '',
          ownerName: '',
          permissionType: '',
          auditDepartment: { _id: '', name: '' },
          whitelist: [], // [{ _id: '', name: '', type: '部门，小组，可以使用帐户系统中的分类型', exts: '允许下载的文件类型，以后缀做区分，全部：all，除此外使用逗号分割，如: .mxf,.mp4', }]
          description: '',
        },
        isBtnLoading: false,
        rules: {
          ownerName: [
            { required: true, message: '请输入名称' }
          ],
        },
        addGroupDialogVisible: false,
        addGroupDialogTitle: '添加组织',
        updateDepartmentOrAddWhiteList: '',
        selectedTableSelectedRows: [],
      };
    },
    created() {
    },
    methods: {
      getConfig() {
        return config.config
      },
      initParam() {
        this.formData = {
          id: '',
          name: '',
          bucketId: '',
          script: ''
        };
      },
      close() {
        this.dialogVisible = false;
        this.currentView = '';
        this.$emit('update:visible', false);
      },
      submitForm() {
        const me = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (!me.auditRuleInfo) {
              this.add();
            } else {
              this.update();
            }
          }
        });
      },
      add() {
        const me = this;
        const data = Object.assign({}, this.formData);
        data.type = data.type ? (data.type.length !== 0 ? data.type[0] : '') : '';
        data.transcodeTemplates = JSON.stringify(data.transcodeTemplates);

        api.createAuditRule(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      update() {
        const me = this;
        const data = Object.assign({}, this.formData);
        data.transcodeTemplates = JSON.stringify(data.transcodeTemplates);

        if(data.type && data.type.length > 0) {
          data.type = data.type[0];
        }else {
          delete data.type;
        }

        api.updateAuditRule(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      updateDepartmentClick(){
        this.updateDepartmentOrAddWhiteList = 'updateDepartment';
        this.addGroupDialogVisible = true;
        this.addGroupDialogTitle = '修改审核部门';
      },
      addOwner(row) {
        const type = row.type || '3';
        const postData = {
          type: type,
          _id: row._id,
          name: row.name,
        };
        if(this.updateDepartmentOrAddWhiteList === 'updateDepartment') {
          this.formData.auditDepartment = postData;
        }else{
          const data = this.formData.whitelist;
          let flag = true;
          for(let i = 0, len1 = data.length; i < len1; i++){
            if(data[i]._id === postData._id){
              flag = false;
            }
          }
          if(flag){
            data.push(postData);
          }
        }
        this.addGroupDialogVisible = false;
      },
      addDepartmentClick() {
        this.addGroupDialogVisible = true;
        this.updateDepartmentOrAddWhiteList = 'addWhitelist';
        this.addGroupDialogVisible = true;
        this.addGroupDialogTitle = '添加部门';
      },
      deleteDepartmentClick() {
        const me = this;
        const users = this.formData.whitelist;
        const updateUsers = [];
        for(let j = 0, len1 = this.selectedTableSelectedRows.length; j < len1; j++) {
          let flag = false;
          for (let i = 0; i < users.length; i++) {
            if(users[i]._id === this.selectedTableSelectedRows[j]._id){
              users.splice(i, 1);
            }
          }
        }
      },
      selectedTableSelectionChange(rows) {
        this.selectedTableSelectedRows = rows;
      },
    }
  };
</script>
