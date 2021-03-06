<template>
  <fj-tree
    lazy
    :load="loadChildren"
    :default-expanded-key="defaultExpandedKey"
    v-if="!showUpper"
    :theme="theme"
    :data="treeData"
    :autoExpand="autoExpand"
    :node-key="nodeKey"
    :render-content="renderItem"
    @node-click="_treeNodeClick"
    @current-change="_treeNodeCurrentChange"
    @node-expand="_treeNodeExpand"
    @node-collapse="_treeNodeCollapse">
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
        :autoExpand="autoExpand"
        :node-key="nodeKey"
        :render-content="renderItem"
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
    composeData(parentId, d) {
      const arr = [];
      const indexKey = this.indexKey;

      for (let i = 0, len = d.length; i < len; i++) {
        arr.push({
          id: d[i][indexKey],
          name: d[i].name,
          info: d[i],
          children: d[i].children,
          parentId: parentId || `__root__${d[i][indexKey]}`
        });
      }
      return arr;
    },
    get(id) {
      if (this.td.length === 0) { return null; }
      const parentIndex = this.indexs[id];

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
      if (this.td.length === 0) {
        this.td = this.composeData(parentId, infos);
        this.indexs = {};

        for (let i = 0, len = infos.length; i < len; i++) {
          this.indexs[infos[i][this.indexKey]] = `${i}`;
        }

        return false;
      }

      const val = this.get(parentId);

      if (val) {
        const info = val.info;
        const parentIndex = val.parentIndex;
        const children = info.children || [];

        for (let i = 0, len = infos.length; i < len; i++) {
          this.indexs[infos[i][this.indexKey]] = `${parentIndex}-${i}`;
        }

        info.children = children.concat(this.composeData(parentId, infos));
      } else {
        const arr = this.composeData(parentId, infos);

        for (let i = 0, len = infos.length; i < len; i++) {
          this.indexs[infos[i][this.indexKey]] = `${i}`;
        }

        this.td = this.td.concat(arr);
      }

      return true;
    },
    updateIndexs(parentId) {
      const val = this.get(parentId);

      if (val) {
        const info = val.info;
        const parentIndex = val.parentIndex;
        const children = info.children || [];
        const infos = info.children || [];

        for (let i = 0, len = infos.length; i < len; i++) {
          this.indexs[infos[i].info[this.indexKey]] = `${parentIndex}-${i}`;
        }

      } else {
        for (let i = 0, len = this.td.length; i < len; i++) {
          this.indexs[this.td[i].info[this.indexKey]] = `${i}`;
        }
      }
    },
    removeChildren(id) {
      if (!id) {
        this.td = [];
        return false;
      }

      const me = this;
      const val = this.get(id);

      if (!val) {
        return false;
      }

      const indexKey = this.indexKey;

      const clear = function clear(childrenNode) {
        if (childrenNode && childrenNode.length > 0) {
          let temp = null;

          for (let i = 0, len = childrenNode.length; i < len; i++) {
            temp = childrenNode[i];

            if (temp.children && temp.children.length > 0) {
              clear(temp.children);
            } else {
              if (me.indexs[childrenNode[i][indexKey]]) {
                delete me.indexs[childrenNode[i][indexKey]];
              }
            }
          }
        }
      };

      clear(val.info.children);

      val.info.children = [];

      return val;
    },
    remove(id) {
      const val = this.removeChildren(id);
      if (!val) { return false; }
      // 移除本身
      const parentIndex = val.parentIndex;
      const indexs = parentIndex.split('-');
      let info = null;
      const tempTd = utils.deepClone(this.td);

      for (let i = 0, len = indexs.length; i < len; i++) {
        if (i === 0) {
          if (i === len - 1) {
            tempTd[indexs[i] * 1] = '--';
          } else {
            info = tempTd[indexs[i] * 1];
          }
        } else {
          if (i === len - 1) {
            info.children[indexs[i] * 1] = '--';
          } else {
            info = info.children ? info.children[indexs[i] * 1] : null;
          }
        }
      }

      let str = JSON.stringify({ key: tempTd });
      str = str.replace(',"--",', ',').replace(',"--"', '').replace('"--",', '').replace('"--"', '');
      this.td = JSON.parse(str).key;

      delete this.indexs[id];
      this.updateIndexs(val.info.parentId);
      return true;
    },
    reset() {
      this.td = [];
      this.indexs = {};
    },
    getTreeData() {
      return utils.deepClone(this.td);
    },
    getParentsId(nodeId) {
      const me = this;
      const rs = this.get(nodeId);
      const ids = [];

      if (rs) {
        const info = rs.info;
        let parentId = info.parentId;
        let firstLoop = true;
        let tempRs = null;

        if (parentId) {
          ids.push(parentId);
        } else {
          return ids;
        }

        while (firstLoop || parentId) {
          firstLoop = false;
          tempRs = me.get(parentId);

          if (tempRs) {
            parentId = tempRs.info.parentId;
            if (parentId) {
              ids.push(parentId);
            } else {
              return ids;
            }
          } else {
            break;
          }
        }
      }

      return ids;
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
      defaultTreeData: {
        type: Array,
        default() {
          return [];
        }
      },
      nodeKey: { type: String, default: 'id' },
      treeDataBaseKey: { type: String, default: '_id' },
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
      treeNodeExpand: { type: Function },
      treeNodeCollapse: { type: Function },
      btnClick: { type: Function },
      listGroup: { type: Function },
      renderContent: { type: Function },
      rootKey: { type: String, default: '' },
      theme: String,
      autoExpand: { type: Boolean, default: true },
      defaultExpandedKey: String
    },
    created() {
      const me = this;

      me.bubble.$on('tree.listGroup', () => {
        me._listGroup();
      });

      me.bubble.$on('tree.removeNode', (id) => {
        me.removeNode(id);
      });

      me.bubble.$on('tree.insertNode', (parentId, data) => {
        me.insertNode(parentId, data);
      });

      me.bubble.$on('tree.getParentsId', (parentId, cb) => {
        cb && cb(me.treeDataBaseInstance.getParentsId(parentId));
      });

      this.treeDataBaseInstance = new TreeDataBase(this.treeDataBaseKey, this.rootKey);

      if (this.defaultTreeData.length > 0) {
        this.insertNode('', this.defaultTreeData);
        this.selectedNodeInfo = this.treeData[0];
      }
      this.vueInstance.$emit('tree.listGroup');
    },
    destroyed() {
      const me = this;
      me.bubble.$off('tree.autoExpandFirstChild');
      me.bubble.$off('tree.listGroup');
      me.bubble.$off('tree.removeNode');
      me.bubble.$off('tree.insertNode');
      me.bubble.$off('tree.getParentsId');
    },
    methods: {
      loadChildren(node, resolve) {
        this.selectedNodeInfo = node;
        this._listGroup(resolve);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      /* tree */
      _treeNodeClick(node) {
      },
      _treeNodeCurrentChange(node) {
        const me = this;
        const rs = this.treeDataBaseInstance.get(node.parentId);
        const parentNode = rs ? rs.info : null;
        me.selectedNodeInfo = node;
        me.treeNodeCurrentChange && me.treeNodeCurrentChange(node, parentNode);
      },
      _treeNodeExpand(node) {
        // this.selectedNodeInfo = node;
        // this._listGroup();
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
          const keys = Object.keys(this.menus);

          if (keys.length > 0) {
            array = this.menus[keys[0]];
          }
        }

        return array;
      },
      renderItem(h, node) {
        const me = this;
        const menus = me.getMenu(node);

        return this.renderContent ? this.renderContent(h, node) : h(TreeNodeContent, {
          props: {
            node: node,
            menus: menus,
            width: me.menuWidth,
            execCommand(command) {
              const rs = me.treeDataBaseInstance.get(node.parentId);
              const parentNode = rs ? rs.info : null;

              me.treeNodeCurrentChange && me.treeNodeCurrentChange(node, parentNode);
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

      removeNode(id) {
        this.treeDataBaseInstance.remove(id);
        this.treeData = this.treeDataBaseInstance.getTreeData();
        if (this.selectedNodeInfo.id === id) {
          this.selectedNodeInfo = {};
        }
      },

      _listGroup(resolve) {
        const me = this;

        this.listGroup && this.listGroup(this.selectedNodeInfo, (data) => {
          if (me.selectedNodeInfo.id) {
            me.treeDataBaseInstance.removeChildren(me.selectedNodeInfo.id);
            me.insertNode(me.selectedNodeInfo.id, data);
          } else {
            me.treeDataBaseInstance.reset();
            me.insertNode('', data);
          }
          resolve && resolve();
        });
      }

    }
  };
</script>
