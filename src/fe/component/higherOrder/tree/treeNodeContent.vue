<template>
  <div
    v-on:mouseenter="mouseenter"
    v-on:mouseleave="mouseLeave"
    class="ho-tree-tree-node"
  >
    <span class="ho-tree-node-text" :title="node.name">
      {{node.name}}
    </span>
    <span v-show="visible && menus && menus.length > 0">
      <fj-dropdown
        @command="handleClickDropDownItem"
        @handle-click="handleClick"
        class="ho-tree-node-tool"
      >
        设置
        <fj-dropdown-menu slot="dropdown" :width="width">
          <fj-dropdown-item
            v-for="item in menus"
            :command="item.command"
            :key="item.key">
            {{ item.name }}
          </fj-dropdown-item>
        </fj-dropdown-menu>
      </fj-dropdown>
    </span>
  </div>
</template>
<script>
  import './index.css';

  export default {
    data() {
      return {
        visible: false,
        isShowDropDown: false
      };
    },
    props: {
      node: {},
      menus: Array,
      execCommand: Function,
      width: String
    },
    methods: {
      mouseenter() {
        this.isShowDropDown = false;
        this.visible = true;
      },
      mouseLeave() {
        if (!this.isShowDropDown) {
          this.visible = false;
        }
      },
      handleClick() {
        this.isShowDropDown = true;
      },
      handleClickDropDownItem(e) {
        this.isShowDropDown = false;
        this.visible = false;
        this.execCommand(e);
      }
    }
  };
</script>
