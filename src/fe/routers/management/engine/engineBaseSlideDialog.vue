<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="visible"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog">

    <fj-form :model="formData" :rules="formDataRules" ref="configForm" label-width="80px">
      <fj-form-item label="名称" prop="name">
        <fj-input v-model="formData.name"/>
      </fj-form-item>
      <fj-form-item label="编码" prop="code">
        <fj-input v-model="formData.code"/>
      </fj-form-item>
      <fj-form-item label="外网IP" prop="ip">
        <fj-input v-model="formData.ip"/>
      </fj-form-item>
      <fj-form-item label="内网IP" prop="intranetIp">
        <fj-input v-model="formData.intranetIp"/>
      </fj-form-item>
      <fj-form-item label="地区">
        <fj-input v-model="formData.area"/>
      </fj-form-item>
      <fj-form-item label="所属">
        <fj-select placeholder="请选择" v-model="formData.belong" clearable>
          <fj-option
            v-for="item in belongOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="虚拟机">
        <fj-select placeholder="请选择" v-model="formData.isVirtual" clearable>
          <fj-option
            v-for="item in isVirtualOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="测试机">
        <fj-select placeholder="请选择" v-model="formData.isTest" clearable>
          <fj-option
            v-for="item in isTestOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </fj-form-item>
      <fj-form-item label="描述">
        <fj-input type="textarea" :rows="5" v-model="formData.description" />
      </fj-form-item>
    </fj-form>

    <div slot="footer">
      <fj-button @click="cancelClick">取消</fj-button>
      <fj-button type="primary" :disabled="submitBtn.disabled" :loading="submitBtn.loading" @click="confirmClick" >{{submitBtn.text}}</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import utils from '../../../common/utils';

  const api = require('../../../api/engine');

  export default {
    name: 'engineBaseSlideDialogView',
    props: ['vueInstance', 'engineInfo'],
    data() {
      return {
        title: '引擎信息',
        visible: false,
        bubble: this.vueInstance,
        selectedNodeInfo: {},

        formData: {
          code: '', // 编号
          name: '',
          belong: '',
          groupId: '',
          area: '',
          isVirtual: '0', // 0||1
          isTest: '0', // 0||1
          ip: '',
          intranetIp: '',
          description: ''
        },
        formDataRules: {
          code: [
            { required: true, message: '请输入引擎编号' }
          ],
          name: [
            { required: true, message: '请输入引擎名称' }
          ],
          groupId: [
            { required: true, message: '请输入引擎所属组Id' }
          ],
          ip: [
            {
              message: '请输入正确的ip格式',
              validator: (rule, value) => (!value ? true : utils.isIP(value))
            }
          ],
          intranetIp: [
            {
              message: '请输入正确的ip格式',
              validator: (rule, value) => (!value ? true : utils.isIP(value))
            }
          ]
        },
        belongOptions: [
          { value: '自有', label: '自有' },
          { value: '客户', label: '客户' }
        ],
        isVirtualOptions: [
          { value: '0', label: '否' },
          { value: '1', label: '是' }
        ],
        isTestOptions: [
          { value: '0', label: '否' },
          { value: '1', label: '是' }
        ],

        submitBtn: {
          disabled: false,
          loading: false,
          text: '确定'
        }
      };
    },
    created() {
      const me = this;

      me.bubble.$on('engine.selectedNodeInfo', (info) => {
        me.selectedNodeInfo = info;
        me.formData.groupId = info.id;
      });

      me.bubble.$on('engine.getSelectedNodeInfo.callback', (info) => {
        me.selectedNodeInfo = info;
        me.formData.groupId = info.id;
      });

      me.bubble.$emit('engine.getSelectedNodeInfo');

      // 传入需要渲染的engine信息
      me.bubble.$on('engine.getEngineInfo', (info) => {
        if (info && !utils.isEmptyObject(info)) {
          utils.merge(utils.deepClone(me.formData), info);
        }
        me.visible = true;
      });

      if (me.engineInfo) {
        me.formData = utils.merge(utils.deepClone(me.formData), me.engineInfo);
      }
    },
    methods: {
      initParam() {
        const me = this;
        me.visible = false;

        me.formData = {
          _id: '',
          code: '', // 编号
          name: '',
          belong: '',
          groupId: me.selectedNodeInfo.id || '',
          area: '',
          isVirtual: '0', // 0||1
          isTest: '0', // 0||1
          ip: '',
          intranetIp: '',
          description: ''
        };

        me.submitBtn = {
          disabled: false,
          loading: false,
          text: '确定'
        };
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      handleOpenSlideDialog() {},
      handleCloseSlideDialog() {},
      cancelClick() {
        this.visible = false;
      },
      confirmClick() {
        const me = this;
        if (me.formData._id) {
          // TODO
        } else {
          me.submitBtn.disabled = true;
          me.submitBtn.loading = true;

          console.log(me.formData);

          api.addEngine(me.formData).then((res) => {
            me.tableData = res.data.docs;
            me.$message.success('添加服务器成功');
            me.bubble.$emit('engine.reloadList');
            me.initParam();
          }).catch((error) => {
            me.submitBtn.disabled = false;
            me.submitBtn.loading = false;
            me.showErrorInfo(error.message);
          });
        }
      }
    }
  };
</script>
