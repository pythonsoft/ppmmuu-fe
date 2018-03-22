<template>
  <div>
  <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
    <fj-form-item label="标志">
      <fj-input v-model="formData._id" :disabled="type==='update'"></fj-input>
    </fj-form-item>
    <fj-form-item label="名称" prop="name">
      <fj-input v-model="formData.name"></fj-input>
    </fj-form-item>
    <fj-form-item label="流程id" prop="processId">
      <fj-input placeholder="对应java流程id" v-model="formData.processId"></fj-input>
    </fj-form-item>
    <fj-form-item label="模板类型" prop="type">
      <fj-select placeholder="请选择" v-model="formData.type">
        <fj-option
                v-for="item in TYPE"
                :key="item.key"
                :label="item.text"
                :value="item.value">
        </fj-option>
      </fj-select>
    </fj-form-item>
    <fj-form-item label="模板" prop="templateName">
      <div class="group-input">
        <fj-input v-model="formData.templateName" :readonly="true"></fj-input>
      </div>
      <fj-button @click.stop.prevent="templateBrowserVisible=true">修改</fj-button>
    </fj-form-item>
    <fj-form-item label="分组" prop="groupName">
      <div class="group-input">
        <fj-input v-model="formData.groupName" :readonly="true"></fj-input>
      </div>
      <fj-button @click.stop.prevent="groupBrowserVisible=true">修改</fj-button>
    </fj-form-item>
    <fj-form-item label="描述">
      <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
    </fj-form-item>
  </fj-form>

    <div class="template-dialog-footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <template-browser
            :visible.sync="templateBrowserVisible"
            :type="formData.type"
            @confirm="addTemplate"
    ></template-browser>
    <add-group :visible.sync="groupBrowserVisible"  @add-owner="addOwner" @list-group="listGroup" title="修改分组"></add-group>
  </div>
</template>
<script>
  import '../index.css';

  import AddGroup from './groupTree';
  import TemplateBrowser from './templateBrowser';
  import { formatQuery } from '../../../../../common/utils';
  import { TYPE } from '../config';

  const config = require('../../../task/config');
  const api = require('../../../../../api/processTemplate');
  const templateInfo = {
    _id: '',
    name: '',
    groupId: '',
    groupName: '',
    description: '',
    type: '',
    templateId: '',
    templateName: '',
    processId: '',
  };

  export default {
    name: 'templateForm',
    props: {
      templateInfo: Object,
      type: String,
      groupId: {
        type: String,
        default: ''
      }
    },
    components: {
      AddGroup,
      TemplateBrowser
    },
    created() {
      if (this.type !== 'add') {
        this.formData = JSON.parse(JSON.stringify(this.templateInfo));
      }
    },
    data() {
      return {
        templateBrowserVisible: false,
        groupBrowserVisible: false,
        TYPE: TYPE,
        formData: templateInfo,
        isBtnLoading: false,
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          type: [
            { required: true, message: '请选择模板类型' }
          ],
          groupName: [
            { required: true, message: '请选择分组' }
          ],
          templateName: [
            { required: true, message: '请选择模板' }
          ],
        }
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      submitForm() {
        const me = this;
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            if (!me.templateInfo) {
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
        api.createTemplate(data, me).then((res) => {
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
        api.update(data, me).then((res) => {
          me.$message.success('保存成功');
          me.$emit('listTemplate');
          me.close();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      addOwner(row) {
        row = row.info ? row.info : row;
        const type = row.type || '3';
        const postData = {
          type: type,
          _id: row._id
        };
        this.formData.groupId = row._id;
        this.formData.groupName = row.name;
        this.groupBrowserVisible = false;
      },
      addTemplate(row) {
        this.formData.templateId = row._id;
        this.formData.templateName = row.name;
      },
      listGroup(query, cb){
        const me = this;
        api.listGroup(formatQuery(query, true)).then((res) => {
          const docs = res.data.docs || [];
          if (docs.length === 0) {
            me.groupBrowserVisible = false;
            me.$message.error('没有分组信息');
          }
          cb && cb(res.data.docs);
        }).catch((err) => {
          me.$message.error(err);
        });
      }
    }
  };
</script>
