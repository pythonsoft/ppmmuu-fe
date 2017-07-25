<template>
  <layout-two-row-tree>
    <template slot="title">引擎分组</template>
    <template slot="button">
      <fj-button size="mini" @click="clickAddGroup">添加组</fj-button>
    </template>
    <div class="empty-line" v-if="treeData.length === 0">无分组数据</div>
    <template v-else slot="tree">
      <fj-tree
        :data="treeData"
        node-key="id"
        @node-click="treeNodeClick"
        @current-change="treeNodeCurrentChange"
        @node-expand="treeNodeExpand"
        @node-collapse="treeNodeCollapse">
      </fj-tree>
    </template>
  </layout-two-row-tree>
</template>
<script>
  import './index.css';
  import utils from '../../../common/utils';
  import layoutTwoRowTree from '../../../component/layout/twoRowTree/index';

  const api = require('../../../api/engine');

  const treeDataBase = (function (key) {
    let td = [];
    let indexs = {};
    const indexKey = key;

    const composeData = (d) => {
      let arr = null;

      for (let i = 0, len = d.length; i < len; i++) {
        if (!arr) { arr = []; }
        arr.push({ id: d[i][indexKey], name: d[i].name, info: d[i], children: d[i].children });
      }

      return arr;
    };

    return {
      get(parentId) {
        if (td.length === 0) { return null; }

        const parentIndex = indexs[parentId];

        if (!parentIndex) {
          return null;
        }

        const indexArray = parentIndex.split('-');

        let info = null;

        for (let i = 0, len = indexArray.length; i < len; i++) {
          if (i === 0) {
            info = td[indexArray[i] * 1];
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
          td = composeData(infos);
          indexs = {};

          for (let i = 0, len = infos.length; i < len; i++) {
            indexs[infos[i][indexKey]] = `${i}`;
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
          indexs[infos[i][indexKey]] = `${parentIndex}-${i}`;
        }

        info.children = composeData(infos);

        return true;
      },
      remove(parentId) {
        if (!parentId) {
          td = [];
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
          if (indexs[children[i][indexKey]]) {
            delete indexs[children[i][indexKey]];
          }
        }

        val.info.children = [];

        return true;
      },
      getTreeData() {
        return utils.deepClone(td);
      }
    };
  }('_id'));

  export default {
    name: 'treeView',
    components: {
      'layout-two-row-tree': layoutTwoRowTree
    },
    data() {
      return {
        id: '',
        treeData: [],
        items: {},
        selectedNodeInfo: {},
        bubble: this.vueInstance
      };
    },
    props: ['vueInstance'],
    created() {
      const me = this;
      me.listGroupAPI();

      me.bubble.$on('engine.addGroup.callback', () => {
        me.listGroupAPI();
      });

      me.bubble.$on('engine.getSelectedNodeInfo', () => {
        this.bubble.$emit('engine.getSelectedNodeInfo.callback', me.selectedNodeInfo);
      });
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },

      treeNodeClick(node) {
      },
      treeNodeCurrentChange(node) {
        const me = this;
        me.selectedNodeInfo = node;

        this.bubble.$emit('engine.setViewRouter', 'engineListView');
        this.bubble.$emit('engine.selectedNodeInfo', me.selectedNodeInfo);

        me.listGroupAPI();
      },
      treeNodeExpand(node) {},
      treeNodeCollapse(node) {},
      clickAddGroup() {
        const me = this;
        this.bubble.$emit('engine.addGroup', me.selectedNodeInfo);
      },

      listGroupAPI() {
        const me = this;

        const param = {
          parentId: me.selectedNodeInfo.id || '',
          page: 1,
          pageSize: 200,
          fields: '',
          isIncludeChild: '1'
        };

        api.listGroup({ params: param }).then((res) => {
          treeDataBase.insert(param.parentId, res.data.docs);
          me.treeData = treeDataBase.getTreeData();
        }).catch((error) => {
          me.showErrorInfo(error.message);
        });
      }
    }
  };
</script>
