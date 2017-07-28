<template>
  <layout-two-row-tree class="ho-tree-layout">
    <template slot="title">{{ title }}</template>
    <template slot="button">
      <fj-button size="mini" @click="_btnClick">{{ addBtnText }}</fj-button>
    </template>
    <div class="ho-empty-line" v-if="treeData.length === 0">没有数据</div>
    <template v-else slot="tree">
      <fj-tree
        :data="treeData"
        node-key="nodeKey"
        :render-content="renderContent"
        @node-click="_treeNodeClick"
        @current-change="_treeNodeCurrentChange"
        @node-expand="_treeNodeExpand"
        @node-collapse="_treeNodeCollapse">
      </fj-tree>
    </template>
  </layout-two-row-tree>
</template>
<script>
  import './index.css';
  import utils from '../../../common/utils';
  import layoutTwoRowTree from '../../../component/layout/twoRowTree/index';
  import TreeNodeContent from './treeNodeContent';

  const TreeDataBase = function (key) {
    this.td = [];
    this.indexs = {};
    this.indexKey = key;
  };
  TreeDataBase.prototype = {
    composeData(d) {
      let arr = null;
      const indexKey = this.indexKey;

      for (let i = 0, len = d.length; i < len; i++) {
        if (!arr) { arr = []; }
        arr.push({ id: d[i][indexKey], name: d[i].name, info: d[i], children: d[i].children });
      }

      return arr;
    },
    get(parentId) {
      if (this.td.length === 0) { return null; }

      const parentIndex = this.indexs[parentId];

      if (!parentIndex) {
        return null;
      }

      const indexArray = parentIndex.split('-');

      let info = null;

      for (let i = 0, len = indexArray.length; i < len; i++) {
        if (i === 0) {
          info = this.td[indexArray[i] * 1];
        } else {
          info = info.children ? info.children[indexArray[i] * 1] : null;
        }
      }

      return { info, parentIndex };
    },
    insert(parentId, infos) {
      if (!infos && infos.length === 0) {
        return false;
      }

      if (!parentId) {
        this.td = this.composeData(infos);
        this.indexs = {};

        for (let i = 0, len = infos.length; i < len; i++) {
          this.indexs[infos[i][this.indexKey]] = `${i}`;
        }

        return false;
      }

      const val = this.get(parentId);

      if (!val) {
        return false;
      }

      const info = val.info;
      const parentIndex = val.parentIndex;

      this.remove(parentId);

      for (let i = 0, len = infos.length; i < len; i++) {
        this.indexs[infos[i][this.indexKey]] = `${parentIndex}-${i}`;
      }

      info.children = this.composeData(infos);

      return true;
    },
    remove(parentId) {
      if (!parentId) {
        this.td = [];
        return false;
      }
      const val = this.get(parentId);

      if (!val) {
        return false;
      }

      const children = val.info.children;

      if (!children) {
        return false;
      }

      for (let i = 0, len = children.length; i < len; i++) {
        if (this.indexs[children[i][this.indexKey]]) {
          delete this.indexs[children[i][this.indexKey]];
        }
      }

      val.info.children = [];

      return true;
    },
    getTreeData() {
      return utils.deepClone(this.td);
    }
  };

  export default {
    name: 'treeView',
    components: {
      TreeNodeContent,
      'layout-two-row-tree': layoutTwoRowTree
    },
    data() {
      return {
        treeData: [],
        items: {},
        selectedNodeInfo: {},
        bubble: this.vueInstance,
        treeDataBaseInstance: null
      };
    },
    props: {
      nodeKey: { type: String, default: 'id' },
      treeDataBaseKey: { type: String, default: '_id' },
      title: { type: String, default: '分组' },
      addBtnText: { type: String, default: '添加组' },
      vueInstance: { type: Object },
      menus: {},
      menuWidth: { type: String },
      commandFieldName: { type: String },
      execCommand: { type: Function },
      treeNodeClick: { type: Function },
      treeNodeCurrentChange: { type: Function },
      treeNodeExpand: { type: Function },
      treeNodeCollapse: { type: Function },
      btnClick: { type: Function },
      listGroup: { type: Function },
    },
    created() {
      const me = this;

      me._listGroup();

      me.bubble.$on('tree.listGroup', () => {
        me._listGroup();
      });

      me.bubble.$on('tree.removeNode', (parentId) => {
        me.removeNode(parentId);
      });

      me.bubble.$on('tree.insertNode', (parentId, data) => {
        me.insertNode(parentId, data);
      });

      this.treeDataBaseInstance = new TreeDataBase(this.treeDataBaseKey);
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },

      /* tree */
      _treeNodeClick(node) {
        this.treeNodeClick && this.treeNodeClick(node);
      },
      _treeNodeCurrentChange(node) {
        const me = this;
        me.selectedNodeInfo = node;
        me._listGroup();
        me.treeNodeCurrentChange && me.treeNodeCurrentChange(node);
      },
      _treeNodeExpand(node) {
        this.treeNodeExpand && this.treeNodeExpand(node);
      },
      _treeNodeCollapse(node) {
        this.treeNodeCollapse && this.treeNodeCollapse(node);
      },
      /* tree node */
      getMenu(node) {
        let array = [];

        if (!this.menus || utils.isEmptyObject(this.menus)) {
          return array;
        }

        if (this.commandFieldName && typeof node.info[this.commandFieldName] !== 'undefined') {
          array = this.menus[node.info[this.commandFieldName]];
        } else {
          for (const k in this.menus) {
            if (Object.prototype.hasOwnProperty.call(this.menus, k)) {
              array = this.menus[k];
            }
            break;
          }
        }

        return array;
      },
      renderContent(h, node) {
        const me = this;
        const menus = me.getMenu(node);

        return h(TreeNodeContent, {
          props: {
            node: node,
            menus: menus,
            width: me.menuWidth,
            execCommand(command) {
              me.execCommand && me.execCommand(command, node, {
                insertNode: me.insertNode,
                removeNode: me.removeNode
              });
            }
          }
        });
      },
      /* tree node */
      /* tree */
      _btnClick() {
        this.btnClick && this.btnClick(this.selectedNodeInfo);
      },

      insertNode(parentId, data) {
        this.treeDataBaseInstance.insert(parentId, data);
        this.treeData = this.treeDataBaseInstance.getTreeData();
      },

      removeNode(parentId) {
        this.treeDataBaseInstance.remove(parentId);
        this.treeData = this.treeDataBaseInstance.getTreeData();
      },

      _listGroup() {
        const me = this;

        this.listGroup && this.listGroup(this.selectedNodeInfo, (data) => {
          me.insertNode(me.selectedNodeInfo.id, data);
        });
      }

    }
  };
</script>
