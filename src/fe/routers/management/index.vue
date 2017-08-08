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
    { title: '账户管理',
      index: 'accountCenter',
      children: [
        { text: '账户', index: 'account', route: 'account' },
        { text: '角色', index: 'role', route: 'role' },
        { text: '权限', index: 'permission', route: 'permission' }
      ] },
    { text: '引擎管理', index: 'engine', route: 'engine' },
    { title: '存储管理',
      index: 'storageManager',
      children: [
        { text: '存储区', index: 'bucket', route: 'bucket' },
        { text: '路径', index: 'storagePath', route: 'storagePath' },
        { text: '策略', index: 'storageTactics', route: 'storageTactics' }
      ] },
    { title: '任务管理',
      index: 'taskManager',
      children: [
        { text: '转码任务', index: 'transcode', route: 'transcode' },
        { text: '传输任务', index: 'transfer', route: 'transfer' }
      ] },
    { text: '设置', index: 'configuration', route: 'configuration' }
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
