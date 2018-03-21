<template>
  <div :style="{ width: '100%', height: '100%' }">
    <div class="copy-menu">
      <div class="copy-menu-btn">
        <fj-button type="primary" @click="createCopy"><i class="iconfont icon-edit"></i>写稿件</fj-button>
      </div>
      <ul class="copy-menu-list">
        <li v-for="group in MENU">
          <div class="copy-menu-group-title">
            <i
              :class="'tri-bottom'"></i>
            {{ group.title }}
          </div>
          <ul>
            <li
              class="copy-menu-item"
              :class="{ 'active': activeMenu === item.route }"
              v-for="item in group.children"
              @click="handleClickMenu(item.route)">
              {{ item.text }}
              <span class="copy-menu-count">{{ item.count }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="copy-list" ref="copyList">
      <div class="copy-search-wrap">
        <fj-select
          remote
          :parent-el="selectParentEl"
          :clear-history-method="clearHistory"
          :history-method="getSearchHistory"
          :remote-method="remoteMethod"
          :loading="loading"
          @search="searchClick"
          v-model="keyword"
          placeholder="请输入关键词检索"
          size="small"
          theme="fill">
          <fj-option
            v-for="item in keywordOptions"
            :key="item._id"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <tabs :menus="submitMenus" @tab-click="submitTabClick" v-if="activeMenu === 'sent'"></tabs>
      <ul>
        <li v-if="copyList.length === 0 && keyword" class="empty-box">未搜索到相关稿件</li>
        <li v-else-if="copyList.length === 0" class="empty-box">暂无稿件</li>
        <li v-else v-for="item in copyList" :class="['copy-item clearfix', {'active': item._id === activeCopyId}]" @click="activeCopyId = item._id">
          <i :class="['copy-item-icon iconfont', CREATETYPE_CONFIG[item.createType].icon]"></i>
          <div class="copy-item-content">
            <span class="copy-item-title">{{ item.title }}</span>
            <span class="copy-item-detail">{{ formatTime(item.modifyTime, 'YYYY-MM-DD HH:mm') }}</span>
            <span class="copy-item-detail" v-if="getItemAttachmentsLength(item) > 0"><i class="iconfont icon-attachment list-font-size copy-list-color"></i>
            <span class="attachment-number list-font-size copy-list-color">{{ getItemAttachmentsLength(item) + ',  ' + getProccess(item)}}</span></span>
            <span :class="['copy-item-detail', getSubmitStatus(item.status).class]" v-if="activeMenu === 'sent'">{{ getSubmitStatus(item.status).text }}</span>
            <span class="copy-item-words" v-if="item._id === activeCopyId">{{ `字数：${getWords(item.editContent)}` }}</span>
          </div>
        </li>
        <li class="load-list-button">
          <fj-button type="text" v-show="total > currentPage * pageSize" @click="currentPage += 1">{{ loadListBtnText }}</fj-button>
        </li>
      </ul>
    </div>
    <div class="copy-detail-wrap" ref="copyContent">
      <div class="copy-detail" v-if="activeCopyId">
        <div :class="[$style.toolbarWrap, 'clearfix']">
          <input id="file-input" accept="*" class="upload-file-input" @change="chooseFiles" type="file" multiple="multiple">
          <button :class="$style.toolbarBtn" v-show="activeMenu === 'drafts'" @click="updateCopy()"><i class="iconfont icon-save"></i>保存</button>
          <button
            :class="$style.toolbarBtn"
            v-show="activeMenu !== 'sent'"
            @click="deleteCopyDialogVisible = true">
            <i class="iconfont icon-trash"></i>删除
          </button>
          <button
            :class="$style.toolbarBtn"
            v-show="activeMenu === 'sent'"
            @click="createRepeatCopy"><i class="iconfont icon-copy"></i>复制</button>
          <button
            :class="$style.toolbarBtn"
            v-show="activeMenu === 'spam'"
            @click="handleRestoreCopy"><i class="iconfont icon-restore"></i>恢复</button>
          <span :class="$style.uploadBtn" v-show="activeMenu !== 'spam'" @click="fileInputClick()">附件<i class="iconfont icon-attachment"></i>
            <span class="attachment-number">{{ getAttachmentsLength()}}</span>
          </span>
          <div :class="$style.tagsGroupWrap" v-show="activeMenu === 'drafts'">
            <li :class="$style.tag" @click="handleConvert('0')">简</li>
            <li :class="$style.tag" @click="handleConvert('1')">繁</li>
          </div>
          <div :class="$style.tagsGroupWrap" v-show="activeMenu === 'drafts'">
            <template v-if="toolbarSize === 'normal'">
              <span :class="$style.tagsLabel">标签</span>
              <ul :class="$style.tagsGroup">
                <li v-for="tag in tags" :class="$style.tag" @click="insertTag(tag.label)">{{ tag.label }}</li>
              </ul>
            </template>
            <template v-else>
              <span :class="$style.tagsLabelSelect" @click="showTags = !showTags" ref="tagsLabel">
                标签
                <i :class="['iconfont icon-fill-bottom', $style.tagsLabelIcon, showTags ? $style.isReverse : '']"></i>
              </span>
              <div :class="$style.tagsPanel" v-show="showTags" v-clickoutside="closeTagsPanel">
                <ul>
                  <li v-for="tag in tags" :class="$style.tag" @click="insertTag(tag.label)">{{ tag.label }}</li>
                </ul>
              </div>
            </template>
          </div>
          <div :class="$style.submitBtn" v-show="activeMenu === 'drafts'">
            <fj-button type="primary" @click="handleSubmitClick()"><i class="iconfont icon-send"></i>提交</fj-button>
          </div>
          <div :class="$style.submitBtn" v-show="isShowResubmit()">
            <fj-button type="primary" @click="handleResubmitClick"><i class="iconfont icon-send"></i>再次提交</fj-button>
          </div>
        </div>
        <copy-editor
          :content.sync="copyContent"
          :mixedTableData.sync="mixedTableData"
          :copy.sync="copyContent"
          :tags="tags"
          :show-saved-text="showSavedText"
          :editor-width="contentWidth"
          :editor-height="contentHeight - 78"
          :editor-instance="editorInstance"
          @list-attachment="listAttachments"></copy-editor>
      </div>
      <div v-else class="empty-box">
        <i class="iconfont icon-empty-copy"></i>
        暂无稿件
      </div>
    </div>
    <fj-dialog
      title="删除"
      :visible.sync="deleteCopyDialogVisible">
      <p>{{ activeMenu === 'spam' ? '您确定要彻底删除稿件吗？此操作不可恢复！' : '您确定要删除稿件吗？'}}</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="deleteCopyDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteCopy">确定</fj-button>
      </div>
    </fj-dialog>
    <fj-dialog
            title="再次提交"
            :visible.sync="resubmitDialogVisible">
      <p>您确定要再次提交吗</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="resubmitDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isResubmitBtnLoading" @click.stop="resubmitCopy">确定</fj-button>
      </div>
    </fj-dialog>
    <config-dialog :dialog-visible.sync="copyConfigDialogVisible" @submit="handleSubmitCopy"></config-dialog>
  </div>
</template>
<script>
  import './index.css';
  import Vue from 'vue';
  import Tabs from '../../component/layout/tab';
  import CopyEditor from './component/copyEditor';
  import ConfigDialog from './component/copyConfigDialog';
  import manuscriptAPI from '../../api/manuscript';
  import Clickoutside from '../../component/fjUI/utils/clickoutside';
  import { formatTime, getItemFromLocalStorage, formatSize } from '../../common/utils';
  import { MENU, STATUS_CONFIG, CREATETYPE_CONFIG, getSubmitStatus, SUBMIT_MENUS } from './config';
  import throttle from '../../component/fjUI/utils/throttle';

  const fileClient = require('../../common/client');

  const FILE_SIZE_LIMIT = 20 * 1024 * 1024 * 1024; //限制上传文件大小,20G

  export default {
    data() {
      return {
        toolbarSize: 'normal',
        showTags: false,
        MENU: MENU,
        selectParentEl: null,
        activeMenu: '',
        loading: false,
        keyword: '',
        keywordOptions: [],
        currentPage: 1,
        pageSize: 30,
        total: 0,
        copyList: [],
        tags: [],
        loadListBtnText: '加载更多',
        activeCopyId: '',
        copyContent: {
          title: '',
          viceTitle: '',
          status: 1,
          editContent: [],
          collaborators: []
        },
        autoSave: false,
        showSavedText: false,
        deleteCopyDialogVisible: false,
        isDeleteBtnLoading: false,
        copyConfigDialogVisible: false,
        STATUS_CONFIG: STATUS_CONFIG,
        CREATETYPE_CONFIG: CREATETYPE_CONFIG,
        contentWidth: 0,
        contentHeight: 0,
        transferAttachments: {},
        oldListAttachments: {},
        mixedTableData: [],
        submitMenus: SUBMIT_MENUS,
        submitStatus: '',
        resubmitDialogVisible: false,
        isResubmitBtnLoading: false
      };
    },
    directives: { Clickoutside },
    created() {
      this.editorInstance = new Vue();
      this.activeMenu = this.$route.params.type;
      this.getSummary();
      this.getTagsConfig();
      this.watchTask();
    },
    mounted() {
      this.selectParentEl = this.$refs.copyList;
      this.resizeToolbar();
      window.addEventListener('resize', throttle(this.resizeToolbar));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.resizeToolbar));
    },
    watch: {
      '$route.params'(val) {
        this.activeMenu = val.type;
      },
      activeMenu(val) {
        this.copyList = [];
        this.activeCopyId = '';
        this.keyword = '';
        if (this.currentPage === 1) {
          this.updateList({ page: 1 });
        } else {
          this.currentPage = 1;
        }
        if (val === 'drafts') {
          this.autoSave = true;
          this.handleAutoSave();
        } else {
          this.autoSave = false;
        }
      },
      currentPage(val) {
        this.updateList();
      },
      activeCopyId(val) {
        if (val) {
          this.getCopy(val);
          const me = this;
          manuscriptAPI.listAttachments({ params: { manuscriptId: val } })
            .then((response) => {
              const attachments = me.transferAttachments[me.copyContent._id] ? me.transferAttachments[me.copyContent._id] : [];
              me.oldListAttachments[me.copyContent._id] = response.data.docs;
              me.mixedTableData = attachments.concat(response.data.docs);
            })
            .catch((error) => {
              this.$message.error(error);
            });
        }
      },
      copyContent(val) {
        let index = 0;
        for (let i = 0, len = this.copyList.length; i < len; i++) {
          if (this.copyList[i]._id === val._id) {
            index = i;
            break;
          }
        }
        this.copyList[index].title = val.title;
      }
    },
    methods: {
      getSubmitStatus,
      getWords(editContent) {
        let words = 0;
        editContent.forEach((item)=> {
          const matchedCharacter = item.content.match(/(\S)/g);
          words += matchedCharacter ? matchedCharacter.length : 0;
        });
        return words;
      },
      handleConvert(type) {
        const copyContent = this.copyContent;
        const data = {
          conversionType: type,
          title: copyContent.title,
          viceTitle: copyContent.viceTitle,
          content: JSON.stringify(copyContent.editContent)
        };
        console.log('copyContent', JSON.stringify(copyContent));
        manuscriptAPI.hongKongSimplified(data)
          .then((response) => {
            const resData = response.data;
            this.copyContent = Object.assign({}, this.copyContent, { title: resData.title, viceTitle: resData.viceTitle });
            this.editorInstance.$emit('updateContent', JSON.parse(resData.content));
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      insertTag(val) {
        this.editorInstance.$emit('insertTag', `【${val}】`);
      },
      createRepeatCopy() {
        const data = { _id: this.copyContent._id };
        data.status = STATUS_CONFIG['drafts'].code;
        manuscriptAPI.copy(data)
          .then((response) => {
            if (this.activeMenu === 'drafts') {
              this.copyList = [];
              this.activeCopyId = '';
              this.keyword = '';
              if (this.currentPage === 1) {
                this.updateList({ page: 1 });
              } else {
                this.currentPage = 1;
              }
            }
            this.$router.push({ name: 'copy', params: { type: 'drafts' } });
            this.getSummary();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      createCopy(data = {}) {
        if (!data.title) {
          data.title = `无标题稿件${formatTime(new Date())}`;
        }
        manuscriptAPI.addOrUpdateManuscript(data)
          .then((response) => {
            if (this.activeMenu === 'drafts') {
              this.copyList = [];
              this.activeCopyId = '';
              this.keyword = '';
              if (this.currentPage === 1) {
                this.updateList({ page: 1 });
              } else {
                this.currentPage = 1;
              }
            }
            this.$router.push({ name: 'copy', params: { type: 'drafts' } });
            this.getSummary();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      changeCopyStatus(data, successText = '保存成功', successFn = ()=>{}, failFn = ()=>{}) {
        const id = this.copyContent._id;
        manuscriptAPI.changeManuscriptStatus(data)
          .then((response) => {
            successFn && successFn();
            this.$message.success(successText);
            let index = 0;
            for (let i = 0, len = this.copyList.length; i < len; i++) {
              if (this.copyList[i]._id === id) {
                index = i;
                break;
              }
            }
            this.copyList.splice(index, 1);
            const defaultActiveCopyId = this.copyList.length > 0 ? this.copyList[0]._id : '';
            this.activeCopyId = (index + 1) > this.copyList.length ? defaultActiveCopyId : this.copyList[index]._id;
            this.getSummary();
          })
          .catch((error) => {
            failFn && failFn();
            this.$message.error(error);
          });
      },
      handleSubmitCopy(data) {
        this.updateCopy(() => {
          Object.assign(data, { _ids: this.copyContent._id, status: STATUS_CONFIG['sent'].code });
          this.changeCopyStatus(data, '提交成功', ()=> {
            this.copyConfigDialogVisible = false;
          });
        })
      },
      handleRestoreCopy() {
        this.changeCopyStatus({ status: STATUS_CONFIG['drafts'].code, _ids: this.copyContent._id }, '恢复成功');
      },
      handleDeleteCopy() {
        this.isDeleteBtnLoading = true;
        let status = STATUS_CONFIG['spam'].code;
        if (this.copyContent.status == STATUS_CONFIG['spam'].code) {
          status = STATUS_CONFIG['deleted'].code;
        }
        this.changeCopyStatus({ status: status, _ids: this.copyContent._id }, '删除成功', ()=> {
          this.isDeleteBtnLoading = false;
          this.deleteCopyDialogVisible = false;
        }, () => {
          this.isDeleteBtnLoading = false;
        });
      },
      handleAutoSave() {
        if (!this.autoSave) return;
        setTimeout(() => {
          if (this.copyContent._id) this.updateCopy(this.handleAutoSave);
        }, 30000);
      },
      updateCopy(cb = ()=>{}) {
        const data = Object.assign({}, this.copyContent);
        delete data.modifyTime;
        delete data.createdTime;
        manuscriptAPI.addOrUpdateManuscript(data)
          .then((response) => {
            this.showSavedText = true;
            setTimeout(()=> {
              this.showSavedText = false;
            }, 2000);
            cb && cb();
          })
          .catch((error) => {
            if (cb) {
              cb();
            } else {
              this.$message.error(error);
            }
          });
      },
      resizeToolbar() {
        if(!this.$refs.copyContent) return;
        const width = this.$refs.copyContent.getBoundingClientRect().width;
        const height = this.$refs.copyContent.getBoundingClientRect().height;
        this.contentWidth = width < 684 ? 684 : width;
        this.contentHeight = height;
        if (width < 920) {
          this.toolbarSize = 'small';
        } else {
          this.toolbarSize = 'normal';
        }
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickMenu(menu) {
        this.$router.push({ name: 'copy', params: { type: menu } });
      },
      getTagsConfig() {
        manuscriptAPI.getTagsConfig()
          .then((response) => {
            const data = response.data;
            this.tags = data[0].items;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getSummary() {
        manuscriptAPI.getSummary()
          .then((response) => {
            const data = response.data.summary;
            this.MENU[0].children.forEach((item) => {
              item.count = data[item.status].count;
            });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getCopy(id) {
        manuscriptAPI.getManuscript({ params: { _id: id } })
          .then((response) => {
            this.copyContent = response.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateList(query) {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        let action = manuscriptAPI.listManuscript;
        const data = {
          keyword: this.keyword,
          page: this.currentPage,
          pageSize: this.pageSize,
          status: STATUS_CONFIG[this.activeMenu].code
        };
        if(this.activeMenu === 'sent'){
          delete data.status;
          action = manuscriptAPI.listSubmitScript;
        }
        Object.assign(data, query);
        action({ params: data })
          .then((response) => {
            this.loadListBtnText = '加载更多';
            const data = response.data;
            this.copyList = this.copyList.concat(data.docs);
            if (!this.activeCopyId && this.copyList.length > 0) {
              this.activeCopyId = this.copyList[0]._id;
            }
            this.total = data.total;
            this.currentPage = data.page;
          })
          .catch((error) => {
            this.loadListBtnText = '加载更多';
            this.$message.error(error);
          });
      },
      clearHistory() {
        manuscriptAPI.clearSearchHistory()
          .then((response) => {
            this.getSearchHistory();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getSearchHistory() {
        this.loading = true;
        manuscriptAPI.getSearchHistory().then((res) => {
          this.loading = false;
          const data = res.data;
          this.keywordOptions = res.data.map((item) => {
            item.value = item.keyword;
            item.label = item.keyword;
            return item;
          });
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);
        });
      },
      remoteMethod() {},
      searchClick() {
        this.copyList = [];
        this.activeCopyId = '';
        if (this.currentPage === 1) {
          this.updateList();
        } else {
          this.currentPage = 1;
        }
      },
      closeTagsPanel(target) {
        if (this.$refs.tagsLabel.contains(target)) return;
        if (this.showTags) {
          this.showTags = false;
        }
      },
      fileInputClick() {
        let inputFileEl =  document.getElementById('file-input');
        inputFileEl.click();
      },
      chooseFiles(event) {
        const files = event.target.files;
        const attachments = this.transferAttachments[this.copyContent._id] ? this.transferAttachments[this.copyContent._id] : [];
        let totalSize = 0;
        for (let i = 0, len = files.length; i < len; i++) {
          totalSize += files[i].size;
        }
        if(totalSize >= FILE_SIZE_LIMIT){
          this.$message.error(`正在传输的文件总大小限制为${formatSize(FILE_SIZE_LIMIT)}`);
          return;
        }
        for (let i = 0, len = files.length; i < len; i++) {
          const task = new fileClient({
            file: files[i],
            userId: getItemFromLocalStorage('userInfo')._id,
            userName: getItemFromLocalStorage('userInfo').name,
            ticket: getItemFromLocalStorage('token'),
            vueInstance: this
          });
          task.transfer();
          attachments.push(task);
        }
        this.transferAttachments[this.copyContent._id] = attachments;
      },
      listAttachments(row){
        const me = this;
        if(row.getFileInfo){
          row.destroy();
          const attachments = me.transferAttachments[me.copyContent._id] ? me.transferAttachments[me.copyContent._id] : [];
          const index = attachments.indexOf(row);
          if(index !== -1) {
            attachments.splice(index, 1);
          }
        } else{
          for (let i = me.copyContent.attachments.length - 1; i >= 0; i--) {
            if (me.copyContent.attachments[i].attachmentId === row._id) {
              me.copyContent.attachments.splice(i, 1);
              break;
            }
          }
        }
        manuscriptAPI.listAttachments({ params: { manuscriptId: me.copyContent._id } })
          .then((response) => {
            const newAttach = response.data.docs;
            const attachments = me.transferAttachments[me.copyContent._id] ? me.transferAttachments[me.copyContent._id] : [];
            me.oldListAttachments[me.copyContent._id] = newAttach;
            me.mixedTableData = attachments.concat(newAttach);

            for(let i = 0, len = me.copyList.length; i < len; i++){
              if(me.copyList[i]._id === me.copyContent._id){
                me.copyList[i].attachments = newAttach;
                break;
              }
            }
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      getAttachmentsLength() {
        const attachments = this.copyContent.attachments;
        if(attachments && attachments.length){
          return attachments.length;
        }
        return '';
      },
      watchTask(){
        const me = this;
        setInterval(()=>{
          const attachments = me.transferAttachments[me.copyContent._id] ? me.transferAttachments[me.copyContent._id] : [];
          if(attachments && attachments.length){
            let flag = false;
            for(let i = attachments.length -1 ; i >= 0; i--){
              const task = attachments[i];
              if(task.status === 'complete'){
                const item = {
                  attachmentId: task.getId(),
                  userId: getItemFromLocalStorage('userInfo')._id,
                  name: task.getFileInfo().name,
                }
                if(!me.copyContent.attachments) {
                  me.copyContent.attachments = [];
                }
                me.copyContent.attachments.push(item);
                task.destroy();
                flag = true;
                attachments.splice(i, 1);
              }
            }
            if(flag) {
              me.updateCopy(() => {
                manuscriptAPI.listAttachments({ params: { manuscriptId: me.copyContent._id } })
                  .then((response) => {
                    const newAttach = response.data.docs;
                    me.oldListAttachments[me.copyContent._id] = newAttach;
                    me.mixedTableData = attachments.concat(newAttach);

                    for(let i = 0, len = me.copyList.length; i < len; i++){
                      if(me.copyList[i]._id === me.copyContent._id){
                        me.copyList[i].attachments = newAttach;
                        break;
                      }
                    }
                  })
                  .catch((error) => {
                    me.$message.error(error);
                  });
              });
            }else{
              me.mixedTableData = attachments.concat(me.oldListAttachments[me.copyContent._id]);
            }
            me.transferAttachments[me.copyContent._id] = attachments;
          }
        }, 100);     //100ms更新一次进度
      },
      submitTabClick(index) {
        this.copyList = [];
        for(let i = 0, len = this.submitMenus.length; i < len; i++){
          this.submitMenus[i].active = false;
        }
        this.submitMenus[index].active = true;
        let status = this.submitMenus[index].key;
        this.submitStatus = status;

        if(status === 'all'){
          status = '';
        }
        this.updateList({status: status})
      },
      isShowResubmit(){
        if(this.activeCopyId) {
          let activeItem = {};
          for(let i = 0, len = this.copyList.length; i < len; i++){
            const item = this.copyList[i];
            if(item._id === this.activeCopyId){
              activeItem = item;
              break;
            }
          }
          return this.activeMenu === 'sent' && activeItem.status == '3';
        }
        return false;
      },
      handleSubmitClick(){
        this.copyConfigDialogVisible = true
      },
      handleResubmitClick(){
        this.resubmitDialogVisible = true
      },
      resubmitCopy(){
        const id = this.copyContent._id;
        this.isResubmitBtnLoading = true
        manuscriptAPI.resubmitScript({_id: id})
            .then((response) => {
              this.$message.success('再次提交成功!');
              this.isResubmitBtnLoading = false;
              this.resubmitDialogVisible = false;
              this.copyList = [];
              this.updateList({status: this.submitStatus})
            })
            .catch((error) => {
              this.isResubmitBtnLoading = false;
              this.$message.error(error);
            });
      },
      getItemAttachmentsLength(item){
        let len = item.attachments.length;
        if(this.transferAttachments[item._id]){
          len += this.transferAttachments[item._id].length;
        }
        return len;
      },
      getFileProgress(row) {
        if(row.showProcess){
          return row.showProcess();
        }else{
          return row.progress;
        }
      },
      getProccess(item){
        let totalProcess = 0;
        const attachments = item.attachments;
        const transferAttachments = this.transferAttachments[item._id] ? this.transferAttachments[item._id] : [];
        const totalLen = attachments.length + transferAttachments.length;
        attachments.forEach((item)=>{
          totalProcess += 100;
        })
        transferAttachments.forEach((item)=>{
          totalProcess += this.getFileProgress(item) * 1;
        })
        if(totalLen){
          return parseInt(totalProcess / totalLen) + '%';
        }else{
          return '';
        }
      },
      formatTime
    },
    components: {
      CopyEditor,
      ConfigDialog,
      Tabs
    }
  };
</script>
<style module>
  @import './copy.css';
</style>
