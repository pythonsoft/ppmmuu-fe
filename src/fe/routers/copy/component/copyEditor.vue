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
            <div id="editor" :class="$style.editor"></div>
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
                      {{ getFileProgress(props.row) }}
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="fileInfo" label="文件大小">
                    <template slot-scope="props">
                      {{ getFileSize(props.row) }}
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
  import Quill from 'quill/core';
  import Snow from 'quill/themes/snow';
  import Toolbar from 'quill/modules/toolbar';
  import PanelView from "../../../component/layout/panel/index.vue";
  import DepartmentBrowser from "../../../component/higherOrder/departmentBrowser";
  import { formatSize } from "../../../common/utils";
  import manuscriptAPI from '../../../api/manuscript';

  const STATUS_CONFIG = {
    1: { type: 'drafts' },
    2: { type: 'sent' },
    3: { type: 'spam' }
  };

  Quill.register({
    'themes/snow': Snow,
    'modules/toolbar': Toolbar
  });

  export default {
    props: {
      content: {},
      editorWidth: Number,
      editorHeight: Number,
      showSavedText: Boolean,
      mixedTableData: Array
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
        width: this.editorWidth,
        height: this.editorHeight
      };
    },
    mounted() {
      const headerHeight = this.$refs.editorHeader.getBoundingClientRect().height;
      this.height = this.editorHeight - headerHeight;
      this.quill = new Quill('#editor', {
        modules: { toolbar: false },
        theme: 'snow'
      });
    },
    computed: {
      panelsRule() {
        return this.mixedRows.length > 0 ? '#/3*2, #/3' : '#, 0';
      }
    },
    watch: {
      content(val) {
        this.title = val.title;
        this.viceTitle = val.viceTitle;
        this.collaborators = val.collaborators;
        this.status = val.status;
        this.editable = STATUS_CONFIG[val.status].type === 'drafts';
        if (this.editable && val._id !== this._id) {
          // this.$refs.titleInput.focus();
        }
        this._id = val._id;
        if (val.editContent && val.editContent.length > 0) {
          let words = 0;
          val.editContent.forEach((item)=> {
            words += item.content.length;
          });
          this.words = words;
        } else {
          this.words = 0;
        }
      },
      mixedTableData(val) {
        console.log("val length===>", val.length)
        this.mixedRows = val ? val : [];
      }
    },
    methods: {
      formatSize,
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
        this.$emit('update:content', Object.assign({}, this.content, data));
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
      getFileSize(row) {
        if(row.getFileInfo){
          return formatSize(row.getFileInfo().size);
        }else{
          return formatSize(row.fileInfo.size);
        }
      }
    },
    components: {
      DepartmentBrowser,
      PanelView
    }
  };
</script>
<style module>
  .editorWrap {
    padding: 0 40px;
  }
  .title {
    position: relative;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #EBF3FB;
  }
  .collaborator {
    position: relative;
    line-height: 40px;
    border-bottom: 1px solid #EBF3FB;
  }
  .collaboratorInputWrap {
    float: left;
  }
  .savedText,
  .words {
    position: absolute;
    top: 0;
    height: 100%;
    color: #4C637B;
  }
  .words {
    right: 0;
    width: 80px;
    text-align: right;
  }
  .savedText {
    right: 80px;
    width: 40px;
    text-align: center;
  }
  .addCollaboratorBtn {
    float: right;
    /*position: absolute;
    top: 0;
    right: 0;*/
    width: 110px;
    /*height: 100%;*/
    color: #4C637B;
    text-align: right;
    cursor: default;
  }
  .addCollaboratorBtn .iconAdd {
    display: inline-block;
    width: 26px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
    color: #4C637B;
    background: #EBF3FB;
    text-align: center;
    border-radius: 4px;
    margin-left: 6px;
  }
  .addCollaboratorBtn .iconAdd:hover {
    color: #38B1EB;
  }
  .editorInputWrap,
  .subTitleInputWrap {
    position: absolute;
    top: 0;
    right: 140px;
    bottom: 0;
    left: 0;
  }
  .subTitleInputWrap {
    right: 0;
  }
  .collaboratorInputWrap {
    right: 130px;
  }
  .editorInput {
    width: 100%;
    font-size: 12px;
    background-color: transparent;
    border: 0;
    outline: none;
  }
  .editorInputWrap .editorInput {
    font-weight: bold;
    font-size: 14px;
  }
  .editorInput::placeholder,
  .placeholder {
    color: #9FB3CA;
  }
  .editorMainWrap {
    position: relative;
    padding: 0 40px;
  }
  .attachmentWrap {
    padding: 20px 0;
  }
  .attachmentWrap h3 {
    font-size: 12px;
    color: #4C637B;
  }
  .attachmentWrap h3 .iconfont {
    display: inline-block;
    margin-right: 7px;
    color: #9FB3CA;
  }
  .attachmentTable {
    margin-top: 12px;
    border: 1px solid #CDD9E5;
    border-radius: 2px;
  }
  .editor {
    width: 100%;
    height: 100%;
  }
</style>
