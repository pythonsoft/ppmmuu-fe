<template>
  <fj-menu :default-active="defaultRoute" router>
    <div class="logo-wrap">logo</div>
    <fj-menu-item
      v-for="item in menu"
      :key="item.index"
      :index="item.index"
      :route="item.route">
      <div class="menu-box">
        <i class="iconfont menu-icon" :class="item.icon"></i>
        <div>{{ item.text }}</div>
      </div>
    </fj-menu-item>
  </fj-menu>
</template>
<script>
  const menu = [
    { text: '媒体库', index: 'mediaCenter', route: '/mediaCenter', icon: 'icon-media-library' },
  //    { text: '订阅', index: '2', route: '/2', icon: 'icon-subscription' },
    { text: '任务', index: '3', route: '/3', icon: 'icon-menu' },
    { text: '个人中心', index: 'personalCenter', route: '/personalCenter', icon: 'icon-person' },
    { text: '管理', index: 'management', route: '/management', icon: 'icon-setting' }
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
        // console.log('to', to);
        // console.log('from', from);
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
  .menu-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 48px;
  }
  .menu-icon {
    display: block;
    font-size: 18px;
    margin-bottom: 4px;
  }
</style>
