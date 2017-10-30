<template>
  <fj-tree
    lazy
    :load="loadChildren"
    :default-expanded-key="defaultExpandedKey"
    v-if="!showUpper"
    :theme="theme"
    :data="treeData"
    :auto-expand="autoExpand"
    :node-key="nodeKey"
    :render-content="renderItem"
    @current-change="_treeNodeCurrentChange"
    @node-expand="treeNodeExpand"
    @node-collapse="treeNodeCollapse">
  </fj-tree>

  <layout-two-row-tree v-else class="ho-tree-layout" :showUpper="showUpper">
    <template v-if="title" slot="title">{{ title }}</template>
    <template v-if="addBtnText" slot="button">
      <fj-button size="mini" @click="_btnClick">{{ addBtnText }}</fj-button>
    </template>
    <div class="ho-empty-line" v-if="treeData.length === 0">没有数据</div>
    <template v-else slot="tree">
      <fj-tree
        lazy
        :load="loadChildren"
        :default-expanded-key="defaultExpandedKey"
        :data="treeData"
        :auto-expand="autoExpand"
        :node-key="nodeKey"
        :render-content="renderItem"
        @current-change="_treeNodeCurrentChange"
        @node-expand="treeNodeExpand"
        @node-collapse="treeNodeCollapse">
      </fj-tree>
    </template>
  </layout-two-row-tree>
</template>
<script>
  import { formatTree } from '../../../common/utils';
  import './index.css';
  import utils from '../../../common/utils';
  import LayoutTwoRowTree from '../../../component/layout/twoRowTree/index';
  import TreeNodeContent from './treeNodeContent';

  class TreeDataBase {
    constructor(nodeKey) {
      this.key = nodeKey;
      this.topIndexs = [];
      this.indexs = [];
      this.nodes = {};
    }
    remove(id) {
      const index = this.indexs.indexOf(id);
      if (index > -1) {
        this.indexs.splice(index, 1);
        if (this.topIndexs.indexOf(id) > -1) {
          this.topIndexs.splice(this.topIndexs.indexOf(id), 1);
        } else {
          const parentId = this.nodes[id].parentId;
          if (parentId && this.nodes[parentId].children) {
            // 修改父节点的children索引
            const childrenIndex = this.nodes[parentId].children.indexOf(id);
            if (childrenIndex > -1) {
              this.nodes[parentId].children.splice(childrenIndex, 1);
            }
          }
        }
        delete this.nodes[id];
      }
    }
    update(id, newInfo) {
      if (this.nodes[id]) {
        this.nodes[id] = Object.assign(this.nodes[id], newInfo);
      }
    }
    insertNode(parentId = '', node) {
      if (!parentId) {
        this.topIndexs.push(node[this.key]);
      } else {
        if (this.nodes[parentId].children) {
          this.nodes[parentId].children.push(node._id);
        } else {
          this.nodes[parentId].children = [node._id];
        }
        node.parentId = parentId;
      }
      this.indexs.push(node[this.key]);
      this.nodes[node[this.key]] = node;
    }
    insert(parentId = '', children) {
      if (parentId) {
        // 置空父元素的childrenids数组，再更新
        this.nodes[parentId].children = [];
      } else {
        // 如果没有parentId，意味着这些为一级节点，需要更新topindexs
        children.forEach(node => {
          if (this.topIndexs.indexOf(node[this.key]) < 0) {
            this.topIndexs.push(node[this.key]);
          }
        });
      }
      children.forEach(node => {
        if (this.indexs.indexOf(node[this.key]) < 0) {
          this.indexs.push(node[this.key]);
        }
        if (parentId) {
          this.nodes[parentId].children.push(node[this.key]);
        }
        node.parentId = parentId;
        this.nodes[node[this.key]] = node;
      });
    }
    getParents(id) {
      const parents = [];
      if (!this.nodes[id]) return parents;
      let parentId = this.nodes[id].parentId;
      while (parentId) {
        parents.push(this.nodes[parentId]);
        parentId = this.nodes[parentId].parentId;
      }
      return parents;
    }
    getNode(id) {
      if (!id) return null;
      const node = Object.assign({}, this.nodes[id]);
      const childrenIds = this.nodes[id].children;
      if (childrenIds && childrenIds.length > 0) {
        node.isFolder = true;
        const children = [];
        for (let i = 0; i < childrenIds.length; i++) {
          const id = childrenIds[i];
          if (this.nodes[id]) {
            children.push(this.getNode(id));
          }
        }
        node.children = children;
      }
      return node;
    }
    getTreeData() {
      const data = this.topIndexs.map(index => {
        return this.getNode(index);
      });
      // console.log('getTreeData', data);
      return data;
    }
  };

  export default {
    props: {
      defaultTreeData: {
        type: Array,
        default() {
          return [];
        }
      },
      nodeKey: { type: String, default: '_id' },
      title: { type: String, default: '分组' },
      addBtnText: { type: String, default: '添加组' },
      showUpper: { type: Boolean, default: true },
      vueInstance: { type: Object },
      menus: {},
      menuWidth: { type: String },
      commandFieldName: { type: String },
      execCommand: { type: Function },
      treeNodeClick: { type: Function },
      treeNodeCurrentChange: { type: Function },
      treeNodeExpand: { type: Function, default: () => {} },
      treeNodeCollapse: { type: Function, default: () => {} },
      btnClick: { type: Function },
      listGroup: { type: Function },
      renderContent: { type: Function },
      rootKey: { type: String, default: '' },
      theme: String,
      autoExpand: { type: Boolean, default: true },
      defaultExpandedKey: String
    },
    data() {
      return {
        selectedNodeInfo: null,
        treeData: [],
        treeDataBaseInstance: null
      };
    },
    created() {
      this.treeDataBaseInstance = new TreeDataBase(this.nodeKey);
      this.vueInstance.$on('tree.listGroup', (parentId) => {
        this._listGroup(parentId);
      });
      this.vueInstance.$on('tree.removeNode', (id) => {
        this.removeNode(id);
      });
      this.vueInstance.$on('tree.insertNode', (parentId, node) => {
        this.insertNode(parentId, node);
      });
      this.vueInstance.$on('tree.updateNode', (id, newInfo) => {
        this.updateNode(id, newInfo);
      });
      this.vueInstance.$on('tree.getParents', (id, cb) => {
        cb && cb(this.treeDataBaseInstance.getParents(id));
      });

      this.vueInstance.$emit('tree.listGroup');
    },
    destroyed() {
      this.vueInstance.$off('tree.listGroup');
      this.vueInstance.$off('tree.removeNode');
      this.vueInstance.$off('tree.insertNode');
      this.vueInstance.$off('tree.getParents');
    },
    methods: {
      _btnClick() {
        this.btnClick && this.btnClick(this.selectedNodeInfo);
      },
      _treeNodeCurrentChange(node) {
        this.selectedNodeInfo = node;
        const parentNode = this.treeDataBaseInstance.getNode(node.parentId);
        this.treeNodeCurrentChange && this.treeNodeCurrentChange(node, parentNode);
      },
      getMenu(node) {
        let array = [];

        if (!this.menus) {
          return array;
        }

        if (this.commandFieldName && typeof node[this.commandFieldName] !== 'undefined') {
          array = this.menus[node[this.commandFieldName]];
        } else {
          const keys = Object.keys(this.menus);

          if (keys.length > 0) {
            array = this.menus[keys[0]];
          }
        }

        return array;
      },
      renderItem(h, node) {
        const me = this;
        const menus = this.getMenu(node);

        return this.renderContent ? this.renderContent(h, node) : h(TreeNodeContent, {
          props: {
            node: node,
            menus: menus,
            width: this.menuWidth,
            execCommand(command) {
              // const parentNode = this.treeDataBaseInstance.getNode(node.parentId);

              // this.treeNodeCurrentChange && this.treeNodeCurrentChange(node, parentNode);
              me.execCommand && me.execCommand(command, node);
            }
          }
        });
      },
      loadChildren(node, resolve) {
        // this.selectedNodeInfo = node;
        this._listGroup(node[this.nodeKey], resolve);
      },
      _listGroup(parentId = '', resolve) {
        this.listGroup && this.listGroup(parentId, (data) => {
          this.insert(parentId, data);
          resolve && resolve();
        });
      },
      insert(parentId, data) {
        // 更新parentid下的所有节点
        this.treeDataBaseInstance.insert(parentId, data);
        this.treeData = this.treeDataBaseInstance.getTreeData();
      },
      insertNode(parentId, node) {
        // 向parentid插入节点
        this.treeDataBaseInstance.insertNode(parentId, node);
        this.treeData = this.treeDataBaseInstance.getTreeData();
      },
      updateNode(id, newInfo) {
        this.treeDataBaseInstance.update(id, newInfo);
        this.treeData = this.treeDataBaseInstance.getTreeData();
      },
      removeNode(id) {
        this.treeDataBaseInstance.remove(id);
        this.treeData = this.treeDataBaseInstance.getTreeData();
        if (this.selectedNodeInfo && this.selectedNodeInfo[this.nodeKey] === id) {
          this.selectedNodeInfo = {};
          this.treeNodeCurrentChange && this.treeNodeCurrentChange({}, {});
        }
      }
    },
    components: {
      TreeNodeContent,
      LayoutTwoRowTree
    }
  };
</script>
