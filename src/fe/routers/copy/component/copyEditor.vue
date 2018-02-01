<template>
  <div :class="$style.editorWrap">
    <div ref="editorHeader">
      <div :class="$style.title">
        <div :class="$style.editorInputWrap">
          <input
            type="text"
            :class="$style.editorInput"
            placeholder="标题"
            v-model="title"
            @input="handleTitleChange"
            :readonly="!editable"
            ref="titleInput">
        </div>
        <transition name="fade" duration="600">
          <span :class="$style.savedText" v-show="showSavedText">已保存</span>
        </transition>
        <span :class="$style.words">字数：{{ words }}</span>
      </div>
      <div :class="$style.title">
        <div :class="$style.subTitleInputWrap">
          <input
            type="text"
            :class="$style.editorInput"
            placeholder="副标题"
            v-model="viceTitle"
            @input="handleViceTitleChange"
            :readonly="!editable">
        </div>
      </div>
      <div :class="[$style.collaborator, 'clearfix']">
        <div :class="$style.collaboratorInputWrap">
          <span v-if="collaborators.length === 0" :class="$style.placeholder">协作人员</span>
          <div v-else>
            <span>协作人员：</span>
            <fj-tag
              v-for="item in collaborators"
              :key="item._id"
              :closable="editable"
              @close="deleteCollaborator(item)"
              type="primary">{{ item.name }}</fj-tag>
          </div>
        </div>
        <span :class="$style.addCollaboratorBtn" v-if="editable">
          添加协作人员
          <i :class="['iconfont icon-addto', $style.iconAdd]" @click="departmentBrowserVisible = true"></i>
        </span>
      </div>
    </div>
    <div :class="$style.editorMainWrap" :style="{ height: `${height}px` }">
      <panel-view
        :parentSize="{ width: width - 80, height: height }"
        :canResize="true"
        :panels="panelsRule"
        direction="y">
          <template slot="0">
            <div :class="$style.editor">
              <quill-editor
                v-model="selfContent"
                :editable="editable"
                :editor-instance="editorInstance"></quill-editor>
            </div>
          </template>
          <template slot="1">
            <div :class="$style.attachmentWrap">
              <h3>
                <i class="iconfont icon-attachment"></i>
                附件{{ mixedRows.length }}
              </h3>
              <div :class="$style.attachmentTable">
                <fj-table :data="mixedRows">
                  <fj-table-column prop="name" label="文件名">
                    <template slot-scope="props">
                      {{ getFileName(props.row) }}
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="progress" label="文件进度">
                    <template slot-scope="props">
                      {{ `${getFileProgress(props.row)}%` }}
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="speed" label="传输速度">
                    <template slot-scope="props">
                      {{ `${getFileSpeed(props.row)}` }}
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="fileInfo" label="文件大小">
                    <template slot-scope="props">
                      {{ getFileSize(props.row) }}
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="_id" label="操作">
                    <template slot-scope="props">
                      <i :class="['iconfont icon-trash', $style.operatorBtn]" @click="deleteAttachment(props.row)"></i>
                      <i :class="['iconfont icon-play', $style.operatorBtn]" v-if="canRestart(props.row)" @click="restartTask(props.row)"></i>
                      <i :class="['iconfont icon-pause', $style.operatorBtn]" v-if="canStop(props.row)" @click="stopTask(props.row)"></i>
                    </template>
                  </fj-table-column>
                </fj-table>
              </div>
            </div>
          </template>
      </panel-view>
    </div>
    <department-browser
      :visible.sync="departmentBrowserVisible"
      @confirm="departmentBrowserConfirm"
    ></department-browser>
  </div>
</template>
<script>
  import PanelView from "../../../component/layout/panel/index.vue";
  import DepartmentBrowser from "../../../component/higherOrder/departmentBrowser";
  import QuillEditor from './quillEditor';
  import { formatSize } from "../../../common/utils";
  import manuscriptAPI from '../../../api/manuscript';

  const STATUS_CONFIG = {
    1: { type: 'drafts' },
    2: { type: 'sent' },
    3: { type: 'spam' }
  };

  export default {
    props: {
      copy: {},
      editorInstance: {},
      editorWidth: Number,
      editorHeight: Number,
      showSavedText: Boolean,
      mixedTableData: Array,
      tags: Array
    },
    data() {
      return {
        _id: '',
        title: '',
        viceTitle: '',
        words: 0,
        editable: false,
        departmentBrowserVisible: false,
        status: 1,
        collaborators: [],
        mixedRows: [],
        selfContent: '',
        width: this.editorWidth,
        height: this.editorHeight,
        tagsMap: {},
        labelsMap: {},
        labels: []
      };
    },
    created() {
      this.updateTags();
      this.editorInstance.$on('updateContent', this.updateSelfContent);
    },
    mounted() {
      const headerHeight = this.$refs.editorHeader.getBoundingClientRect().height;
      this.height = this.editorHeight - headerHeight;
    },
    computed: {
      panelsRule() {
        return this.mixedRows.length > 0 ? '#/3*2, #/3' : '#, 0';
      }
    },
    watch: {
      editorWidth(val) {
        this.width = val;
      },
      tags(val) {
        this.updateTags();
      },
      copy(val) {
        this.title = val.title;
        this.viceTitle = val.viceTitle;
        this.collaborators = val.collaborators;
        this.status = val.status;
        this.editable = STATUS_CONFIG[val.status].type === 'drafts';
        if (this.editable && val._id !== this._id) {
          // this.$refs.titleInput.focus();
        }
        if (val.editContent && val.editContent.length > 0) {
          let words = 0;
          let content = '';
          val.editContent.forEach((item)=> {
            const matchedCharacter = item.content.match(/(\S)/g);
            words += matchedCharacter ? matchedCharacter.length : 0;
            content += `${this.tagsMap[item.tag]}${item.content}`;
          });
          this.words = words;
          if (val._id !== this._id) {
            this.selfContent = content;
          }
        } else {
          this.words = 0;
        }
        this._id = val._id;
      },
      mixedTableData(val) {
        this.mixedRows = val ? val : [];
      },
      selfContent(val) {
        let selfContent = val;
        const content = [];
        const reg = /【([^【]+)】/g;
        const matchedLabels = selfContent.match(reg) || [];
        let withoutTagContent = '';
        if (matchedLabels.length === 0) {
          withoutTagContent = selfContent;
        }
        for (let i = 0, len = matchedLabels.length; i < len; i++) {
          const label = matchedLabels[i];
          if (this.labels.indexOf(label) > -1) {
            // 在配置的标签内容前有别的内容
            if (content.length === 0 && selfContent.indexOf(label) !== 0) {
              withoutTagContent = withoutTagContent + selfContent.slice(0, selfContent.indexOf(label));
            }
            const contentItem = { tag: this.labelsMap[label] };
            const index = selfContent.indexOf(label) + label.length;
            let endIndex = index;
            if (i === len - 1) {
              endIndex = selfContent.length;
            } else {
              let nextLabelIndex = selfContent.indexOf(matchedLabels[i + 1]);
              if (nextLabelIndex + label.length === index) {
                const arr = selfContent.split(matchedLabels[i + 1]);
                endIndex = index + arr[1].length;
              } else {
                endIndex = nextLabelIndex;
              }
            }
            contentItem.content = selfContent.slice(index, endIndex);
            selfContent = selfContent.slice(index);
            content.push(contentItem);
          }
        }
        if (withoutTagContent.length > 0) {
          content.unshift({ tag: '7', content: withoutTagContent });
        }
        console.log('content', content);
        this.updateContent({ editContent: content });
      }
    },
    methods: {
      formatSize,
      updateSelfContent(editContent) {
        let words = 0;
        let content = '';
        editContent.forEach((item)=> {
          words += item.content.length;
          if (item.tag === '7') {
            content = content + `${item.content}`;
          } else {
            content = content + `${this.tagsMap[item.tag]}${item.content}`;
          }
        });
        this.words = words;
        this.selfContent = content;
      },
      updateTags() {
        const tagsObj = {};
        const labelsObj = {};
        const labels = [];
        this.tags.forEach((tag)=> {
          tagsObj[tag.value] = `【${tag.label}】`;
          labelsObj[`【${tag.label}】`] = tag.value;
          labels.push(`【${tag.label}】`);
        });
        this.tagsMap = tagsObj;
        this.labelsMap = labelsObj;
        this.labels = labels;
      },
      departmentBrowserConfirm(items) {
        const collaboratorIds = this.collaborators.map((item) => {
          return item._id;
        });
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (collaboratorIds.indexOf(item._id) < 0) {
            this.collaborators.push({ _id: item._id, name: item.name });
          }
        }
        this.updateContent({ collaborators: this.collaborators });
      },
      deleteCollaborator(item) {
        const index = this.collaborators.indexOf(item);
        this.collaborators.splice(index, 1);
        this.updateContent({ collaborators: this.collaborators });
      },
      handleTitleChange(e) {
        const value = e.target.value;
        this.updateContent({ title: value });
      },
      handleViceTitleChange(e) {
        const value = e.target.value;
        this.updateContent({ viceTitle: value });
      },
      updateContent(data) {
        this.$emit('update:content', Object.assign({}, this.copy, data));
      },
      getFileName(row) {
        if(row.getFileInfo){
          return row.getFileInfo().name;
        }else{
          return row.name;
        }
      },
      getFileProgress(row) {
        if(row.showProcess){
          return row.showProcess();
        }else{
          return row.progress;
        }
      },
      getFileSpeed(row) {
        if(row.getSpeed){
          return row.getSpeed();
        }else{
          return row.speed || '';
        }
      },
      getFileSize(row) {
        if(row.getFileInfo){
          return formatSize(row.getFileInfo().size);
        }else{
          return formatSize(row.fileInfo.size);
        }
      },
      deleteAttachment(row) {
        const me = this;
        const _id = row._id ? row._id : row.getId();
        manuscriptAPI.deleteAttachments({ _ids: _id}, me)
          .then((res)=>{
            this.$emit('list-attachment', row);
          })
          .catch((error)=>{
            this.$message.error(error);
          })
      },
      canStop(row){
        if(row.getFileInfo){
          return row.canStop();
        }
        return false;
      },
      canRestart(row){
        if(row.getFileInfo){
          return row.canRestart();
        }
        return false;
      },
      stopTask(row){
        if(row.getFileInfo){
          row.stopTask();
        }
      },
      restartTask(row){
        if(row.getFileInfo){
          row.restart();
        }
      }
    },
    components: {
      DepartmentBrowser,
      PanelView,
      QuillEditor
    }
  };
</script>
<style module>
  @import './copyEditor.css';
</style>
