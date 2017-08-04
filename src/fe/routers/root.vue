<template>
  <router-view></router-view>
</template>
<script>
  export default {
    created() {
      this.$progress.start();
      this.$router.beforeEach((to, from, next) => {
        this.$progress.restart();
        next();
      });
      this.$router.afterEach((to, from) => {
        this.$progress.finish();
      });
    },
    mounted() {
      this.$progress.finish();
    }
  };
</script>
