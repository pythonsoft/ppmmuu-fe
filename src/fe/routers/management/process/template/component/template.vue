<template>
  <div>
  <fj-form :model="formData" :rules="rules" ref="editForm" label-width="90px">
    <fj-form-item label="标识">
      <fj-input v-model="formData._id" :disabled="type==='update'"></fj-input>
    </fj-form-item>
    <fj-form-item label="名称" prop="name">
      <fj-input v-model="formData.name"></fj-input>
    </fj-form-item>
    <fj-form-item label="分组" prop="groupName">
      <div class="group-input">
        <fj-input v-model="formData.groupName" :readonly="true"></fj-input>
      </div>
      <fj-button @click.stop.prevent="groupBrowserVisible=true">修改</fj-button>
    </fj-form-item>
    <template v-for="(item, index) in params" label="键">
      <fj-form-item label="键">
        <div class="group-input">
          <fj-input v-model="item.key"></fj-input>
        </div>
        <i class="iconfont icon-delete template-delete-col" @click="deleteCol(index)"></i>
      </fj-form-item>
      <fj-form-item label="值">
        <div class="group-input">
          <fj-input v-model="item.value"></fj-input>
        </div>
        <fj-button @click.stop.prevent="changeValue(item)">修改</fj-button>
      </fj-form-item>
    </template>
    <fj-form-item label="描述">
      <fj-input type="textarea" :rows="3" v-model="formData.description"></fj-input>
    </fj-form-item>
  </fj-form>

    <div class="template-dialog-footer">
      <i class="iconfont icon-jia template-add-col" @click="addCol"></i>
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" :loading="isBtnLoading" @click="submitForm">保存</fj-button>
    </div>
    <template-browser
            :visible.sync="templateBrowserVisible"
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
    params: []
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
        if (this.formData.params) {
          this.params = this.formData.params;
        }
      } else {

      }
    },
    data() {
      return {
        templateBrowserVisible: false,
        groupBrowserVisible: false,
        TYPE: TYPE,
        formData: templateInfo,
        isBtnLoading: false,
        currentItem: '',
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          groupName: [
            { required: true, message: '请选择分组' }
          ],
        },
        params: [],
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
        this.formData.params = this.params;
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
        this.formData.params = this.params;
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
        this.currentItem.value = row._id;
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
      },
      changeValue(item){
        this.currentItem = item;
        this.templateBrowserVisible = true;
      },
      addCol() {
        this.params.push({
          key: '',
          value: ''
        });
      },
      deleteCol(index) {
        this.params.splice(index, 1);
      }
    }
  };
</script>
