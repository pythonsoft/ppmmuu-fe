<template>
  <div class="main-content">
    <div class="media-left">
     heleloasfsaf
    </div>
    <div class="media-right"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        defaultRoute: '/'
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      }
    }
  };
</script>
