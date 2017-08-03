<template>
  <layout-two-column>
    <template slot="left">
      <tree-view
        :title="treeTitle"
        :vueInstance="vueInstance"
        :menus="dropMenus"
        :execCommand="execCommand"
        :listGroup="listGroup"
        :btnClick="btnClick"
        :treeNodeCurrentChange="treeNodeCurrentChange"
      ></tree-view>
    </template>
    <template slot="right">

      <engine-list-view
        v-if="viewRouter === 'engineListView'"
        :vueInstance="vueInstance"
        :selectedNodeInfo="selectedNodeInfo"
        @display-slide-dialog="displaySlideDialog"
        @display-setting-slide-dialog="displaySettingSlideDialog"
        @display-service-list-view="displayServiceListView"
        @display-dialog="displayDialog"
        @engine-select="selectFn"
      ></engine-list-view>

      <engine-property-view
        v-if="viewRouter === 'propertyView'"
        :selectedNodeInfo="selectedNodeInfo"
        @cancel="homeView"
      ></engine-property-view>

      <service-list-view
        v-if="viewRouter === 'serviceListView'"
        :title="engineInfo.name"
        :vueInstance="vueInstance"
        :engineInfo="engineInfo"
        :visible.sync="serviceListViewVisible"
        @cancel="closeServiceListView"
        @select="processSelectFn"
        @display-process-slide-dialog="displayProcessSlideDialog"
      >
      </service-list-view>

    </template>

    <engine-dialog-view
      :vueInstance="vueInstance"
      :selectedNodeInfo="selectedNodeInfo"
      :engineInfo="engineInfo"
      :actionName.sync="actionName"
      :visible.sync="visible"
      :confirmFn="confirmFn"
    ></engine-dialog-view>

    <engine-base-slide-dialog-view
      :vueInstance="vueInstance"
      :engineInfo="engineInfo"
      :selectedNodeInfo="selectedNodeInfo"
      :visible.sync="slideDialogVisible"
      :type="slideDialogType"
      :confirmFn="slideDialogConfirmFn"
    ></engine-base-slide-dialog-view>

    <setting-slide-dialog-view
      :vueInstance="vueInstance"
      :engineInfo="engineInfo"
      :visible.sync="settingDialogVisible"
      @confirm="settingSlideDialogConfirmFn"
    ></setting-slide-dialog-view>

    <engine-process-slide-dialog-view
      :vueInstance="vueInstance"
      :engineInfo="engineInfo"
      :processInfo="processInfo"
      :visible.sync="processSlideDialogVisible"
      @confirm="processSlideDialogConfirmFn"
    ></engine-process-slide-dialog-view>

  </layout-two-column>
</template>
<script>
  import Vue from 'vue';

  import layoutTwoColumn from '../../../component/layout/twoColumn/index';
  import treeView from '../../../component/higherOrder/tree/index';

  import dialogView from './dialog';
  import engineListView from './engineList';
  import propertyView from './propertyView';
  import engineBaseSlideDialogView from './engineBaseSlideDialog';
  import settingSlideDialogView from './settingSlideDialog';
  import engineProcessSlideDialogView from './engineProcessSlideDialog';
  import serviceListView from './serviceList';

  const api = require('../../../api/engine');

  export default {
    components: {
      'layout-two-column': layoutTwoColumn,
      'tree-view': treeView,
      'engine-dialog-view': dialogView,
      'engine-list-view': engineListView,
      'engine-base-slide-dialog-view': engineBaseSlideDialogView,
      'setting-slide-dialog-view': settingSlideDialogView,
      'engine-process-slide-dialog-view': engineProcessSlideDialogView,
      'engine-property-view': propertyView,
      'service-list-view': serviceListView
    },
    data() {
      return {
        treeTitle: '引擎分组',
        vueInstance: null,
        viewRouter: '',
        /* dialog*/
        visible: false,
        actionName: 'createGroup',
        /* dialog*/
        slideDialogVisible: false,
        settingDialogVisible: false,
        serviceListViewVisible: false,
        slideDialogType: 'add',
        selectedNodeInfo: {},
        engineInfo: {},
        dropMenus: { group: [
          { name: '删除分组', command: 'deleteGroup' },
          { name: '属性', command: 'propertyView' }
        ] },
        /* process */
        processInfo: {},
        processSlideDialogVisible: false
      };
    },
    created() {
      const me = this;
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.vueInstance = new Vue();

      this.vueInstance.$on('engine.setViewRouter', (router) => {
        me.viewRouter = router;
      });
    },
    destroyed() {
      this.vueInstance.$off('engine.setViewRouter');
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      /* engine list */
      selectFn(info) {
        this.engineInfo = info || {};
      },
      slideDialogConfirmFn() {
        this.vueInstance.$emit('engine.listEngine');
      },
      settingSlideDialogConfirmFn() {
      //        this.vueInstance.$emit('engine.listEngine');
      },
      /* engine list */
      /* slide dialog */
      displaySlideDialog(flag, type) {
        this.slideDialogVisible = flag;
        this.slideDialogType = type;
      },
      displaySettingSlideDialog(flag) {
        this.settingDialogVisible = flag;
      },
      /* slide dialog */

      /* service view */
      displayServiceListView(flag) {
        this.serviceListViewVisible = flag;

        if (flag) {
          this.vueInstance.$emit('engine.setViewRouter', 'serviceListView');
        } else {
          this.vueInstance.$emit('engine.setViewRouter', 'engineListView');
        }
      },
      closeServiceListView() {
        this.serviceListViewVisible = false;
        this.vueInstance.$emit('engine.setViewRouter', 'engineListView');
      },
      /* service view */

      /* dialog */
      btnClick(treeNode) {
        this.selectedNodeInfo = treeNode;
        this.visible = true;
      },
      confirmFn() {
      },
      displayDialog(flag, actionName) {
        this.visible = flag;
        this.actionName = actionName;
      },
      /* dialog */
      /* tree */
      execCommand(command, node) {
        if (command === 'deleteGroup') {
          this.selectedNodeInfo = node;
          this.visible = true;
          this.actionName = command;
          this.vueInstance.$emit('tree.listGroup');
        } else {
          this.viewRouter = command;
        }
      },
      treeNodeCurrentChange(treeNode) {
        this.selectedNodeInfo = treeNode;
        this.vueInstance.$emit('engine.setViewRouter', 'engineListView');
      },

      /* process */
      processSlideDialogConfirmFn() {

      },
      processSelectFn(info) {
        this.processInfo = info || {};
      },
      displayProcessSlideDialog(flag) {
        this.processSlideDialogVisible = flag;
      },

      listGroup(treeNode, cb) {
        const me = this;

        const param = {
          parentId: treeNode.id || '',
          page: 1,
          pageSize: 200,
          fields: '',
          isIncludeChild: '1'
        };

        api.listGroup({ params: param }).then((res) => {
          me.vueInstance.$emit('engine.listEngine');
          cb && cb(res.data.docs);
        }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      /* tree */
      homeView() {
        this.viewRouter = 'engineListView';
      }
    }
  };
</script>
