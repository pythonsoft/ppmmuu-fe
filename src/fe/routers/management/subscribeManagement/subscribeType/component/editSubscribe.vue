<template>
  <fj-slide-dialog
          :title="title"
          :visible.sync="dialogVisible"
          @close="close">
    <fj-form :model="formData" :rules="rules" ref="editForm" label-width="110px">
      <fj-form-item label="标识" prop="_id">
        <fj-input v-model="formData._id" :disabled="type==='edit'"></fj-input>
      </fj-form-item>
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"></fj-input>
      </fj-form-item>
      <fj-form-item label="图标" prop="photo">
        <div style="height:95px;">
          <upload-img :imgPath="formData.photo" changeTitle="修改图标" @img-change="imgChange"></upload-img>
        </div>
      </fj-form-item>
      <fj-form-item label="描述">
        <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
      </fj-form-item>
    </fj-form>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import { formatQuery } from '../../../../../common/utils';
  import UploadImg from '../../../../personalCenter/information/uploadImg';

  const api = require('../../../../../api/subscribeManagement');

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
      'upload-img': UploadImg,
    },
    data() {
      return {
        isBtnLoading: false,
        formData: {
          _id: '',
          name: '',
          photo: '',
          description: ''
        },
        rules: {
          _id: [
            { required: true, message: '请输入标识' }
          ],
          name: [
            { required: true, message: '请选择名字' }
          ],
          photo: [
            { required: true, message: '请选择图标' }
          ]
        },
        dialogVisible: false,
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
      id(val) {
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
        this.$refs.editForm.clearErrors();
        this.dialogVisible = true;
        const me = this;
        api.getSubscribeType({ params: { _id: this.id } })
          .then((res) => {
            me.formData = res.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      resetFormData() {
        this.$refs.editForm.clearErrors();
        this.formData = {
          _id: '',
          name: '',
          photo: '',
          description: ''
        };
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
        api.createSubscribeType(this.formData)
          .then((response) => {
            me.dialogVisible = false;
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
      edit() {
        this.isBtnLoading = true;
        const me = this;
        api.updateSubscribeType(this.formData)
          .then((response) => {
            me.dialogVisible  = false;
            me.$message.success('保存成功');
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
      imgChange(imgpath) {
        this.formData.photo = imgpath;
      }
    }
  };
</script>
<style scope>
  .group-input {
    float: left;
    width: 246px;
  }

  .group-input-unit {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border: 1px solid #CED9E5;
    border-radius: 4px;
  }
</style>

