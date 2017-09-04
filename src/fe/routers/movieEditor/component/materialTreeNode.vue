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
    <div v-else :class="[$style.mediaWrap, currentNodeId === node.id ? $style.currentMedia : '']" @dblclick="updateCurrentMaterial">
      <div :class="$style.mediaLeft" class="clearfix">
        <img :class="$style.mediaImg" :src="node.info.snippet && node.info.snippet.thumb" height="29px">
        <p :class="$style.mediaName">{{ node.name }}</p>
      </div>
      <span :class="$style.mediaDuration">{{ formatTime(node.info.snippet.duration) }}</span>
    </div>
  </div>
</template>
<script>
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import { fillUpZero } from '../../../common/utils';

  const TYPE_CONFIG = {
    0: 'folder',
    1: 'video',
    new: 'input'
  };
  export default {
    directives: { Clickoutside },
    props: {
      node: {},
      rootId: String,
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
        return this.nodeStatus === 'editing' ? false : TYPE_CONFIG[this.node.info.type] === 'folder';
      },
      isShowInput() {
        return this.nodeStatus === 'editing' ? true : TYPE_CONFIG[this.node.info.type] === 'input';
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
      formatTime(second = 0) {
        const hours = Math.floor(second / (60 * 60));
        second %= (60 * 60);
        const minutes = Math.floor(second / 60);
        second %= 60;
        const seconds = Math.floor(second);
        return `${fillUpZero(hours)}:${fillUpZero(minutes)}:${fillUpZero(seconds)}`;
      },
      dblclickFolder() {
        this.nodeStatus = 'editing';
        this.inputValue = this.node.name;
      },
      updateCurrentMaterial() {
        this.$emit('updateCurrentMaterial', this.node.info);
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
          parentId: this.node.parentId || this.rootId,
          name: this.inputValue
        };
        if (this.nodeStatus === 'editing') {
          this.$emit('updateDirectory', reqData);
        } else {
          this.$emit('createDirectory', reqData);
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
    background: #151515;
    border: 0;
    border-radius: 2px;
    color: #9FB3CA;
  }
  .mediaWrap {
    position: relative;
    width: 100%;
    height: 29px;
  }
  .currentMedia {
    background-color: #2A3E52;
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
