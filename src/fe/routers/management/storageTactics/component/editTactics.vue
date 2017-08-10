<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <fj-tab-pane label="基本信息" name="tab1" @tab-click="handleTabClick">
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
              <fj-input :readonly="true" :value="formatSourceName()"></fj-input>
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
          <fj-form-item label="触发方式" prop="triggerType">
            <fj-select v-model="formData.triggerType">
              <fj-option
                      v-for="item in TRIGGER_TYPE"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="计划周期" prop="scheduleType">
            <fj-select v-model="formData.scheduleType">
              <fj-option
                      v-for="item in SCHEDULE_TYPE"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="计划时间" prop="scheduleTime">
            <fj-input v-model="formData.scheduleTime"></fj-input>
          </fj-form-item>
          <fj-form-item label="执行顺序" prop="orderBy">
            <fj-select v-model="formData.orderBy">
              <fj-option
                      v-for="item in ORDER_BY"
                      :key="item.key"
                      :value="item.value"
                      :label="item.text"></fj-option>
            </fj-select>
          </fj-form-item>
          <fj-form-item label="每次提交数" prop="itemCount">
            <fj-input v-model="formData.itemCount"></fj-input>
          </fj-form-item>
          <fj-form-item label="提交频率" prop="frequency">
            <fj-input v-model="formData.frequency"></fj-input>
          </fj-form-item>
          <fj-form-item label="执行脚本" prop="script">
            <fj-input type="textarea" :rows="5" v-model="formData.script"></fj-input>
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
    <search-add-path
            @add-path="addPath"
            :visible.sync="pathDialogVisible">
    </search-add-path>
  </fj-slide-dialog>
</template>
<script>
  import searchAddBucket from './searchAddBucket';
  import searchAddPath from './searchAddPath';

  const config = require('../config');
  const api = require('../../../../api/storage');

  export default {
    props: {
      type: String,
      title: String,
      id: String,
      source: {
        type: Object,
        default: null
      },
      sourceType: String,
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'search-add-bucket': searchAddBucket,
      'search-add-path': searchAddPath
    },
    data() {
      return {
        isBtnLoading: false,
        formData:  {
          source: {
            _id: '',
            name: '',
            type: ''
          },
          type: '0',
          priority: '1',
          triggerType: '0',
          scheduleType: '3',
          orderBy: '0'
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          source: [
            { required: true, message: '请选择目标' },

          ]
        },
        dialogVisible: false,
        bucketDialogVisible: false,
        pathDialogVisible: false,
        activeTabName: 'tab1',
        TYPE: config.TYPE,
        PRIORITY: config.PRIORITY,
        TRIGGER_TYPE: config.TRIGGER_TYPE,
        SCHEDULE_TYPE: config.SCHEDULE_TYPE,
        ORDER_BY: config.ORDER_BY
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
      if(this.source && this.source._id){
        this.formData.source = {
          _id: this.source._id,
          name: this.source.name,
          type: this.sourceType
        }
      }
    },
    methods: {
      initEditUser() {
        this.dialogVisible = true;
        const me = this;
        api.getTacticDetail({ params: { _id: this.id } })
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
          },
          type: '0',
          priority: '1',
          triggerType: '0',
          scheduleType: '3',
          orderBy: '0'
        };
        if(this.source && this.source._id){
          this.formData.source = {
            _id: this.source._id,
            name: this.source.name,
            type: this.sourceType
          }
        }
      },
      formatSourceName(){
        const source = this.formData.source;
        if(source && source.type === '0'){
          return '存储区-' + source.name;
        }else if(source && source.type === '1'){
          return '路径-' + source.name;
        }else{
          return '';
        }
      },
      submitForm() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (this.type === 'add') {
              this.add();
            } else {
              this.edit();
            }
          }
        });
      },
      add() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.status = '0';
        if(this.formData.itemCount) {
          this.formData.itemCount = parseInt(this.formData.itemCount);
        }
        if(this.formData.frequency) {
          this.formData.frequency = parseInt(this.formData.frequency);
        }
        api.addTactics(this.formData)
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
      edit() {
        this.isBtnLoading = true;
        const me = this;
        this.formData.itemCount = parseInt(this.formData.itemCount);
        this.formData.frequency = parseInt(this.formData.frequency);
        api.updateTactics(this.formData)
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
      handleTabClick() {

      },
      close() {
        this.dialogVisible = false;
        this.resetFormData();
        this.$emit('update:visible', false);
      },
      addBucket(row) {
        this.formData.source = {
          _id: row._id,
          name: row.name,
          type: '0',
        }
      },
      addPath(row) {
        this.formData.source = {
          _id: row._id,
          name: row.name,
          type: '1',
        }
      },
      handleTabClick() {

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

