<template>
  <div :class="$style.nodeWrap">
    <p v-if="isShowFolderName" @dblclick.stop="dblclickFolder">{{ node.name }}</p>
    <input
      ref="treeNodeInput"
      v-model="inputValue"
      placeholder="请输入文件名"
      type="text"
      v-else-if="isShowInput"
      :class="$style.treeInput"
      @click.stop=""
      @keyup.enter="submit"
      v-clickoutside="handleCancel">
    <div v-else :class="[$style.mediaWrap, currentNodeId === node._id ? $style.currentMedia : '']" @dblclick="updateCurrentSource">
      <div :class="$style.mediaLeft" class="clearfix">
        <img :class="$style.mediaImg"  v-lazy="node.snippet && node.snippet.thumb" height="29px">
        <p :class="$style.mediaName" :title="node.name">{{ node.name }}</p>
      </div>
      <span :class="$style.mediaDuration">{{ formatTime(node.snippet.duration) }}</span>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import { transformSecondsToStr } from '../../../common/utils';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/source/photoBreak.png',
    attempt: 1
  });

  const TYPE_CONFIG = {
    0: 'folder',
    2: 'folder',
    1: 'video',
    new: 'input'
  };
  export default {
    directives: { Clickoutside },
    props: {
      node: {},
      currentNodeId: String
    },
    data() {
      return {
        inputValue: '',
        nodeStatus: 'normal'
      };
    },
    computed: {
      isShowFolderName() {
        return this.nodeStatus === 'editing' ? false : TYPE_CONFIG[this.node.type] === 'folder';
      },
      isShowInput() {
        return this.nodeStatus === 'editing' ? true : TYPE_CONFIG[this.node.type] === 'input';
      }
    },
    created() {
      this.TYPE_CONFIG = TYPE_CONFIG;
    },
    mounted() {
      if (this.$refs.treeNodeInput) {
        this.$refs.treeNodeInput.focus();
      }
    },
    updated() {
      if (this.isShowInput) {
        this.$refs.treeNodeInput.focus();
      }
    },
    methods: {
      formatTime(time = 0) {
        return transformSecondsToStr(time / 25, 'HH:mm:ss');
      },
      dblclickFolder() {
        this.nodeStatus = 'editing';
        this.inputValue = this.node.name;
      },
      updateCurrentSource() {
        this.$emit('updateCurrentSource', this.node);
      },
      handleCancel() {
        if (this.nodeStatus === 'editing') {
          this.nodeStatus = 'normal';
        } else {
          this.$emit('cancelCreate', this.node);
        }
      },
      submit() {
        const reqData = {
          parentId: this.node.parentId,
          name: this.inputValue,
          ownerType: this.node.ownerType
        };
        if (this.nodeStatus === 'editing') {
          reqData.id = this.node._id;
          this.$emit('updateDirectory', reqData);
          this.nodeStatus = 'normal';
        } else {
          this.$emit('createDirectory', reqData, this.node._id);
        }
      }
    }
  };
</script>
<style module>
  .nodeWrap {
    font-size: 12px;
  }
  .treeInput {
    width: 120px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    background: #fff;
    border: 0;
    border-radius: 2px;
  }
  .mediaWrap {
    position: relative;
    width: 100%;
    height: 29px;
  }
  .currentMedia {
    /*background-color: #2A3E52;*/
  }
  .mediaDuration {
    position: absolute;
    right: 3px;
    top: 0;
    bottom: 0;
    width: 48px;
  }
  .mediaLeft {
    position: absolute;
    top: 0;
    right: 60px;
    bottom: 0;
    left: 0;
  }
  .mediaImg {
    float: left;
    margin-right: 12px;
  }
  .mediaName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
