<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <fj-tab-pane label="基本信息" name="tab1">
        <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
          <fj-form-item label="标志" v-if="type === 'edit'">
            <fj-input v-model="formData._id" :disabled="true"></fj-input>
          </fj-form-item>
          <fj-form-item label="名称" prop="name">
            <fj-input v-model="formData.name"></fj-input>
          </fj-form-item>
          <fj-form-item label="路径" prop="path">
            <fj-input v-model="formData.path"></fj-input>
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
          <fj-form-item label="存储区" prop="bucket.name">
            <div class="group-input"><fj-input v-model="formData.bucket.name" :readonly="true"></fj-input></div>
            <fj-button @click.stop.prevent="bucketDialogVisible=true">修改</fj-button>
          </fj-form-item>
          <fj-form-item label="描述" prop="description">
            <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
          </fj-form-item>
        </fj-form>
      </fj-tab-pane>
      <fj-tab-pane label="水位线" name="tab2">
        <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
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
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-add-bucket': searchAddBucket,
    },
    data() {
      return {
        isBtnLoading: false,
        formData:  {
          bucket: {
            _id: '',
            name: ''
          },
          type: '',
          name: '',
          status: '0',
          maxSize: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
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
          type: '',
          name: '',
          status: '0',
          maxSize: '',
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
        this.formData.maxSize = parseInt(this.formData.maxSize);
        api.addPath(this.formData)
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
        this.formData.maxSize = parseInt(this.formData.maxSize);
        api.updatePath(this.formData)
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
      },
      addBucket(row) {
        this.formData.bucket = {
          _id: row._id,
          name: row.name
        }
      }
    }
  };
</script>
<style>
  .group-input {
    float: left;
    width: 215px;
    margin-right: 10px;
  }
</style>

