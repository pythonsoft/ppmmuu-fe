<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    @close="close"
  >

    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
      <fj-form-item label="标识">
        <fj-input v-model="formData._id" disabled="disabled"></fj-input>
      </fj-form-item>
      <fj-form-item label="来源" prop="source">
        <fj-input v-model="formData.source"></fj-input>
      </fj-form-item>
      <fj-form-item label="高清后缀名">
        <fj-input v-model="formData.hdExt"></fj-input>
      </fj-form-item>
      <fj-form-item label="所属部门">
        <div class="library-bucket-input">
          <fj-input v-model="formData.department.name" :readonly="true"></fj-input>
        </div>
        <fj-button @click.stop.prevent="updateDepartmentClick">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="存储" prop="bucketId">
        <div class="library-bucket-input">
          <fj-input v-model="formData.bucketId" :readonly="true"></fj-input>
        </div>
        <fj-button @click.stop.prevent="bucketBrowserVisible=true">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="转码模版">
        <transcode-template-list
          :data="formData.transcodeTemplateDetail.templatesId"
          @add-template="addTemplate"
          @delete-template="deleteTemplate"
        ></transcode-template-list>
      </fj-form-item>
      <fj-form-item label="转码脚本">
        <fj-input type="textarea" :rows="7" v-model="formData.transcodeTemplateDetail.script"></fj-input>
        <p class="template-download-link" @click="transcodeScriptDialogVisible=true">* 查看脚本说明</p>
      </fj-form-item>
    </fj-form>
    <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" :title="addGroupDialogTitle"></add-group>
    <transcode-script-dialog-view
      :visible.sync="transcodeScriptDialogVisible"
    ></transcode-script-dialog-view>
    <div class="library-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <bucket-browser-view
            :visible.sync="bucketBrowserVisible"
            @confirm="bucketConfirm"
    ></bucket-browser-view>
  </fj-slide-dialog>
</template>
<script>
  import '../index.css';
  import AddGroup from '../../../role/searchAddGroup';
  import bucketBrowserView from '../../../bucket/component/browser';
  import transcodeTemplateList from '../../../template/download/component/transcodeTemplateList';
  import transcodeScriptDialogView from '../../../template/download/component/transcodeScriptDialog';

  const api = require('../../../../../api/library');

  export default {
    name: 'libraryDialog',
    components: {
      'add-group': AddGroup,
      'transcode-template-list': transcodeTemplateList,
      'transcode-script-dialog-view': transcodeScriptDialogView,
      'bucket-browser-view': bucketBrowserView
    },
    props: {
      libraryInfo: Object,
      type: String,
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible(val) {
        if (val) {
          this.dialogVisible = true;
          if (this.type !== 'add') {
            this.title = '变更入库模板信息';
          } else {
            this.title = '添加入库模板信息';
          }
        } else {
          this.dialogVisible = false;

        }
      },
      libraryInfo(v) {
        if(v) {
          this.formData = Object.assign({}, v);
          this.formData.bucketId = this.formData.bucketId || '';
          this.formData.hdExt = this.formData.hdExt.join(',');
        }else {
          this.initParam();
        }
      }
    },
    data() {
      return {
        bucketBrowserVisible: false,
        transcodeScriptDialogVisible: false,
        dialogVisible: false,
        title: '',
        departmentVisible: false,
        formData: {
          _id: '',
          source: '',
          bucketId: '',
          department: { _id: '', name: '' },
          hdExt: '',
          transcodeTemplateDetail: { script: '', templatesId: [] }
        },
        isBtnLoading: false,
        rules: {
          ownerName: [
            { required: true, message: '请输入名称' }
          ],
          bucketId: [
            { required: true, message: '请选择存储区' }
          ],
        },
        addGroupDialogVisible: false,
        addGroupDialogTitle: '添加所属部门',
      };
    },
    created() {
    },
    methods: {
      initParam() {
        this.formData = {
          _id: '',
          source: '',
          bucketId: '',
          department: { _id: '', name: '' },
          hdExt: '',
          transcodeTemplateDetail: { script: '', templatesId: [] }
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
            if (!me.libraryInfo) {
              this.add();
            } else {
              this.update();
            }
          }
        });
      },
      composeData() {
        return {
          _id: this.formData._id,
          source: this.formData.source,
          departmentId: this.formData.department._id,
          hdExt: this.formData.hdExt,
          transcodeScript: this.formData.transcodeTemplateDetail.script,
          transcodeTemplates: JSON.stringify(this.formData.transcodeTemplateDetail.templatesId),
          bucketId: this.formData.bucketId
        }
      },
      add() {
        const me = this;
        const data = this.composeData();

        api.addTemplate(data, me).then((res) => {
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
        const data = this.composeData();

        api.updateTemplate(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      deleteTemplate(rows) {
        rows.forEach(item => {
          const index = this.formData.transcodeTemplateDetail.templatesId.indexOf(item);
          if (index > -1) {
            this.formData.transcodeTemplateDetail.templatesId.splice(index, 1);
          }
        });
      },
      addTemplate(rows) {
        rows.forEach((item) => {
          this.formData.transcodeTemplateDetail.templatesId.push(item);
        });
      },
      updateDepartmentClick(){
        this.addGroupDialogVisible = true;
        this.addGroupDialogTitle = '修改所属部门';
      },
      addOwner(row) {
        this.formData.department._id = row._id;
        this.formData.department.name = row.name;
        this.addGroupDialogVisible = false;
      },
      bucketConfirm(val) {
        this.formData.bucketId = val._id;
      },
    }
  };
</script>
