<template>
  <fj-dialog
          title="编辑组"
          :visible.sync="visible"
          @close="handleClose">
    <fj-form :model="formData" :rules="rules" ref="form" label-position="top">
      <fj-form-item :label="`请输入组名称`" prop="name">
        <fj-input v-model="formData.name" />
      </fj-form-item>
      <fj-form-item label="删除保护">
        <fj-radio-group v-model="formData.deleteDeny" custom-class="radio-group">
          <fj-radio label="1">开启</fj-radio>
          <fj-radio label="0">关闭</fj-radio>
        </fj-radio-group>
      </fj-form-item>
    </fj-form>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="handleClose">取消</fj-button><!--
        --><fj-button type="primary" :loading="isBtnLoading" @click="submitForm('form')">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import groupAPI from '../../../../../api/processTemplate';
  import { formatQuery } from '../../../../../common/utils';

  export default {
    props: {
      id: String,
      dialogVisible: Boolean
    },
    data() {
      return {
        visible: false,
        isBtnLoading: false,
        formData: {
          _id: '',
          name: '',
          deleteDeny: '1'
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        }
      };
    },
    watch: {
      dialogVisible(val) {
        this.visible = val;
        this.getGroup();
      },
      id(val) {
        this.getGroup();
      }
    },
    methods: {
      handleClose() {
        this.$emit('update:dialogVisible', false);
      },
      getGroup(){
        const me = this;
        groupAPI.getGroup(formatQuery({groupId: me.id}, true))
          .then(function(res){
            me.formData._id = res.data._id;
            me.formData.name = res.data.name;
            me.formData.deleteDeny = res.data.deleteDeny;
          })
          .catch(function(error){
            me.$message.error(error);
          })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const me = this;
            const postData = {};
            postData.name = this.formData.name;
            postData.deleteDeny = this.formData.deleteDeny;
            postData.groupId = this.formData._id;
            this.isBtnLoading = true;
            groupAPI.updateGroup(postData)
              .then((response) => {
                me.$emit('edited', { name: me.formData.name });
                me.formData.name = '';
                me.formData.deleteDeny = '1';
                me.$emit('edited');
                me.$message.success('保存成功');
                me.isBtnLoading = false;
                me.handleClose();
              })
              .catch((error) => {
                this.isBtnLoading = false;
                this.$message.error(error);
              });
          }
        });
      }
    }
  };
</script>
<style>
  .radio-group {
    line-height: 36px;
  }
  .radio-group label {
    margin-right: 34px;
  }
</style>
