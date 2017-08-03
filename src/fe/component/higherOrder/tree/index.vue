<template>
  <layout-two-row-tree class="ho-tree-layout" :showUpper="showUpper">
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
    composeData(parentId, d) {
      let arr = [];
      const indexKey = this.indexKey;

      for (let i = 0, len = d.length; i < len; i++) {
        if (!arr) { arr = []; }
        arr.push({ id: d[i][indexKey], name: d[i].name, info: d[i], children: d[i].children, parentId: parentId || '' });
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
      if (!parentId) {
        this.td = this.composeData(parentId, infos);
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

      this.removeChildren(parentId);

      for (let i = 0, len = infos.length; i < len; i++) {
        this.indexs[infos[i][this.indexKey]] = `${parentIndex}-${i}`;
      }

      info.children = this.composeData(parentId, infos);

      return true;
    },
    removeChildren(id) {
      if (!id) {
        this.td = [];
        return false;
      }

      const val = this.get(id);

      if (!val) {
        return false;
      }

      const children = val.info.children;

      if (children && children.length > 0) {
        for (let i = 0, len = children.length; i < len; i++) {
          if (this.indexs[children[i][this.indexKey]]) {
            delete this.indexs[children[i][this.indexKey]];
          }
        }
      }

      val.info.children = [];

      return val;
    },
    remove(id) {
      const val = this.removeChildren(id);
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

      return true;
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
      listGroup: { type: Function }
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

      this.treeDataBaseInstance = new TreeDataBase(this.treeDataBaseKey);

      me.vueInstance.$emit('tree.listGroup');
    },
    destroyed() {
      const me = this;
      me.bubble.$off('tree.listGroup');
      me.bubble.$off('tree.removeNode');
      me.bubble.$off('tree.insertNode');
      me.bubble.$off('tree.getParentsId');
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },

      /* tree */
      _treeNodeClick(node) {
      //        this.treeNodeClick && this.treeNodeClick(node);
      },
      _treeNodeCurrentChange(node) {
        const me = this;
        const rs = this.treeDataBaseInstance.get(node.parentId);
        const parentNode = rs ? rs.info : null;

        me.selectedNodeInfo = node;
        me._listGroup();
        me.treeNodeCurrentChange && me.treeNodeCurrentChange(node, parentNode);
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
          const keys = Object.keys(this.menus);

          if (keys.length > 0) {
            array = this.menus[keys[0]];
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
      //        this.selectedNodeInfo = {};
      },

      _listGroup() {
        const me = this;

        this.listGroup && this.listGroup(this.selectedNodeInfo, (data) => {
          me.insertNode(me.selectedNodeInfo.id || '', data);
        });
      }

    }
  };
</script>
