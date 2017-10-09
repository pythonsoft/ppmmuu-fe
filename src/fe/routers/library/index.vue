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
    departmentTask: {
      title: '部门任务',
      index: 'departmentTask',
      children: [
        {text: '待认领', index: 'department_catalog_task_unassigned', route: 'department_catalog_task_unassigned'},
        {text: '全部', index: 'department_catalog_task_all', route: 'department_catalog_task_all'}
      ]
    },
    personalTask: {
      title: '我的任务',
      index: 'personalTask',
      children: [
        {text: '编目中', index: 'personal_catalog_task_doing', route: 'personal_catalog_task_doing'},
        {text: '已提交', index: 'personal_catalog_task_submitted', route: 'personal_catalog_task_submitted'},
        {text: '已删除', index: 'personal_catalog_task_deleted', route: 'personal_catalog_task_deleted'},
        {text: '全部', index: 'personal_catalog_task_all', route: 'personal_catalog_task_all'}
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
        const firstMenu = getChildMenuByIndex('library', false, me);
        for(let i = 0, len = firstMenu.length; i < len; i++){
          if(MENU[firstMenu[i]]) {
            menu.push(MENU[firstMenu[i]]);
          }
        }
        return menu;
      }
    }
  };
</script>
