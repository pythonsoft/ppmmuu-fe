<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
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
      <fj-button type="primary" :disabled="submitBtn.disabled" :loading="submitBtn.loading" @click="_confirmFn" >{{submitBtn.text}}</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import utils from '../../../common/utils';

  const api = require('../../../api/engine');

  export default {
    name: 'engineBaseSlideDialogView',
    props: {
      vueInstance: { type: Object },
      engineInfo: { type: Object },
      visible: { type: Boolean, default: false },
      type: { type: String, default: 'add' },
      selectedNodeInfo: { type: Object },
      confirmFn: { type: Function }
    },
    watch: {
      visible(v) {
        this.display = v;
      },
      engineInfo(v) {
        if (this.type === 'add') {
          this.initParam();
        } else {
          this.initEngineInfo(v);
        }
      },
      type(v) {
        if (v === 'add') {
          this.initParam();
        } else {
          this.initEngineInfo(this.engineInfo);
        }
      }
    },
    data() {
      return {
        title: '引擎信息',
        display: false,
        bubble: this.vueInstance,

        formData: '',
        formDataRules: {
          code: [
            { required: true, message: '请输入引擎编号' }
          ],
          name: [
            { required: true, message: '请输入引擎名称' }
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
      this.initParam();
    },
    methods: {
      initParam() {
        const me = this;

        me.formData = {
          _id: '',
          code: '', // 编号
          name: '',
          belong: '',
          area: '',
          groupId: me.selectedNodeInfo.id,
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
      initEngineInfo(engineInfo = {}) {
        if (utils.isEmptyObject(engineInfo)) {
          this.initParam();
        } else {
          this.formData._id = engineInfo._id || '';
          this.getEngine();
        }
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      handleOpenSlideDialog() {
      },
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      cancelClick() {
        this.$emit('update:visible', false);
      },
      _confirmFn() {
        const me = this;
        me.submitBtn.disabled = true;
        me.submitBtn.loading = true;

        if (me.formData._id) {
          api.updateEngine(me.formData).then((res) => {
            me.$message.success('已更新引擎信息');
            me.confirmFn && me.confirmFn(res.data);
            me.$emit('update:visible', false);
            me.submitBtn.disabled = false;
            me.submitBtn.loading = false;
          }).catch((error) => {
            me.submitBtn.disabled = false;
            me.submitBtn.loading = false;
            me.showErrorInfo(error);
          });
        } else {
          me.formData.groupId = me.selectedNodeInfo.id;
          api.addEngine(me.formData).then((res) => {
            me.$message.success('添加引擎成功');
            me.confirmFn && me.confirmFn(res.data);
            me.$emit('update:visible', false);
          }).catch((error) => {
            me.submitBtn.disabled = false;
            me.submitBtn.loading = false;
            me.showErrorInfo(error);
          });
        }
      },
      /* api */
      getEngine() {
        const me = this;
        const id = this.formData._id;
        if (id) {
          const params = {
            id: id
          };

          api.getEngine({ params: params }).then((res) => {
            const data = utils.merge(utils.deepClone(me.formData), res.data);
            data._id = res.data._id;
            me.formData = data;
          }).catch((error) => {
            me.showErrorInfo(error);
          });
        }
      }
    }
  };
</script>
