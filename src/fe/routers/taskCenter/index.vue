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
  import { getChildMenuByIndex } from '../../common/utils';

  const MENU = {
    downloadTask: {
      title: '下载任务',
      index: 'downloadTask',
      children: [
        { text: '全部', index: 'task_download_all', route: 'task_download_all' },
        { text: '待审核', index: 'task_download_audit', route: 'task_download_audit' },
        { text: '已完成', index: 'task_download_complete', route: 'task_download_complete' },
        { text: '错误', index: 'task_download_error', route: 'task_download_error' }
      ]
    },
    auditTask: {
      title: '审核任务',
      index: 'auditTask',
      children: [
        { text: '待审核', index: 'task_audit_waiting', route: 'task_audit_waiting' },
        { text: '全部', index: 'task_audit_all', route: 'task_audit_all' }
      ]
    }
  };
  export default {
    data() {
      return {
        menu: [],
        defaultRoute: '/'
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.menu = this.getMenu();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      getMenu(){
        const menu = [];
        const me = this;
        const firstMenu = getChildMenuByIndex('taskCenter', false, me);
        menu.push(MENU['downloadTask'])
        for(let i = 0, len = firstMenu.length; i < len; i++){
          if(MENU[firstMenu[i]] && firstMenu[i] !== 'downloadTask') {
            menu.push(MENU[firstMenu[i]]);
          }
        }
        return menu;
      }
    }
  };
</script>
