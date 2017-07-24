<template>
  <div class="single-node">
    {{node.name}}
    <fj-dropdown @command="handleClickDropDownItem">
      设置
      <fj-dropdown-menu slot="dropdown">
        <fj-dropdown-item command="edit">编辑组</fj-dropdown-item>
        <fj-dropdown-item command="delete">删除组</fj-dropdown-item>
        <fj-dropdown-item command="new">新建组</fj-dropdown-item>
      </fj-dropdown-menu>
    </fj-dropdown>
  </div>
</template>
<script>
  export default {
    props: {
      node: {},
      treeData: {},
      currentNode: {}
    },
    methods: {
      handleClickDropDownItem(command) {
        console.log(`currentNode: ${JSON.stringify(this.currentNode)}`);
        if (['edit', 'delete'].includes(command)) {
          if (Object.keys(this.currentNode).length === 0) {
            this.showErrorInfo('未选择组');
          } else {
            switch (command) {
              case 'edit':
                console.log('edit');
                break;
              case 'delete':
                console.log('delete');
                break;
              default:
                this.showErrorInfo('未知操作');
            }
          }
        } else {
          this.showErrorInfo('未知操作');
        }
      }
    }
  };
</script>
<style>
  .single-node {
    display: inline;
  }
</style>
