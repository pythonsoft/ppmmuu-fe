<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <fj-tab-pane label="基本信息" name="tab1">
        <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
          <fj-form-item label="标志" prop="_id">
            <fj-input v-model="formData._id"></fj-input>
          </fj-form-item>
          <fj-form-item label="副标识" prop="viceId">
            <fj-input v-model="formData.viceId"></fj-input>
          </fj-form-item>
          <fj-form-item label="名称" prop="name">
            <fj-input v-model="formData.name"></fj-input>
          </fj-form-item>
          <fj-form-item label="Web服务器路径" prop="webServerPath">
            <fj-input v-model="formData.webClientPath"></fj-input>
          </fj-form-item>
          <fj-form-item label="Web客户端路径" prop="webClientPath">
            <fj-input v-model="formData.webClientPath"></fj-input>
          </fj-form-item>
          <fj-form-item label="流媒体路径" prop="streamingPath">
            <fj-input v-model="formData.streamingPath"></fj-input>
          </fj-form-item>
          <fj-form-item label="ftp路径" prop="ftpPath">
            <fj-input v-model="formData.ftpPath"></fj-input>
          </fj-form-item>
          <fj-form-item label="windows路径" prop="windowsStoragePath">
            <fj-input v-model="formData.windowsStoragePath"></fj-input>
          </fj-form-item>
          <fj-form-item label="linux路径" prop="linuxStoragePath">
            <fj-input v-model="formData.linuxStoragePath"></fj-input>
          </fj-form-item>
          <fj-form-item label="保留空间" prop="reserveCapability">
            <fj-input v-model="formData.reserveCapability"></fj-input>
          </fj-form-item>
          <fj-form-item label="类型" prop="type">
            <fj-select v-model="formData.type">
              <fj-option
                      v-for="item in TYPE"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="容量" prop="maxSize">
            <fj-input v-model="formData.maxSize"></fj-input>
          </fj-form-item>
          <fj-form-item label="存储区" prop="bucket">
            <div class="group-input"><fj-input v-model="formData.bucket.name" :readonly="true"></fj-input></div>
            <fj-button @click.stop.prevent="bucketDialogVisible=true">修改</fj-button>
          </fj-form-item>
          <fj-form-item label="描述" prop="description">
            <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
          </fj-form-item>
        </fj-form>
      </fj-tab-pane>
      <fj-tab-pane label="水位线" name="tab2">
        <fj-form :model="formData" :rules="rules" ref="editForm1" label-width="90px">
          <fj-form-item label="警告水位线" prop="warningLine">
            <fj-select v-model="formData.warningLine">
              <fj-option
                      v-for="item in LEVELS"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="触发水位线" prop="triggerLine">
            <fj-select v-model="formData.triggerLine">
              <fj-option
                      v-for="item in LEVELS"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="最低水位线" prop="minLine">
            <fj-select v-model="formData.minLine">
              <fj-option
                      v-for="item in LEVELS"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
        </fj-form>
      </fj-tab-pane>
    </fj-tabs>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <search-add-bucket
            @add-bucket="addBucket"
            :visible.sync="bucketDialogVisible">
    </search-add-bucket>
  </fj-slide-dialog>
</template>
<script>
  import searchAddBucket from './searchAddBucket';

  const config = require('../config');
  const api = require('../../../../api/storage');

  export default {
    props: {
      type: String,
      title: String,
      id: String,
      bucket: {
        type: Object,
        default: null
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-add-bucket': searchAddBucket
    },
    data() {
      return {
        isBtnLoading: false,
        formData: {
          bucket: {
            _id: '',
            name: ''
          },
          type: '0',
          name: '',
          status: '0',
          maxSize: -1,
          reserveCapability: -1
        },
        rules: {
          bucket: [
            { required: true, message: '请选择存储区' },
            {
              message: '请选择存储区',
              validator: (rule, value, callback) => {
                if (value && value._id) {
                  return true;
                }
                return false;
              }
            }
          ],
          name: [
            { required: true, message: '请输入名称' }
          ],
          _id: [
            { required: true, message: '请输入标识' }
          ],
          viceId: [
            { required: true, message: '请输入副标识' }
          ]
        },
        TYPE: config.TYPE,
        PERMISSION: config.PERMISSION,
        dialogVisible: false,
        bucketDialogVisible: false,
        activeTabName: 'tab1',
        LEVELS: config.LEVELS
      };
    },
    watch: {
      type(val) {
        if (this.type === 'edit' && this.dialogVisible === true) {
          this.initEditUser();
        } else {
          this.resetFormData();
        }
      },
      visible(val) {
        if (val) {
          this.dialogVisible = true;
          if (this.type === 'edit') {
            this.initEditUser();
          } else {
            this.resetFormData();
          }
        } else {
          this.dialogVisible = false;
        }
      }
    },
    created() {
    },
    methods: {
      initEditUser() {
        this.dialogVisible = true;
        const me = this;
        api.getPathDetail({ params: { _id: this.id } })
          .then((res) => {
            me.formData = res.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      resetFormData() {
        this.formData = {
          bucket: {
            _id: '',
            name: ''
          },
          type: '0',
          name: '',
          status: '0',
          maxSize: '',
          reserveCapability: ''
        };
        if(this.bucket){
          this.formData.bucket = this.bucket;
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
        this.formData.status = '0';
        this.formData.maxSize = parseInt(this.formData.maxSize, 10) || -1;
        this.formData.reserveCapability = parseInt(this.formData.reserveCapability, 10) || -1;
        if (this.bucket && this.bucket._id) {
          this.formData.bucket = {
            _id: this.bucket._id,
            name: this.bucket.name
          };
        }
        api.addPath(this.formData)
          .then((response) => {
            me.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.resetFormData();
          })
          .catch((error) => {
            me.$message.error(error);
          })
          .then(() => {
            me.isBtnLoading = false;
          });
      },
      editUser() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.maxSize = parseInt(this.formData.maxSize, 10) || -1;
        this.formData.reserveCapability = parseInt(this.formData.reserveCapability, 10) || -1;
        api.updatePath(this.formData)
          .then((response) => {
            this.$message.success('保存成功');
            me.$emit('updateList');
            me.close();
            me.resetFormData();
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isBtnLoading = false;
          });
      },
      close() {
        this.dialogVisible = false;
        this.resetFormData();
        this.$emit('update:visible', false);
      },
      addBucket(row) {
        this.formData.bucket = {
          _id: row._id,
          name: row.name
        };
      },
      handleTabClick() {

      }
    }
  };
</script>
<style scope>
  .group-input {
    float: left;
    width: 195px;
    margin-right: 10px;
  }
</style>

