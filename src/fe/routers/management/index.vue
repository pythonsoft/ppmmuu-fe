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

  const menu = [
    { title: '账户管理',
      index: 'accountCenter',
      children: [
        { text: '账户', index: 'account', route: 'account' },
        { text: '角色', index: 'role', route: 'role' },
        { text: '权限组', index: 'permissionGroup', route: 'permissionGroup' },
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
    { title: '入库管理',
      index: 'libraryManager',
      children: [
        { text: '入库模板', index: 'libraryTemplate', route: 'libraryTemplate' },
      ]
    },
    { title: '上架管理',
      index: 'shelfManager',
      children: [
        { text: '上架任务', index: 'shelfList', route: 'shelfList' },
        { text: '快编模板', index: 'fastEditTemplate', route: 'fastEditTemplate' },
        { text: '上架模板', index: 'shelfTemplate', route: 'shelfTemplate' },
      ]
    },
    { title: '任务管理',
      index: 'taskManager',
      children: [
        { text: '转码任务', index: 'transcode', route: 'transcode' },
        { text: '下载任务', index: 'download', route: 'download' },
        { text: '入库任务', index: 'libraryTask', route: 'libraryTask' },
      ] },
    { title: '审核管理',
      index: 'auditManager',
      children: [
        { text: '下载审核', index: 'auditDownload', route: 'auditDownload' },
        { text: '审核授权', index: 'auditEmpower', route: 'auditEmpower' },
      ] },
    { title: '模板管理',
      index: 'templateManager',
      children: [
        { text: '下载模板', index: 'downloadTemplate', route: 'downloadTemplate' },
        { text: '转码模板', index: 'transcodeTemplate', route: 'transcodeTemplate' },
      ] },
    { text: '大洋稿件入库', index: 'copyManagement', route: 'copyManagement' },
    { text: '设置', index: 'configuration', route: 'configuration' },
    { text: '报表统计', index: 'report', route: 'report' },
    { title: '帮助',
      index: 'help',
      children: [
        { text: '关于', index: 'managementAbout', route: 'managementAbout' },
        { text: '反馈', index: 'managementFeedback', route: 'managementFeedback' }
      ] }
  ];
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
        const firstMenu = getChildMenuByIndex('management', true, me);
        for(let i = 0, len = firstMenu.length; i < len; i++){
          const item = {
            title: firstMenu[i].name,
            index: firstMenu[i].index,
            children: []
          }
          const secondMenu = getChildMenuByIndex(firstMenu[i].index, true, me);
          for(let j = 0, len2 = secondMenu.length; j < len2; j++){
            const item2 = {
              text: secondMenu[j].name,
              index: secondMenu[j].index,
              route: secondMenu[j].index
            }
            item.children.push(item2);
          }
          if(item.children.length === 0){
            item.route = firstMenu[i].index;
            item.text = firstMenu[i].name;
            delete item.children;
            delete item.title;
          }
          if(item.index !== 'connection') {
            menu.push(item);
          }
        }
        return menu;
      }
    }
  };
</script>
