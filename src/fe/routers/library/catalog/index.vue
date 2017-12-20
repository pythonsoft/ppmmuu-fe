<template>
  <div>
    <div class="topBar">
      <span class="returnBtn" @click="back">
        <i class="iconfont icon-arrow-left"></i>
        返回
      </span>
    </div>
    <div class="mainBox">
      <div class="operator-bar">
        <div class="operation-btn-group">
          <fj-button :loading="isSubmitBtnLoading" size="mini" type="primary" @click="submitCatalogTask">提交</fj-button>
        </div><!--
        --><div class="operation-btn-group">
          <fj-button size="mini" type="primary" @click="showEditStatusDialog('deleteTask')">删除</fj-button><!--
          --><fj-button size="mini" type="primary" @click="showEditStatusDialog('sendBackTask')">退回</fj-button>
        </div>
      </div>
      <div class="clearfix catalogContent" ref="catalogContent">
        <panel-view
          :parentSize="size"
          panels="#/2,#-p0"
          direction="x"
        >
          <template slot="0" scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/5*3,#-p0"
              direction="y"
              name="child1"
            >
              <template slot="0" scope="props">
                <video-source-panel
                  :title="sourceTitle"
                  :videoId="sourceVideoId"
                  :videoSnippet="sourceSnippet"
                  :size="{ width: props.width, height: props.height }"
                  @insert="importSource"></video-source-panel>
              </template>
              <template slot="1" scope="props">
                <div :style="{ width: '100%', height: '100%', overflow: 'auto' }">
                  <fj-tree
                    :data="catalogList"
                    node-key="_id"
                    @node-click="handleClickCatalogItem"
                    @current-change=""></fj-tree>
                </div>
              </template>
            </panel-view>
          </template>
          <template slot="1" scope="props">
            <div :style="{ width: '100%', height: '100%', overflow: 'auto', position: 'absolute' }" ref="rightContent">
              <div class="catalogRightContent" v-if="currentCatalogId">
                <h3>填写编目内容</h3>
                <fj-form :model="formData" :rules="rules" ref="catalogForm" label-width="100px">
                  <fj-form-item label="名称(中文)" prop="chineseName">
                    <fj-input v-model="formData.chineseName"></fj-input>
                  </fj-form-item>
                  <fj-form-item label="名称(英文)" prop="englishName">
                    <fj-input v-model="formData.englishName"></fj-input>
                  </fj-form-item>
                  <fj-form-item label="编目人">
                    <fj-input v-model="formData.ownerName" :disabled="true"></fj-input>
                  </fj-form-item>
                  <fj-form-item label="人物" prop="keyman">
                    <fj-input v-model="formData.keyman"></fj-input>
                  </fj-form-item>
                  <fj-form-item label="净长" prop="duration">
                    <fj-input v-model="formData.duration"></fj-input>
                  </fj-form-item>
                  <fj-form-item label="语言" prop="language">
                    <fj-input v-model="formData.language"></fj-input>
                  </fj-form-item>
                  <template v-for="select in selectFields">
                    <fj-form-item :label="select.label" :prop="select.key" :key="select.key">
                      <fj-select v-model="formData[select.key]" size="small" clearable>
                        <fj-option
                                v-for="item in select.items"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label"></fj-option>
                      </fj-select>
                    </fj-form-item>
                  </template>
                  <template v-for="dateField in dateFields">
                    <fj-form-item :label="dateField.label" :prop="dateField.key">
                      <fj-date-picker :type="dateField.type"
                                      placeholder="请选择日期"
                                      v-model="formData[dateField.key]"
                                      :parent-el="parentEl">
                      </fj-date-picker>
                    </fj-form-item>
                  </template>
                  <template v-for="radioField in radioFields">
                    <fj-form-item :label="radioField.label" :prop="radioField.key">
                      <fj-radio-group v-model="formData[radioField.key]" custom-class="radio-group">
                         <template v-for="item in radioField.items">
                           <fj-radio :label="item.value">{{item.label}}</fj-radio>
                         </template>
                      </fj-radio-group>
                    </fj-form-item>
                  </template>
                  <fj-form-item label="内容" prop="content">
                    <fj-input type="textarea" :rows="5" v-model="formData.content"></fj-input>
                  </fj-form-item>
                </fj-form>
                <div :style="{ marginLeft: '78px' }">
                  <fj-button :loading="isUpdateBtnLoading" size="mini" type="primary" @click="updateCatalog">保存</fj-button>
                </div>
              </div>
              <div v-else class="emptyText">请选择条目进行编辑</div>
            </div>
          </template>
        </panel-view>
      </div>
    </div>
    <fj-dialog
      :title="editStatusDialogTitle"
      :visible.sync="editStatusDialogVisible">
      <p>您确定要{{ editStatusDialogTitle }}吗？</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="editStatusDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isEditStatusBtnLoading" @click.stop="editStatusFn">确定</fj-button>
      </div>
    </fj-dialog>
  </div>
</template>
<script>
  import './index.css';
  import VideoSourcePanel from '../../movieEditor/component/videoSourcePanel';
  import PanelView from '../../../component/layout/panel';
  import { isVideoType, transformSecondsToStr } from '../../../common/utils';
  import { selectFields, dateFields, radioFields} from '../config';
  import FjDatePicker from "../../../component/fjUI/packages/datePicker/src/datePicker.vue";
  import FjFormItem from "../../../component/fjUI/packages/form/src/formItem.vue";

  const libraryAPI = require('../../../api/library');

  export default {
    data() {
      return {
        size: { width: document.body.clientWidth, height: document.body.clientHeight },
        sourceTitle: '',
        sourceVideoId: '',
        sourceSnippet: {},
        formData: {
          chineseName: '',
          englishName: '',
          departmentName: '',
          ownerName: '',
          type: '',
          version: '',
          keyman: '',
          duration: '',
          language: '',
          content: '',
          ccid: '',
          newsType: '',
          occurCountry: '',
          version: '',
          madeLocation: '',
          resourceDepartment: '',
          newsTime: '',
          airTime: '',
          hdFlag: '',
          pigeonhole: ''
        },
        currentCatalogId: '',
        currentCatalogType: '',
        currentClip: {},
        rules: {
          chineseName: [
            { required: true, message: '请输入名称' }
          ],
          englishName: [
            { required: true, message: '请输入名称' }
          ],
          type: [
            { required: true, message: '请输入类型' }
          ],
          version: [
            { required: true, message: '请输入版本' }
          ],
          keyman: [
            { required: true, message: '请输入人物' }
          ],
          duration: [
            { required: true, message: '请输入净长' }
          ],
          language: [
            { required: true, message: '请输入语言' }
          ],
          content: [
            { required: true, message: '请输入内容' }
          ],
          ccid: [
            { required: true, message: '请选择编目类'}
          ],
          newsType: [
            { required: true, message: '请选择新闻类型'}
          ],
          occurCountry: [
            { required: true, message: '请选择事发国家'}
          ],
          version: [
            { required: true, message: '请选择版本'}
          ],
          madeLocation: [
            { required: true, message: '请选择制作地点'}
          ],
          resourceDepartment: [
            { required: true, message: '请选择编目类'}
          ],
          newsTime: [
            { required: true, message: '请输入新闻日期'}
          ],
          airTime: [
            { required: true, message: '请输入首播日期'}
          ]
        },
        catalogList: [],
        isUpdateBtnLoading: false,
        isSubmitBtnLoading: false,
        isEditStatusBtnLoading: false,
        editStatusDialogVisible: false,
        editStatusDialogTitle: '',
        editStatusFn: () => {},
        taskId: '',
        objectId: '',
        selectFields: selectFields,
        dateFields: dateFields,
        radioFields: radioFields,
        parentEl: ''
      };
    },
    created() {
      this.EDIT_STATUS_CONFIG = {
        sendBackTask: { text: '退回任务', fn: this.sendBackCatalogTask },
        deleteTask: { text: '删除任务', fn: this.deleteCatalogTask }
      };
      if (this.$route.params.objectId) {
        this.listCatalog(this.$route.params.objectId);
        this.objectId = this.$route.params.objectId;
      }
      if (this.$route.params.taskId) {
        this.taskId = this.$route.params.taskId;
      }
      this.parentEl = this.$refs.rightContent;
    },
    mounted() {
      this.updateSize();
      window.addEventListener('resize', this.updateSize);
    },
    beforDestroy() {
      window.removeEventListener('resize', this.updateSize);
    },
    methods: {
      sendBackCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.sendBackCatalogTask({ taskIds: this.taskId })
          .then((response) => {
            this.isEditStatusBtnLoading = false;
            this.editStatusDialogVisible = false;
            this.$message.success('退回成功');
            this.back();
          })
          .catch((error) => {
            this.isEditStatusBtnLoading = false;
            this.$message.error(error);
          });
      },
      deleteCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.deleteCatalogTask({ taskIds: this.taskId })
          .then((response) => {
            this.isEditStatusBtnLoading = false;
            this.editStatusDialogVisible = false;
            this.$message.success('删除成功');
            this.back();
          })
          .catch((error) => {
            this.isEditStatusBtnLoading = false;
            this.$message.error(error);
          });
      },
      showEditStatusDialog(type) {
        this.editStatusDialogVisible = true;
        this.editStatusDialogTitle = this.EDIT_STATUS_CONFIG[type].text;
        this.editStatusFn = this.EDIT_STATUS_CONFIG[type].fn;
      },
      submitCatalogTask() {
        this.isSubmitBtnLoading = true;
        libraryAPI.submitCatalogTask({ taskIds: this.taskId })
          .then((response) => {
            this.isSubmitBtnLoading = false;
            this.$router.push({ name: 'personal_catalog_task_submitted' });
            this.$message.success('提交成功');
          })
          .catch((error) => {
            this.isSubmitBtnLoading = false;
            this.$message.error(error);
          });
      },
      updateCatalog() {
         this.$refs.catalogForm.validate((valid) => {
          if (valid) {
            this.isUpdateBtnLoading = true;
            if (this.currentCatalogId) {
              const data = Object.assign({}, this.formData, { id: this.currentCatalogId });
              libraryAPI.updateCatalog(data)
                .then((response) => {
                  this.isUpdateBtnLoading = false;
                  this.$message.success('保存成功');
                  this.listCatalog(this.objectId);
                })
                .catch((error) => {
                  this.isUpdateBtnLoading = false;
                  this.$message.error(error);
                });
            } else {
              const data = Object.assign({}, this.formData);
              data.objectId = this.objectId;
              data.parentId = this.currentClip.parentId;
              data.inpoint = this.currentClip.range[0];
              data.outpoint = this.currentClip.range[1];
              libraryAPI.createCatalog(data)
                .then((response) => {
                  this.isUpdateBtnLoading = false;
                  this.$message.success('保存成功');
                  this.listCatalog(this.objectId);
                })
                .catch((error) => {
                  this.isUpdateBtnLoading = false;
                  this.$message.error(error);
                });
            }
          }
        });
      },
      handleClickCatalogItem(node) {
        if (node.type && node.type === 'tempItem') {
          const keys = Object.keys(this.formData);
          keys.forEach(key => {
            if (key === 'ownerName' || key === 'departmentName') return;
            this.formData[key] = '';
          });
          this.formData.chineseName = node.name;
          this.currentCatalogId = '';
          this.currentClip = node;
          return;
        }
        const filePath = node.fileInfo && node.fileInfo.realPath;
        if (isVideoType(filePath)) {
          this.currentCatalogType = 'video';
          this.sourceVideoId = node.objectId;
        } else {
          this.currentCatalogType = 'normal';
        }
        const id = node._id;
        this.currentCatalogId = id;
        libraryAPI.getCatalog({ params: { id: id } }).then((res) => {
          const keys = Object.keys(this.formData);
          keys.forEach(key => {
            this.formData[key] = res.data[key];
          });
          this.formData.ownerName = node.owner.name;
          this.formData.departmentName = node.department.name;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      listCatalog(objectId) {
        libraryAPI.listCatalog({ params: { objectId: objectId } }).then((res) => {
          const tempObj = {};
          res.data.forEach(item => {
            tempObj[item._id] = item;
          });
          const originalKeys = Object.keys(tempObj);
          const keys = [];
          for (let i = 0, len = originalKeys.length; i < len; i++) {
            const key = originalKeys[i];
            const parentId = tempObj[key].parentId;
            if (parentId && tempObj[parentId]) {
              const child = Object.assign(
                { children: [] },
                tempObj[key],
                { name: tempObj[key].chineseName });
              if (tempObj[parentId].children) {
                tempObj[parentId].children.push(child);
              } else {
                tempObj[parentId].children = [child];
              }
            } else {
              keys.push(key);
            }
          }

          this.catalogList = keys.map(key => {
            return Object.assign({ children: [] }, tempObj[key], { name: tempObj[key].chineseName });
          });
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      updateSize() {
        const catalogContentRect = this.$refs.catalogContent.getBoundingClientRect();
        this.size = { width: catalogContentRect.width, height: catalogContentRect.height};
      },
      back() {
        this.$router.push({ name: 'personal_catalog_task_doing' });
      },
      importSource(info) {
        if (this.currentCatalogType !== 'video') {
          this.$message.error('所选条目不是视频，无法插入');
          return;
        }
        for (var i = 0; i < this.catalogList.length; i++) {
          if (this.catalogList[i]._id === this.currentCatalogId) {
            const item = this.catalogList[i];
            item.children = item.children ? item.children : [];
            item.children.push(
              Object.assign(
                {},
                info,
                { _id: `${this.currentCatalogId}-${info.range[0]}-${info.range[1]}-${item.children.length + 1}` },
                { name: `片段${item.children.length + 1} ${transformSecondsToStr(info.duration)}` },
                { type: 'tempItem' },
                { parentId: this.currentCatalogId }
              )
            );
            break;
          }
        }

      }
    },
    components: {
      FjFormItem,
      FjDatePicker,
      VideoSourcePanel,
      PanelView
    }
  };
</script>
