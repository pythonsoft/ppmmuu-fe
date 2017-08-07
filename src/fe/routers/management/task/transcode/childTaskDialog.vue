<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    :width="width"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog">

    <template v-for="item in mainData.order">
      <generate-index-view
        v-if="item === 'generateIndex'"
        :tableData=mainData[item]>
        :title=this.getCurrentStepConfig(item).text
      </generate-index-view>

      <divide-file-view
        v-if="item === 'divideFile'"
        :tableData=mainData[item]>
      </divide-file-view>

      <transcoding-view
        v-if="item === 'transcoding'"
        :tableData=mainData[item]>
      </transcoding-view>

      <merge-file-view
        v-if="item === 'mergeFile'"
        :tableData=mainData[item]>
      </merge-file-view>
    </template>

  </fj-slide-dialog>
</template>
<script>
  import generateIndexView from './generateIndex';
  import divideFileView from './divideFile';
  import transcodingView from './transcoding.vue';
  import mergeFileView from './mergeFile.vue';

  import utils from '../../../../common/utils';
  import DivideFileView from "./divideFile.vue";

  const api = require('../../../../api/transcode');
  const config = require('./config');

  export default {
    name: 'engineBaseSlideDialogView',
    components: {
      DivideFileView,
      'generate-index-view': generateIndexView,
      'divide-file-view': divideFileView,
      'transcoding-view': transcodingView,
      'merge-file-view': mergeFileView,
    },
    props: {
      parentInfo: { type: Object },
      visible: { type: Boolean, default: false },
    },
    watch: {
      visible(v) {
        this.display = v;
        if(this.display) {
          this.listChildTask();
        }else {
          this.mainData = {};
        }
      },
    },
    data() {
      return {
        title: '任务详细信息',
        display: false,
        width: '680px',

        mainData: {},

        submitBtn: {
          disabled: false,
          loading: false,
          text: '确定'
        }
      };
    },
    created() {
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      handleOpenSlideDialog() {
      },
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      cancelClick() {
        this.$emit('update:visible', false);
      },
      confirmFn() {

      },
      render() {

      },
      getCurrentStepConfig(v) {
        return config.getConfig('CURRENT_STEP', v);
      },
      /* api */
      listChildTask() {
        const me = this;

        const param = {
          parentId: this.parentInfo.id
        };

        api.listChildTask({ params: param }, me).then((res) => {
          console.log(res.data);
          me.mainData = res.data;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
    }
  };
</script>
