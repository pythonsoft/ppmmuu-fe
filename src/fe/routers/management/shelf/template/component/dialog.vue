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
      <fj-form-item label="windows路径">
        <fj-input v-model="formData.windowsPath"></fj-input>
      </fj-form-item>
      <fj-form-item label="linux路径">
        <fj-input v-model="formData.linuxPath"></fj-input>
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
      <fj-form-item label="高码流模板">
        <div class="library-bucket-input">
          <fj-input v-model="formData.highTemplate.name" :readonly="true"></fj-input>
        </div>
        <fj-button @click.stop.prevent="updateHighTranscodeTemplate()">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="文件后缀">
        <fj-input v-model="formData.highBitrateStandard.fileFomart" placeholder="高码流文件后缀,如(mxf)"></fj-input>
      </fj-form-item>
      <fj-form-item label="视频编码">
        <fj-input v-model="formData.highBitrateStandard.videoCode" placeholder="如(mpeg2video)"></fj-input>
      </fj-form-item>
      <fj-form-item label="码率">
        <fj-input v-model="formData.highBitrateStandard.bitrate"  placeholder="如(50000000)"></fj-input>
      </fj-form-item>
      <fj-form-item label="低码流模板">
        <div class="library-bucket-input">
          <fj-input v-model="formData.lowTemplate.name" :readonly="true"></fj-input>
        </div>
        <fj-button @click.stop.prevent="updateLowTranscodeTemplate()">修改</fj-button>
      </fj-form-item>
      <fj-form-item label="文件后缀">
        <fj-input v-model="formData.lowBitrateStandard.fileFomart" placeholder="低码流文件后缀,如(mp4)"></fj-input>
      </fj-form-item>
      <fj-form-item label="视频编码">
        <fj-input v-model="formData.lowBitrateStandard.videoCode" placeholder="如(libx264)"></fj-input>
      </fj-form-item>
      <fj-form-item label="码率">
        <fj-input v-model="formData.lowBitrateStandard.bitrate"  placeholder="如(1500000)"></fj-input>
      </fj-form-item>
    </fj-form>
    <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" :title="addGroupDialogTitle"></add-group>
    <div class="library-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <bucket-browser-view
            :visible.sync="bucketBrowserVisible"
            @confirm="bucketConfirm"
    ></bucket-browser-view>
    <transcode-browser-view
            :visible.sync="transcodeBrowserVisible"
            @confirm="transcodeConfirm"
    ></transcode-browser-view>
  </fj-slide-dialog>
</template>
<script>
  import '../index.css';
  import AddGroup from '../../../role/searchAddGroup';
  import bucketBrowserView from '../../../bucket/component/browser';
  import transcodeBrowserView from '../../../template/download/component/transcodeBrowser';

  const api = require('../../../../../api/shelfManage');

  const templateInfo = {
    _id: '',
    source: '',
    bucketId: '',
    department: { _id: '', name: '' },
    highTemplate: { _id: '', name: '' },
    lowTemplate: { _id: '', name: '' },
    windowsPath: '',
    linuxPath: '',
    highBitrateStandard: { fileFomart: 'mxf', videoCode: 'mpeg2video', bitrate: '50000000' },
    lowBitrateStandard: { fileFomart: 'mp4', videoCode: 'libx264', bitrate: '1500000' }
  };

  export default {
    name: 'libraryDialog',
    components: {
      'add-group': AddGroup,
      'bucket-browser-view': bucketBrowserView,
      'transcode-browser-view': transcodeBrowserView
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
          this.formData = Object.assign({}, templateInfo, v);
          this.formData.bucketId = this.formData.bucketId || '';
        }else {
          this.initParam();
        }
      }
    },
    data() {
      return {
        bucketBrowserVisible: false,
        transcodeBrowserVisible: false,
        dialogVisible: false,
        isUpdateHighTemplate: true,
        title: '',
        departmentVisible: false,
        formData: JSON.parse(JSON.stringify(templateInfo)),
        isBtnLoading: false,
        rules: {
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
        this.formData = JSON.parse(JSON.stringify(templateInfo));
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
        const rs = Object.assign({}, this.formData);
        rs.departmentId = rs.department._id || '';
        return rs;
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
      updateHighTranscodeTemplate(){
        this.transcodeBrowserVisible = true;
        this.isUpdateHighTemplate = true;
      },
      updateLowTranscodeTemplate(){
        this.transcodeBrowserVisible = true;
        this.isUpdateHighTemplate = false;
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
      transcodeConfirm(val) {
        if(this.isUpdateHighTemplate){
          this.formData.highTemplate = {
            _id: val._id,
            name: val.name
          }
        }else{
          this.formData.lowTemplate = {
            _id: val._id,
            name: val.name
          }
        }
      }
    }
  };
</script>
