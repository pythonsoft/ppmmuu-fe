<template>
  <div>
    <div class="fj-modal-mask"></div>
    <div class="fj-modal-content">
      <div class="fj-modal-header"></div>
      <div class="fj-modal-body"></div>
      <div class="fj-modal-footer"></div>
    </div>
  </div>
</template>
<script>
  export default {};
</script>
<style>
  @import "../../../variables.css";
  .fj-modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .4);
    z-index: var(--z-index-modal);
  }
  .fj-modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 270px;
  }
</style>
