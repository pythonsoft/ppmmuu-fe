<template>
  <fj-menu :default-active="defaultRoute" router>
    <div class="iconfont icon-phoenixtv logo-wrap"></div>
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
    <div class="app-profile-entry" ref="profileEntry" @click="showProfilePopover" v-clickoutside="closeProfilePopover">
      <template v-if="userInfo.photo">
        <img :src="userInfo.photo" class="app-profile-avatar" width="24" height="24">
      </template>
      <template v-else>
        <img class="app-profile-avatar imgStyle" width="24" height="24">
      </template>
      <div>{{ userInfo.name }}</div>
    </div>
    <!-- <div class="menu-logout" @click.stop="logout">
      <div class="fj-menu-item">
        <div class="menu-box">
          <i class="iconfont menu-icon icon-logout"></i>
          <div>退出</div>
        </div>
      </div>
    </div> -->
    <!-- <fj-dialog title="退出当前帐户" :visible.sync="display" @close="cancelDialog">
      <template>
        <span>确定退出当前帐户吗?</span>
      </template>
      <div slot="footer">
        <fj-button @click="cancelDialog">取消</fj-button>
        <fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>
    </fj-dialog> -->
  </fj-menu>
</template>
<script>
  import Vue from 'vue';
  import ProfilePopover from './profilePopover';
  import Clickoutside from '../component/fjUI/utils/clickoutside';
  import { getItemFromLocalStorage } from '../common/utils';

  const config = require('../config');
  const api = require('../api/user');

  const menu = [
    { text: '媒体库', index: 'mediaCenter', route: '/mediaCenter', icon: 'icon-media-library' },
    { text: '入库', index: 'library', route: '/library', icon: 'icon-library' },
    { text: '上架', index: 'shelf', route: '/shelf', icon: 'icon-shangjia' },
    { text: '订阅', index: 'subscriptions', route: '/subscriptions', icon: 'icon-subscription' },
    { text: '任务', index: 'taskCenter', route: '/taskCenter', icon: 'icon-menu' },
    { text: '个人中心', index: 'personalCenter', route: '/personalCenter', icon: 'icon-person' },
    { text: '管理', index: 'management', route: '/management', icon: 'icon-setting' }
  ];
  export default {
    directives: { Clickoutside },
    props: {
      showMenuIndex: {
        type: Array,
        default() {
          return ['mediaCenter', 'taskCenter', 'library', 'personalCenter'];
        }
      }
    },
    data() {
      return {
        menu: menu,
        defaultRoute: '/',
        display: false,
        userInfo: {
          name: '',
          email: '',
          photo: ''
        }
      };
    },
    created() {
      this.userInfo = getItemFromLocalStorage('userInfo');
      this.getMenu();
      this.defaultRoute = this.getActiveRoute(this.$route.path, 1);
    },
    watch: {
      '$route'(to, from) {
      }
    },
    methods: {
      closeProfilePopover(target) {
        if (this.popover && this.popover.$el.contains(target)) return;
        if (this.popover) this.unmountMenu();
      },
      showProfilePopover() {
        if (!this.popover) {
          this.mountMenu();
        }
      },
      mountMenu() {
        this.popover = new Vue(ProfilePopover).$mount();
        this.popover.avatar = this.userInfo.photo;
        this.popover.name = this.userInfo.name;
        this.popover.email = this.userInfo.email;
        document.body.appendChild(this.popover.$el);
      },
      unmountMenu() {
        if (this.popover) {
          this.popover.$destroy();
          document.body.removeChild(this.popover.$el);
          this.popover = null;
        }
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      getMenu() {
        const showMenuIndex = this.showMenuIndex;
        const showMenu = [];
        for (let i = 0, len = menu.length; i < len; i++) {
          if (showMenuIndex.indexOf(menu[i].index) !== -1) {
            showMenu.push(menu[i]);
          }
        }
        this.menu = showMenu;
      },
      logout() {
        this.display = true;
      },
      cancelDialog() {
        this.display = false;
      },
      confirmDialog() {
        const me = this;
        api.postUserLogout({}, me).then((res) => {
          me.display = false;
          me.$message.success('成功退出当前帐户，期待下次光临.');
          window.location.href = '/login';
        }).catch((error) => {
          me.$message.error(error);
        });
      }
    }
  };
</script>
<style>
  .logo-wrap {
    height: 62px;
    line-height: 62px;
    background: #4C637B;
    /*background: #344C67;*/
    box-shadow: inset 0 -1px 0 0 #5E748A;
    color: #fff;
    text-align: center;
    font-size: 26px;
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
  .menu-logout{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 84px;
    height: 77px;
  }
  .app-profile-entry {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 84px;
    height: 77px;
    padding: 18px 0;
    font-size: 12px;
    text-align: center;
    color: #8CA2BB;
    cursor: pointer;
  }
  .app-profile-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    overflow: hidden;
  }
  .imgStyle {
    background: url(../img/avatar.png) no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
</style>
