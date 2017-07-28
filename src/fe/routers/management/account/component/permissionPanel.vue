<template>
  <div class="permission-panel-warpper">
    <h1>权限信息（{{ name }}）</h1>
    <permission-content
      :id="id"
      :parentIds="parentIds"
      :type="type"
      contentClass="permission-content"
      @cancel="cancel"></permission-content>
  </div>
</template>
<script>
  import PermissionContent from './permissionContent';

  export default {
    props: {
      id: String,
      parentIds: Array,
      type: String,
      name: String
    },
    methods: {
      cancel() {
        this.$emit('cancel');
      }
    },
    components: {
      PermissionContent
    }
  };
</script>
<style>
  .permission-panel-warpper {
    margin-left: 20px;
    margin-bottom: 20px;
    color: #2A3E52;
  }
  .permission-panel-warpper h1 {
    font-size: 16px;
    line-height: 62px;
    border-bottom: 1px solid #EBF3FB;
  }
  .permission-content {
    width: 80%;
  }
</style>
