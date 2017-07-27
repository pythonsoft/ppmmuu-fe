<template>
  <div v-on:mouseenter="mouseenter" v-on:mouseleave="mouseLeave" class="tree-node">
    <span class="node-text" title="node.name">{{node.name}}</span>
    <span v-if="visible">
      <fj-dropdown @command="handleClickDropDownItem" class="node-tool">
        设置
        <fj-dropdown-menu slot="dropdown">
          <fj-dropdown-item command="edit">编辑公司</fj-dropdown-item>
          <fj-dropdown-item command="delete">删除公司</fj-dropdown-item>
        </fj-dropdown-menu>
      </fj-dropdown>
    </span>
  </div>
</template>
<style>
  .tree-node{
    position: relative;
  }

  .node-text {
    padding-right: 38px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
  }
  .node-tool {
    position: absolute;
    right: 0;
    margin-right: 10px;
  }
  .tree-node button {
    display: none;
  }
  .tree-node:hover button {
    display: inline-block;
  }

</style>
<script>
  export default {
    data() {
      return {
        visible: false,
        isShowDropDown: false,
      };
    },
    props: {
      node: {},
      settingBtnClick: Function
    },
    methods: {
      mouseenter() {
        this.isShowDropDown = false;
        this.visible = true;
      },
      mouseLeave() {
        if(this.isShowDropDown) {
          this.visible = false;
        }
      },
      settingsClick(e) {
        this.isShowDropDown = true;
      },
      handleClickDropDownItem(e) {
        const me = this;
        this.settingBtnClick(me.node, e);
      }
    }
  };
</script>
