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
          <fj-form-item label="类型" prop="type">
            <fj-select v-model="formData.type">
              <fj-option
                      v-for="item in TYPE"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="目标" prop="source.name">
            <div class="group-input">
              <fj-input v-model="formData.source.name" :readonly="true"></fj-input>
            </div>
            <fj-button type="primary" @click.stop.prevent="bucketDialogVisible=true">存储区</fj-button>
            <fj-button type="primary" @click.stop.prevent="pathDialogVisible=true">路径</fj-button>
          </fj-form-item>
          <fj-form-item label="描述" prop="description">
            <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
          </fj-form-item>
        </fj-form>
      </fj-tab-pane>
      <fj-tab-pane label="计划信息" name="tab2">
        <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
          <fj-form-item label="级别" prop="priority">
            <fj-select v-model="formData.priority">
              <fj-option
                      v-for="item in PRIORITY"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="触发方式" prop="priority">
            <fj-select v-model="formData.priority">
              <fj-option
                      v-for="item in PRIORITY"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="警告水位线" prop="priority">
            <fj-select v-model="formData.priority">
              <fj-option
                      v-for="item in PRIORITY"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="警告水位线" prop="priority">
            <fj-select v-model="formData.priority">
              <fj-option
                      v-for="item in PRIORITY"
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
          source: {
            _id: '',
            name: '',
            type: ''
          }
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          source: [
            { required: true, message: '请选择目标' },
            {
              message: '请选择目标',
              validator: (rule, value, callback) => {
                if (value.name) {
                  return true;
                }
                return false;
              }
            }
          ]
        },
        dialogVisible: false,
        bucketDialogVisible: false,
        pathDialogVisible: false,
        activeTabName: 'tab1',
        PRIORITY: config.PRIORITY,
              TRIGGER_TYPE: config.TRIGGER_TYPE,
              SCHEDULE_TYPE: config.SCHEDULE_TYPE,
              ORDER_BY: config.ORDER_BY,
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
          source: {
            _id: '',
            name: '',
            type: ''
          }
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
<style scope>
  .group-input {
    float: left;
    width: 122px;
    margin-right: 10px;
  }
</style>

