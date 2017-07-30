<template>
  <layout-two-row-title-view>
    <template slot="title">{{title}}</template>
    <template slot="content">
      <div class="edit-panel-section">
        <h2>基本信息</h2>
        <div></div>
        <fj-form :model="formData" :rules="rules" label-width="71px" ref="basicForm" custom-class="edit-group-form">
          <fj-form-item label="标识">
            <fj-input :readonly="true" :disabled="true" :value="info._id" />
          </fj-form-item>
          <fj-form-item label="名称" prop="name">
            <fj-input v-model="formData.name"/>
          </fj-form-item>
          <fj-form-item label="创建人">
            <fj-input :readonly="true" :disabled="true" :value="info.creator.name"/>
          </fj-form-item>
          <fj-form-item label="创建时间">
            <fj-input :readonly="true" :disabled="true" :value="info.createdTime | formatTime"/>
          </fj-form-item>
          <fj-form-item label="描述">
            <fj-input v-model="formData.description" type="textarea" :rows="5"></fj-input>
          </fj-form-item>
        </fj-form>
      </div>
      <div class="edit-panel-section">
        <h2>配置</h2>
        <fj-form label-width="71px" custom-class="edit-group-form">
          <fj-form-item label="删除保护">
            <fj-radio-group v-model="formData.deleteDeny" custom-class="radio-group">
              <fj-radio label="1">开启</fj-radio>
              <fj-radio label="0">关闭</fj-radio>
            </fj-radio-group>
          </fj-form-item>
        </fj-form>
      </div>
      <div class="edit-group-btn-group">
        <fj-button type="primary" @click="submitForm">保存</fj-button>
        <fj-button @click="handleClose">取消</fj-button>
      </div>
    </template>
  </layout-two-row-title-view>
</template>
<style>
  .edit-panel-section {
    border-top: 1px solid #EBF3FB;
    padding-top: 30px;
  }
  .edit-panel-section h2 {
    font-size: 14px;
  }
  .edit-panel-section.basic {
    min-height: 226px;
  }
  .edit-group-form {
    width: 55%;
    margin-top: 38px;
    margin-left: 149px;
  }
  .edit-group-btn-group {
    margin-left: 220px;
  }
  .edit-group-btn-group button {
    margin-right: 10px;
  }
  .radio-group {
    line-height: 36px;
  }
  .radio-group label {
    margin-right: 34px;
  }
</style>
<script>
  import layoutTwoRowTitleView from '../../../component/layout/twoRowTitle/index';

  const api = require('../../../api/engine');

  export default {
    name: 'engineGroupPropertyView',
    components: {
      'layout-two-row-title-view': layoutTwoRowTitleView
    },
    props: {
      vueInstance: { type: Object },
      selectedNodeInfo: { type: Object, default: {} }
    },
    data() {
      return {
        title: '属性',
        info: {
          creator: { name: '' }
        },
        formData: {
          name: '',
          deleteDeny: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        }
      };
    },
    created() {
      const me = this;

      api.getGroup({ params: { groupId: me.selectedNodeInfo.id } }).then((res) => {
        me.info = res.data;
        me.formData.name = me.info.name || '';
        me.formData.deleteDeny = me.info.deleteDeny;
        me.formData.description = me.info.description;
      }).catch((error) => {
        me.$message.error(error);
      });
    },
    methods: {
      submitForm() {
        const me = this;
        this.$refs.basicForm.validate((valid) => {
          if (valid) {
            const requestData = Object.assign({}, me.formData);
            requestData.groupId = me.selectedNodeInfo.id;

            api.updateGroup(requestData).then(() => {
              me.$message.success('保存成功');
            }).catch((error) => {
              me.$message.error(error);
            });
          }
        });
      },
      handleClose() {
        this.$emit('cancel');
      }
    }
  };
</script>
