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
          <template slot="0" slot-scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/5*3,#-p0"
              direction="y"
              name="child1"
            >
              <template slot="0" slot-scope="props">
                <video-source-panel
                  v-if="!programInfo.name"
                  :title="sourceTitle"
                  :videoId="sourceVideoId"
                  :videoSnippet="sourceSnippet"
                  :size="{ width: props.width, height: props.height }"
                  @insert="importSource"></video-source-panel>
                <program-panel
                  v-else
                  :project-bus="projectBus"
                  :size="{ width: props.width, height: props.height }"></program-panel>
              </template>
              <template slot="1" slot-scope="props">
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
          <template slot="1" slot-scope="props">
            <div :style="{ width: '100%', height: '100%', overflow: 'auto' }" ref="rightContent">
              <div class="catalogRightContent" v-if="hasSelectedItem || currentCatalogId">
                <h3>填写编目内容</h3>
                <fj-form :model="formData" :rules="rules" ref="catalogForm" label-width="100px">
                  <div
                      v-for="(item, index) in FORM_ITEM"
                      :key="'FORM_ITEM'+index">
                    <fj-form-item :label="item.label" :prop="item.propName" v-if="isShow(item)">
                      <fj-input v-if="item.type === 'text'" v-model="formData[item.valueName]" type="text" :disabled="item.disabled" />
                      <fj-select v-else-if="item.type === 'select' && item.valueName === 'type'" placeholder="请选择" v-model="type" :parent-el="parentEl">
                        <fj-option
                                v-for="option in selectFields[item.propName].items"
                                :key="option.label+option.value"
                                :label="option.label"
                                :value="option.value">
                        </fj-option>
                      </fj-select>
                      <fj-select v-else-if="item.type === 'select'" placeholder="请选择" v-model="formData[item.valueName]" :parent-el="parentEl">
                        <fj-option
                                v-for="option in selectFields[item.propName].items"
                                :key="option.label+option.value"
                                :label="option.label"
                                :value="option.value">
                        </fj-option>
                      </fj-select>
                      <fj-radio-group v-else-if="item.type === 'radio'" v-model="formData[item.valueName]" custom-class="radio-group">
                        <fj-radio v-for="radio in radioFields[item.propName].items" :key="radio.label+radio.value" :label="radio.value">{{ radio.label }}</fj-radio>
                      </fj-radio-group>
                      <fj-input v-else-if="item.type === 'textarea'" type="textarea" :rows="5" v-model="formData.content"></fj-input>
                      <fj-date-picker
                              v-else
                              type="date"
                              format="YYYY-MM-DD"
                              theme="stroke"
                              placeholder="请选择日期"
                              v-model="formData[item.valueName]"
                              :parent-el="parentEl"></fj-date-picker>
                    </fj-form-item>
                  </div>
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
  import Vue from 'vue';
  import './index.css';
  import VideoSourcePanel from '../../movieEditor/component/videoSourcePanel';
  import PanelView from '../../../component/layout/panel';
  import { isVideoType, secondsToTimeCode } from '../../../common/utils';
  import { selectFields, dateFields, radioFields} from '../config';
  import FjDatePicker from "../../../component/fjUI/packages/datePicker/src/datePicker.vue";
  import FjFormItem from "../../../component/fjUI/packages/form/src/formItem.vue";
  import ProgramPanel from '../../movieEditor/component/programPanel';
  import throttle from '../../../component/fjUI/utils/throttle';
  import { FORM_ITEM } from '../config'

  const libraryAPI = require('../../../api/library');

  export default {
    data() {
      return {
        size: { width: document.body.clientWidth, height: document.body.clientHeight },
        sourceTitle: '',
        sourceVideoId: '',
        sourceSnippet: {},
        FORM_ITEM: FORM_ITEM,
        formData: {
          name: '',
          chineseName: '',
          englishName: '',
          keyword: '',
          departmentName: '',
          ownerName: '',
          type: '廣告',
          version: '',
          keyman: '',
          duration: '',
          language: 'f_chinese',
          content: '',
          ccid: '',
          newsType: '',
          occurCountry: '',
          madeLocation: '',
          resourceDepartment: '',
          newsTime: '',
          airTime: '',
          hdFlag: 1,
          pigeonhole: ''
        },
        currentCatalogId: '',
        currentCatalogType: '',
        currentClip: {},
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ],
          chineseName: [
            { required: true, message: '请输入名称' }
          ],
          type: [
            { required: true, message: '请输入类型' }
          ],
          version: [
            { required: true, message: '请输入版本' }
          ],
          language: [
            { required: true, message: '请输入语言' }
          ],
          content: [
            { required: true, message: '请输入内容' }
          ],
          version: [
            { required: true, message: '请选择版本'}
          ],
          madeLocation: [
            { required: true, message: '请选择制作地点'}
          ],
          resourceDepartment: [
            { required: true, message: '请选择资源所属部门'}
          ],
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
        parentEl: '',
        hasSelectedItem: false,
        programInfo: {
          name: '',
          range: [],
          objectId: ''
        },
        type: '廣告',
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
      this.projectBus = new Vue();
      this.projectBus.$on('updateProgramIndex', (index) => {
        this.updateProgram();
      });
    },
    watch: {
      type(val) {
        this.formData.type = val;
      }
    },
    mounted() {
      this.updateSize();
      this.parentEl = this.$refs.rightContent;
      window.addEventListener('resize', throttle(this.updateSize));
    },
    beforDestroy() {
      window.removeEventListener('resize', throttle(this.updateSize));
    },
    methods: {
      sendBackCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.sendBackCatalogTask({ taskIds: this.taskId })
          .then((response) => {
            this.editStatusDialogVisible = false;
            this.$message.success('退回成功');
            this.back();
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isEditStatusBtnLoading = false;
          });
      },
      deleteCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.deleteCatalogTask({ taskIds: this.taskId })
          .then((response) => {
            this.editStatusDialogVisible = false;
            this.$message.success('删除成功');
            this.back();
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isEditStatusBtnLoading = false;
          });
      },
      showEditStatusDialog(type) {
        this.editStatusDialogVisible = true;
        this.editStatusDialogTitle = this.EDIT_STATUS_CONFIG[type].text;
        this.editStatusFn = this.EDIT_STATUS_CONFIG[type].fn;
      },
      submitCatalogTask() {
        this.$refs.catalogForm.validate((valid) => {
          if (valid) {
            this.isSubmitBtnLoading = true;
            libraryAPI.submitCatalogTask({taskIds: this.taskId})
              .then((response) => {
                this.$router.push({name: 'personal_catalog_task_submitted'});
                this.$message.success('提交成功');
              })
              .catch((error) => {
                this.$message.error(error);
              })
              .then(() => {
                this.isSubmitBtnLoading = false;
              });
          }else{
            this.$message.error('请检查编目信息是否填写正确');
          }
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
                  this.$message.success('保存成功');
                  this.listCatalog(this.objectId);
                })
                .catch((error) => {
                  this.$message.error(error);
                })
                .then(() => {
                  this.isUpdateBtnLoading = false;
                });
            } else {
              const data = Object.assign({}, this.formData);
              data.objectId = this.objectId;
              data.parentId = this.currentClip.parentId;
              data.inpoint = this.currentClip.range[0];
              data.outpoint = this.currentClip.range[1];
              libraryAPI.createCatalog(data)
                .then((response) => {
                  this.$message.success('保存成功');
                  this.listCatalog(this.objectId);
                })
                .catch((error) => {
                  this.$message.error(error);
                })
                .then(() => {
                  this.isUpdateBtnLoading = false;
                });
            }
          }
        });
      },
      handleClickCatalogItem(node) {
        this.hasSelectedItem = true;
        if (node.type && node.type === 'tempItem') {
          const keys = Object.keys(this.formData);
          keys.forEach(key => {
            if (key === 'ownerName' || key === 'departmentName') return;
            // this.formData[key] = '';
          });
          this.formData.chineseName = node.name;
          this.formData.duration = node.duration;
          this.programInfo.name = node.name;
          this.programInfo.range = node.range;
          this.programInfo.objectId = this.objectId;
          this.updateProgram();
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
            if(res.data[key]) {
              this.formData[key] = res.data[key];
            }
          });
          this.formData.duration = node.duration;
          if(!res.data || res.data.parentId){
            this.programInfo.name = node.name;
            this.programInfo.range = [node.inpoint, node.outpoint];
            this.programInfo.objectId = this.objectId;
            this.updateProgram();
          }else{
            this.programInfo.name = '';
          }
          this.formData.ownerName = node.owner.name;
          this.formData.departmentName = node.department.name;
          if (!this.formData.type) {
            this.formData.type = '廣告';
          }
          if (!this.formData.language) {
            this.formData.type = 'f_chinese';
          }
          if (this.formData.hasOwnProperty(hdFlag)) {
            this.formData.hdFlag = 1;
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      updateProgram() {
        this.$nextTick(()=> {
          this.projectBus.$emit('updateProgram', this.programInfo || {}, 0, false);
        })
      },
      listCatalog(objectId) {
        const me = this;
        libraryAPI.listCatalog({ params: { objectId: objectId } }).then((res) => {
          const tempObj = {};
          res.data.forEach(item => {
            if(!this.hasSelectedItem && !this.currentCatalogId){
              me.currentCatalogId = item._id;
              libraryAPI.getCatalog({ params: { id: item._id } }).then((res) => {
                const keys = Object.keys(this.formData);
                keys.forEach(key => {
                  me.formData[key] = res.data[key];
                });
                me.formData.ownerName = res.data.owner.name;
                me.formData.departmentName = res.data.department.name;
              }).catch((error) => {
                me.$message.error(error);
              });
            }
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
//        if (this.currentCatalogType !== 'video') {
//          this.$message.error('所选条目不是视频，无法插入');
//          return;
//        }
        for (var i = 0; i < this.catalogList.length; i++) {
          if (this.catalogList[i]._id === this.currentCatalogId) {
            const item = this.catalogList[i];
            item.children = item.children ? item.children : [];
            const newChild = Object.assign(
                {},
                info,
                { _id: `${this.currentCatalogId}-${info.range[0]}-${info.range[1]}-${item.children.length + 1}` },
                { name: `片段${item.children.length + 1} ${secondsToTimeCode(info.duration)}` },
                { type: 'tempItem' },
                { parentId: this.currentCatalogId },
                { duration: secondsToTimeCode(info.duration)},
            );
            item.children.push(newChild);
            break;
          }
        }

      },
      isShow(item) {
        if (!item.show) {
          return true;
        }

        if (item.show && typeof item.show === 'function') {
          if (item.show(this.type)) {
            return true;
          }
        }
        return false;
      }
    },
    components: {
      FjFormItem,
      FjDatePicker,
      VideoSourcePanel,
      PanelView,
      ProgramPanel
    }
  };
</script>
