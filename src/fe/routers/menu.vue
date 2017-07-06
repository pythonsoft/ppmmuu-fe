<template>
  <fj-menu :default-active="defaultRoute" router>
    <div class="logo-wrap">logo</div>
    <fj-menu-item
      v-for="item in menu"
      :key="item.index"
      :index="item.index"
      :route="item.route">
      {{ item.text }}
    </fj-menu-item>
  </fj-menu>
</template>
<script>
  const menu = [
    { text: "媒体库", index: "router1", route: "/1" },
    { text: "订阅", index: "router2", route: "/2" },
    { text: "任务", index: "router3", route: "/3" },
    { text: "个人中心", index: "router4", route: "/4" },
    { text: "管理", index: "management", route: "/management" }
  ];
  export default {
    data() {
      return {
        menu: menu,
        defaultRoute: '/'
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
    },
    watch: {
      '$route'(to, from) {
        console.log('to', to);
        console.log('from', from);
      }
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      }
    }
  };
</script>
<style>
  .logo-wrap {
    height: 62px;
    line-height: 62px;
    background: #344C67;
    color: #fff;
    text-align: center;
  }
</style>
