<template>
  <div >
    <span> hello world</span>
    <router-view></router-view>
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
