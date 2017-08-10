<template>
  <storage-tactics
          :showBack="false"
          @show-back="showBackClick">

  </storage-tactics>
</template>

<script>
  import storageTactics from './component/storageTactics';

  export default {
    components: {
      'storage-tactics': storageTactics
    },
    methods: {
      showBackClick() {

      }
    }
  };
</script>