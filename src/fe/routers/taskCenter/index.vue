<template>
  <div class="main-content">
    <div class="left-content">
      <fj-submenu :default-active="defaultRoute" router>
        <template v-for="item in menu">
          <fj-submenu-item
                  v-if="item.text"
                  :index="item.index"
                  :route="item.route">
            {{ item.text }}
          </fj-submenu-item>
          <fj-submenu-group
                  v-else
                  :index="item.index">
            <template slot="title">{{ item.title }}</template>
            <fj-submenu-item
                    v-for="subItem in item.children"
                    :key="subItem.index"
                    :index="subItem.index"
                    :route="subItem.route">
              {{ subItem.text }}
            </fj-submenu-item>
          </fj-submenu-group>
        </template>
      </fj-submenu>
    </div>
    <div class="right-content"><router-view></router-view></div>
  </div>
</template>
<script>
  const menu = [
    { text: '下载任务', index: 'taskDownload', route: 'taskDownload' },
  ];
  export default {
    data() {
      return {
        menu: menu,
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
