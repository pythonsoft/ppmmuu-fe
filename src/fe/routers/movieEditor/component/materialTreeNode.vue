<template>
  <div :class="$style.nodeWrap">
    <p v-if="isShowFolderName" @click.stop="" @dblclick.stop="dblclickFolder">{{ node.name }}</p>
    <input
      ref="treeNodeInput"
      v-model="inputValue"
      placeholder="请输入文件名"
      type="text"
      v-if="isShowInput"
      :class="$style.treeInput"
      @click.stop=""
      @keyup.enter="submit"
      v-clickoutside="handleCancel">
  </div>
</template>
<script>
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';

  const TYPE_CONFIG = {
    0: 'folder',
    1: 'video',
    new: 'input'
  };
  export default {
    directives: { Clickoutside },
    props: {
      node: {},
      rootId: String
    },
    data() {
      return {
        inputValue: '',
        nodeStatus: 'normal'
      };
    },
    computed: {
      isShowFolderName() {
        return this.nodeStatus === 'editing' ? false : TYPE_CONFIG[this.node.info.type]==='folder';
      },
      isShowInput() {
        return this.nodeStatus === 'editing' ? true : TYPE_CONFIG[this.node.info.type]==='input';
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
      dblclickFolder() {
        this.nodeStatus = 'editing';
        this.inputValue = this.node.name;
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
</style>
