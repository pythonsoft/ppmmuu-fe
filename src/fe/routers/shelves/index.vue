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
    departmentShelf:{ title: '部门任务',
      index: 'departmentShelf',
      children: [
        { text: '待认领', index: 'prepareDepartmentShelf', route: 'prepareDepartmentShelf' },
        { text: '全部', index: 'allDepartmentShelf', route: 'allDepartmentShelf' },
      ] },
    myShelf: { title: '我的任务',
      index: 'myShelf',
      children: [
        { text: '处理中', index: 'doingMyShelf', route: 'doingMyShelf' },
        { text: '已提交', index: 'submittedMyShelf', route: 'submittedMyShelf' },
        { text: '已删除', index: 'deletedMyShelf', route: 'deletedMyShelf' },
        { text: '全部', index: 'allMyShelf', route: 'allMyShelf' },
      ] },
    lineShelf: { title: '上架管理',
      index: 'lineShelf',
      children: [
        { text: '待上架', index: 'prepareLineShelf', route: 'prepareLineShelf' },
        { text: '已上架', index: 'onlineShelf', route: 'onlineShelf' },
        { text: '已下架', index: 'offlineShelf', route: 'offlineShelf' },
      ] }};
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
        const firstMenu = getChildMenuByIndex('shelf', false, me);
        const menuIndexes = ['departmentShelf', 'myShelf', 'lineShelf'];
        for(let i = 0, len = menuIndexes.length; i < len; i++){
          if(firstMenu.indexOf(menuIndexes[i]) !== -1) {
            menu.push(MENU[menuIndexes[i]]);
          }
        }
        return menu;
      }
    }
  };
</script>
