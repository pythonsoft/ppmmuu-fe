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
        @display-dialog="displayDialog"
        @engine-select="selectFn"
      ></engine-list-view>

      <engine-property-view
        v-if="viewRouter === 'propertyView'"
        :selectedNodeInfo="selectedNodeInfo"
        @cancel="homeView"
      ></engine-property-view>

    </template>

    <engine-dialog-view
      :vueInstance="vueInstance"
      :selectedNodeInfo="selectedNodeInfo"
      :engineInfo="engineInfo"
      :actionName="actionName"
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

  const api = require('../../../api/engine');

  export default {
    components: {
      'layout-two-column': layoutTwoColumn,
      'tree-view': treeView,
      'engine-dialog-view': dialogView,
      'engine-list-view': engineListView,
      'engine-base-slide-dialog-view': engineBaseSlideDialogView,
      'engine-property-view': propertyView
    },
    data() {
      return {
        treeTitle: '引擎分组',
        vueInstance: null,
        viewRouter: '',
        /* dialog*/
        visible: false,
        actionName: '',
        /* dialog*/
        slideDialogVisible: false,
        slideDialogType: 'add',
        selectedNodeInfo: {},
        engineInfo: {},
        dropMenus: { group: [
          { name: '删除分组', command: 'deleteGroup' },
          { name: '状态', command: 'showStatus' },
          { name: '配置', command: 'showConfigs' },
          { name: '属性', command: 'propertyView' }
        ] }
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
      /* engine list */
      /* slide dialog */
      displaySlideDialog(flag, type) {
        this.slideDialogVisible = flag;
        this.slideDialogType = type;
      },
      /* slide dialog */
      /* dialog */
      btnClick(treeNode) {
        this.selectedNodeInfo = treeNode;
        this.visible = true;
      },
      confirmFn() {},
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
        } else {
          this.viewRouter = command;
        }
      },
      treeNodeCurrentChange(treeNode) {
        this.selectedNodeInfo = treeNode;
        this.vueInstance.$emit('engine.setViewRouter', 'engineListView');
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
