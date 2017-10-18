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
      <fj-button @click.stop.prevent="departmentVisible=true">修改</fj-button>
    </fj-form-item>
    <fj-form-item label="直接授权">
      <whitelist-view
        :data="formData.whitelist"
        @add-template="addTemplate"
        @delete-template="deleteTemplate"
      ></whitelist-view>
    </fj-form-item>
    <fj-form-item label="描述">
      <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
    </fj-form-item>
  </fj-form>

  <div class="audit-dialog-footer">
    <fj-button @click="close">取消</fj-button>
    <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
  </div>
  </fj-slide-dialog>
</template>
<script>
  import '../index.css';
  import whitelistView from './whitelist';

  const config = require('../../config');
  const api = require('../../../../../api/audit');

  export default {
    name: 'auditRuleDialog',
    components: {
      'whitelist-view': whitelistView
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
        }
      };
    },
    created() {
      if (this.type !== 'add') {
//        this.formData.id = this.auditRuleInfo._id;
//        this.formData.name = this.auditRuleInfo.name;
//        this.formData.bucketId = this.auditRuleInfo.details.bucketId;
//        this.formData.script = this.auditRuleInfo.details.script;
//        this.formData.description = this.auditRuleInfo.description;
//        this.formData.type = this.auditRuleInfo.type !== '2' ? [] : [config.getConfig('NODE_TEMPLATE', 'DOWNLOAD_MEDIAEXPRESS').value];
//        const templateDetail = this.auditRuleInfo.transcodeTemplateDetail;
//        this.formData.transcodeTemplates = templateDetail ? templateDetail.transcodeTemplates : [];
//        this.formData.transcodeTemplateSelector = templateDetail ? templateDetail.transcodeTemplateSelector : '';
      }
    },
    methods: {
      addTemplate(rows) {
        rows.forEach((item) => {
          this.formData.transcodeTemplates.push(item);
        });
      },
      getConfig() {
        return config.config
      },
      deleteTemplate(rows) {
        rows.forEach(item => {
          const index = this.formData.transcodeTemplates.indexOf(item);
          if (index > -1) {
            this.formData.transcodeTemplates.splice(index, 1);
          }
        });
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
    }
  };
</script>
