<template>
  <div
    :class="['media-browser-wrap', {'active-panel': activePanel === 'mediaBrowser'}]"
    @click="()=>{this.$emit('update:activePanel', 'mediaBrowser')}">
    <div class="media-browser-header clearfix">
      <h3 class="media-browser-title">素材库</h3>
      <div class="media-browser-controller-wrap">
        <div class="player-control-item-wrap">
          <div class="player-control-item" ref="showMenuBtn" :class="{'disabled-control-item': !isShowSourceMenu}" @click="mountDropdownMenu" v-clickoutside="handleCloseMenu">
            <i class="iconfont icon-more"></i>
          </div>
          <!-- <div class="player-control-tooltip"></div> -->
        </div>
        <div class="player-control-item-wrap">
          <div class="player-control-item" :class="{'disabled-control-item': !isFolderEditable}" @click="addFolderInput">
            <i class="iconfont icon-add-folder"></i>
          </div>
          <div class="player-control-tooltip">添加文件夹</div>
        </div>
        <div class="player-control-item-wrap">
          <div class="player-control-item" @click="showDeleteNodeDialog" :class="{'disabled-control-item': !isFolderDeletable}">
            <i class="iconfont icon-delete"></i>
          </div>
          <div class="player-control-tooltip">删除</div>
        </div>
      </div>
    </div>
    <div class="media-browser-content">
      <tree-view
        :theme="theme"
        :autoExpand="false"
        :showUpper="false"
        :default-expanded-key="defaultExpandedKey"
        :vue-instance="vueInstance"
        :list-group="listSourceItem"
        :renderContent="renderContent"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>

    <fj-dialog
      title="删除"
      :visible.sync="deleteNodeDialogVisible">

      <p class="dialog-content">您确定要删除{{ currentNodeInfo.name }}吗？</p>

      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="deleteNodeDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteNode">确定</fj-button>
      </div>

    </fj-dialog>
    <source-menu-dialog :visible.sync="sourceMenuDialogVisible" @addto-menu="changePath"></source-menu-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeNodeContent from './sourceTreeNode';
  import TreeView from '../../../component/higherOrder/tree/_index';
  import ivideoAPI from '../../../api/ivideo';
  import liveAPI from '../../../api/live';
  import mediaAPI from '../../../api/media';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import DropDownMenu from './dropdownMenu.vue';
  import SourceMenuDialog from './sourceMenuDialog';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import { getDayCountOfMonth, formatTime } from '../../../common/utils';
  import configurationAPI from '../../../api/configuration';

  const TYPE_CONFIG = {
    0: 'folder',
    2: 'folder',
    1: 'video',
    new: 'input'
  };
  const EDITABLE_OWNERTYPE_CONFIG = {
    1: false,
    2: false,
    3: true,
    4: true
  };
  const MOVEABLE_OWNERTYPE_CONFIG = {
    1: false,
    2: false,
    3: false,
    4: true
  };

  export default {
    props: {
      activePanel: String,
      theme: String
    },
    data() {
      const listRecordNodeFuncConfig = {
        'channel': this.getRecordYearList,
        'year': this.getRecordMonthList,
        'month': this.getRecordDateList,
        'date': this.getRecordProgramList
      };
      return {
        // _id: '',
        rootIds: {},
        currentNodeId: '',
        currentNodeInfo: {},
        deleteNodeDialogVisible: false,
        sourceMenuDialogVisible: false,
        isDeleteBtnLoading: false,
        command: '',
        defaultExpandedKey: '',
        recordChannel: [],
        listRecordNodeFuncConfig: listRecordNodeFuncConfig
      };
    },
    computed: {
      isFolderEditable() {
        return this.currentNodeId && (this.currentNodeInfo.ownerType !== '1' && this.currentNodeInfo.ownerType !== '2') && TYPE_CONFIG[this.currentNodeInfo.type] === 'folder';
      },
      isFolderDeletable() {
        const currentNodeInfo = this.currentNodeInfo;
        return this.currentNodeId && currentNodeInfo.type !== '2' && EDITABLE_OWNERTYPE_CONFIG[currentNodeInfo.ownerType];
      },
      isShowSourceMenu() {
        const currentNodeInfo = this.currentNodeInfo;
        return this.currentNodeId && currentNodeInfo.type !== '2';
      }
    },
    mounted() {
      this.isDark = this.theme === 'dark' ? true : false;
    },
    watch: {
      theme(val) {
        this.isDark = val === 'dark' ? true : false;
      }
    },
    methods: {
      changePath(data) {
        const reqData = data;
        reqData.srcIds = this.currentNodeId;
        reqData.srcOwnerType = this.currentNodeInfo.ownerType;
        if (this.command === 'move') {
          this.moveFile(reqData);
        } else {
          this.copyFile(reqData);
        }
      },
      moveFile(reqData) {
        const {srcOwnerType, destId, destOwnerType} = reqData;
        const oldParentId = this.currentNodeInfo.parentId;
        ivideoAPI.move(reqData)
          .then((response) => {
            this.vueInstance.$emit('tree.removeNode', this.currentNodeId);
            this.vueInstance.$emit('tree.listGroup', destId, { ownerType: destOwnerType });
            this.vueInstance.$emit('tree.listGroup', oldParentId, { ownerType: srcOwnerType });
            this.currentNodeId = '';
            this.currentNodeInfo = {};
            this.$message.success('移动成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      copyFile(reqData) {
        const {destId, destOwnerType} = reqData;
        const oldParentId = this.currentNodeInfo.parentId;
        ivideoAPI.copy(reqData)
          .then((response) => {
            this.vueInstance.$emit('tree.listGroup', destId, { ownerType: destOwnerType });
            this.currentNodeId = '';
            this.currentNodeInfo = {};
            this.$message.success('复制成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      mountDropdownMenu(e, files) {
        if (!this.isShowSourceMenu) return;
        this.dropdownMenu = new Vue(DropDownMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updateMenuPosition);
        this.updateMenuPosition();

        // 某些目录文件不可移动
        const ownerType = this.currentNodeInfo.ownerType;
        let menus = [];
        if (MOVEABLE_OWNERTYPE_CONFIG[ownerType]) {
          menus = [
            { command: 'move', key: 'move', name: '移动到'},
            { command: 'copy', key: 'copy', name: '复制到'},
          ];
        } else {
          menus = [
            { command: 'copy', key: 'copy', name: '复制到'},
          ];
        }

        this.dropdownMenu.menus = menus;
        this.dropdownMenu.isDark = this.isDark;
        this.dropdownMenu.$on('item-click', this.handleItemClick);
      },
      updateMenuPosition() {
        if (this.dropdownMenu) {
          const position = this.getDropdownMenu();
          this.dropdownMenu.menuStyle = {
            top: `${position.top + 30}px`,
            left: `${position.left - 43}px`,
            minWidth: '76px'
          };
        }
      },
      getDropdownMenu() {
        const btnPosition = getPosition(this.$refs.showMenuBtn);
        const position = { top: btnPosition.y, left: btnPosition.x };
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        position.top = position.top - parentElScrollTop;
        return position;
      },
      handleItemClick(item, command) {
        if (command === 'move') {
          const currentNodeInfo = this.currentNodeInfo;
          if (currentNodeInfo.type === '2' || !EDITABLE_OWNERTYPE_CONFIG[currentNodeInfo.ownerType]) {
            this.$message.error('存在不能移动的目录或文件夹');
            return;
          }
        }
        this.command = command;
        this.sourceMenuDialogVisible = true;
        this.unmountDropdownMenu();
      },
      handleCloseMenu(target) {
        if (this.dropdownMenu && this.dropdownMenu.$el.contains(target)) return;
        this.unmountDropdownMenu();
      },
      unmountDropdownMenu() {
        if (this.dropdownMenu) {
          document.body.removeChild(this.dropdownMenu.$el);
          const parentEl = this.parentEl || document.body;
          parentEl.removeEventListener('scroll', this.updateMenuPosition);
          this.dropdownMenu = null;
        }
      },
      treeNodeCurrentChange(node) {
        this.currentNodeId = node._id;
        this.currentNodeInfo = node;
      },
      showDeleteNodeDialog() {
        if (!this.isFolderDeletable) return;
        this.deleteNodeDialogVisible = true;
      },
      cancelCreate(node) {
        this.vueInstance.$emit('tree.removeNode', node._id);
      },
      handleDeleteNode() {
        this.isDeleteBtnLoading = true;
        ivideoAPI.removeItem({ id: this.currentNodeId, ownerType: this.currentNodeInfo.ownerType })
          .then((response) => {
            this.vueInstance.$emit('tree.removeNode', this.currentNodeId);
            this.currentNodeId = '';
            this.currentNodeInfo = {};
            this.$message.success('删除成功');
            this.deleteNodeDialogVisible = false;
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isDeleteBtnLoading = false;
          });
      },
      listSourceItem(id = '', cb, node) {
        const params = { parentId: id };
        if (node && node.ownerType) {
          params.ownerType = node.ownerType;
        }
        if (node && (node.name === '收录素材' || node.rootName === '收录素材')) {
          this.getRecordList(node).then(data => {
            cb && cb(data);
          });
          return;
        }
        ivideoAPI.listItem({ params: params }).then((res) => {
          const resData = res.data;
          const data = [];
          if (!id) {
            resData.sort((a, b)=> {
              return a.ownerType - b.ownerType;
            });
          }
          for (let i = 0; i < resData.length; i++) {
            const item = resData[i];
            // 2 默认目录
            if (item.type === '2') {
              this.rootIds[item.ownerType] = item._id;
              if (item.ownerType === '4') this.defaultExpandedKey = item._id;
              item.treeAlias = item.name;
            }
            if (TYPE_CONFIG[item.type] === 'folder') item.isFolder = true;
            // 如果是目录要排在前面
            if (TYPE_CONFIG[item.type] === 'folder' && item.type !== '2') {
              data.unshift(item);
            } else {
              data.push(item);
            }
          }
          cb && cb(data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      renderContent(h, node) {
        return h(TreeNodeContent, {
          props: {
            node: node,
            currentNodeId: this.currentNodeId
          },
          on: {
            createDirectory: this.createDirectory,
            updateDirectory: this.updateDirectory,
            cancelCreate: this.cancelCreate,
            updateCurrentSource: this.updateCurrentSource
          }
        });
      },
      updateCurrentSource(item) {
        this.$emit('updateCurrentSource', item);
      },
      createDirectory(reqData, removeNodeId) {
        ivideoAPI.createDirectory(reqData)
          .then((response) => {
            // const id = reqData.parentId === this._id ? '' : reqData.parentId;
            const id = reqData.parentId;
            this.vueInstance.$emit('tree.removeNode', removeNodeId);
            this.vueInstance.$emit('tree.listGroup', id, { ownerType: this.currentNodeInfo.ownerType });
            // this.$message.success('删除成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateDirectory(reqData) {
        ivideoAPI.updateItem(reqData)
          .then((response) => {
            this.vueInstance.$emit('tree.updateNode', reqData.id, { name: reqData.name });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      addFolderInput() {
        if (!this.isFolderEditable) return;
        const node = {
          _id: `new${new Date().getTime()}`,
          name: 'new',
          type: 'new',
          isFolder: true,
          ownerType: this.currentNodeInfo.ownerType,
          parentId: this.currentNodeId // this._id
        };
        this.vueInstance.$emit('tree.insertNode', this.currentNodeId, node);
      },
      getRecordList(parent) {
        if (this.recordChannel.length === 0) {
          return this.getRecordChannel();
        } else {
          return this.listRecordNodeFuncConfig[parent.recordNodeType](parent);
        }
      },
      getRecordChannel() {
        return configurationAPI.configurationDetail({ params: { groupName: 'record_config', key: 'start_record' } })
          .then((response) => {
            const resData = JSON.parse(response.data.value);
            this.recordChannel = resData;
            return resData.map((item) => {
              return {
                _id: item._id,
                name: item.channel,
                type: '0',
                isFolder: true,
                rootName: '收录素材',
                startDate: item.start,
                recordNodeType: 'channel',
                channel: item.channel,
                channelId: item._id
              }
            });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getRecordYearList(parent) {
        const { startDate, _id, channel } = parent;
        const data = [];
        const start = Number(startDate.split('-')[0]);
        const currYear = new Date().getFullYear();

        for (let i = currYear; i >= start; i--) {
          data.push(
          {
            _id: _id + i,
            name: `${i}年`,
            value: i,
            type: '0',
            isFolder: true,
            rootName: '收录素材',
            startDate: startDate,
            recordNodeType: 'year',
            channel: channel,
            channelId: _id,
            date: [i] // 记录年月日
          });
        }
        return Promise.resolve(data);
      },
      getRecordMonthList(parent) {
        const { startDate, value, channelId, _id, date, channel } = parent;
        const data = [];
        const startYear = Number(startDate.split('-')[0]);
        const currYear = new Date().getFullYear();
        let start = 1;
        let end = 12;

        if (Number(value) === startYear) {
          start = Number(startDate.split('-')[1]);
        }
        if (Number(value) === currYear) {
          end = new Date().getMonth() + 1;
        }
        for (let i = end; i >= start; i--) {
          const tempDate = JSON.parse(JSON.stringify(date));
          tempDate.push(i);

          data.push({
            _id: _id + i,
            name: `${i}月`,
            value: i,
            type: '0',
            isFolder: true,
            rootName: '收录素材',
            startDate: startDate,
            recordNodeType: 'month',
            channel: channel,
            channelId: channelId,
            date: tempDate
          });
        }
        return Promise.resolve(data);
      },
      getRecordDateList(parent) {
        const { startDate, value, channelId, _id, date, channel } = parent;
        const data = [];
        const startYear = Number(startDate.split('-')[0]);
        const startMonth = Number(startDate.split('-')[1]);
        const currYear = new Date().getFullYear();
        const currMonth = new Date().getMonth() + 1;
        const year = Number(date[0]);
        const month = Number(date[1]);
        let start = 1;
        let end = getDayCountOfMonth(year, month - 1);
        if (startYear === year && startMonth === month) {
          start = Number(startDate.split('-')[2]);
        }
        if (currYear === year && currMonth === month) {
          end = new Date().getDate();
        }
        for (let i = end; i >= start; i--) {
          const tempDate = JSON.parse(JSON.stringify(date));
          tempDate.push(i);

          data.push({
            _id: _id + i,
            name: `${i}日`,
            value: i,
            type: '0',
            isFolder: true,
            rootName: '收录素材',
            startDate: startDate,
            recordNodeType: 'date',
            channel: channel,
            channelId: channelId,
            date: tempDate
          });
        }

        return Promise.resolve(data);
      },
      getRecordProgramList(parent) {
        const [year, month, day] = parent.date;
        const reqData = {
          channel: parent.channelId,
          time: new Date(year, Number(month) - 1, day, 0, 0, 0),
          fieldsNeed: '_id,name,materialTime,objectId,fromWhere,inpoint,outpoint'
        };
        return liveAPI.listProgram({ params: reqData }).then((res) => {
          const resData = res.data.docs;
          return resData.map(item => {
            // duration 单位为帧
            const duration = item.outpoint - item.inpoint;
            return {
              _id: item._id,
              type: '1', // video
              name: `${formatTime(item.materialTime.from, 'HH:ss')} ${item.name}`,
              snippet: {
                duration: duration,
                objectId: item.objectId,
                fromWhere: item.fromWhere,
                input: item.inpoint,
                output: item.outpoint,
                thumb: mediaAPI.getIcon(item.objectId, item.fromWhere)
              }
            };
          })
        }).catch((error) => {
          this.$message.error(error);
        });
      }
    },
    created() {
      this.TYPE_CONFIG = TYPE_CONFIG;
      this.vueInstance = new Vue({
        name: 'mediaBrowser'
      });
    },
    beforDestroy() {
      if (this.dropdownMenu) {
        this.unmountDropdownMenu();
      }
    },
    directives: { Clickoutside },
    components: {
      TreeNodeContent,
      TreeView,
      SourceMenuDialog
    }
  };
</script>
