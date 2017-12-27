<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog"
  >
      <div class="engine-setting">
        <div class="engine-setting-bar">
          <span class="engine-setting-bar-title">配置项</span>
          <fj-button type="primary" size="mini" @click="addClick">增加</fj-button>
          <fj-button type="danger" size="mini" @click="deleteClick" :disabled="!tableSelectInfo.key">删除</fj-button>
        </div>
        <div class="engine-setting-list">
          <fj-table :data="configuration" name="table" ref="table" @current-change="selectionChange" highlight-current-row>
            <fj-table-column prop="key" label="键"></fj-table-column>
            <fj-table-column prop="value" label="值" ></fj-table-column>
            <fj-table-column prop="description" label="描述"></fj-table-column>
          </fj-table>
        </div>
      </div>

    <div slot="footer">
      <fj-button @click="cancelClick">取消</fj-button>
      <fj-button type="primary" :disabled="submitBtn.disabled" :loading="submitBtn.loading" @click="_confirmFn" >{{submitBtn.text}}</fj-button>
    </div>

    <fj-dialog
      title="提示"
      :visible.sync="dialog.visible"
      @close="dialog.visible=false"
    >
      <span>确定要删除这些配置项吗?</span>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="dialog.visible=false">取消</fj-button><!--
        --><fj-button type="primary" @click="dialogConfirm">确定</fj-button>
      </div>
    </fj-dialog>

    <fj-dialog
      title="配置信息"
      :visible.sync="itemDialog.visible"
      @close="itemDialog.visible=false"
    >
      <template>
        <div class="engine-setting-dialog-item">
          请输入键
          <fj-input v-model.trim="itemInfo.key" autofocus />
        </div>
        <div class="engine-setting-dialog-item">
          请输入值
          <fj-input v-model.trim="itemInfo.value" />
        </div>
        <div class="engine-setting-dialog-item">
          请输入描述
          <fj-input type="textarea" :rows="5" v-model.trim="itemInfo.description" />
        </div>
      </template>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="itemDialog.visible=false">取消</fj-button><!--
        --><fj-button type="primary" @click="itemDialogConfirm">确定</fj-button>
      </div>
    </fj-dialog>

  </fj-slide-dialog>
</template>
<script>
  import './index.css';
  import utils from '../../../common/utils';

  const api = require('../../../api/engine');

  export default {
    name: 'settingSlideDialog',
    components: {

    },
    props: {
      name: { type: String, default: '引擎配置' },
      visible: { type: Boolean, default: false },
      vueInstance: { type: Object },
      engineInfo: { type: Object, default: {} }
    },
    data() {
      return {
        display: false,
        title: '',
        submitBtn: {},
        tableSelectInfo: {},
        configuration: [],
        dialog: {
          visible: false
        },
        itemDialog: {
          visible: false
        },
        itemInfo: {}
      };
    },
    watch: {
      visible(v) {
        this.display = v;
      },
      engineInfo(v) {
        this.setTitle(v.name);
        this.getEngine();
      }
    },
    created() {
      this.initItemInfo();
      this.initSubmitBtn();
      this.setTitle(this.engineInfo.name);
    },
    methods: {
      initItemInfo() {
        this.itemInfo = {
          key: '',
          value: '',
          description: ''
        };
      },
      initSubmitBtn() {
        this.submitBtn = {
          disabled: false,
          loading: false,
          text: '确定'
        };
      },
      setTitle(engineName) {
        this.title = `${this.name}(${engineName})`;
      },
      handleOpenSlideDialog() {},
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      _confirmFn() {
        this.updateEngineConfiguration();
      },
      cancelClick() {
        this.$emit('update:visible', false);
      },
      dialogConfirm() {
        this.removeConfigurationItem();
        this.dialog.visible = false;
      },
      itemDialogConfirm() {
        this.configuration.push(utils.deepClone(this.itemInfo));
        this.itemDialog.visible = false;
        this.initItemInfo();
      },
      /* table */
      selectionChange(current, prev) {
        this.tableSelectInfo = current;
      },

      /* table */
      addClick() {
        this.itemDialog.visible = true;
      },
      deleteClick() {
        this.dialog.visible = true;
      },
      removeConfigurationItem() {
        const arr = [];
        const item = this.tableSelectInfo;
        for (let i = 0; i < this.configuration.length; i++) {
          if (this.configuration[i].key !== item.key) {
            arr.push(this.configuration[i]);
          }
        }

        this.configuration = arr;
        this.tableSelectInfo = {};
      },

      getEngine() {
        const me = this;

        if (this.engineInfo._id) {
          const params = {
            id: this.engineInfo._id,
            fieldsNeed: 'configuration'
          };

          api.getEngine({ params: params }).then((res) => {
            me.configuration = res.data.configuration;
          }).catch((error) => {
            me.$message.error(error);
          });
        }
      },

      updateEngineConfiguration() {
        const me = this;

        if (this.engineInfo._id) {
          const params = {
            _id: this.engineInfo._id,
            configuration: JSON.stringify(this.configuration),
            ip: this.engineInfo.intranetIp
          };

          this.submitBtn = {
            disabled: true,
            loading: true,
            text: '提交中...'
          };

          api.updateEngineConfiguration(params).then((res) => {
            me.$message.success('添加配置成功');
            this.initSubmitBtn();
          }).catch((error) => {
            this.initSubmitBtn();
            me.$message.error(error);
          });
        }
      }
    }
  };
</script>
