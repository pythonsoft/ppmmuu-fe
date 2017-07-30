<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog">

    <div slot="footer">
      <fj-button @click="cancelClick">取消</fj-button>
      <fj-button type="primary" :disabled="submitBtn.disabled" :loading="submitBtn.loading" @click="_confirmFn" >{{submitBtn.text}}</fj-button>
    </div>
  </fj-slide-dialog>
</template>
<script>
  export default {
    data() {

    }
  }
</script>
