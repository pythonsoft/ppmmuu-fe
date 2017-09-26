<template>
  <div>
    <fj-progress-bar></fj-progress-bar>
    <div class="menu">
      <left-menu :showMenuIndex="showMenuIndex">
      </left-menu>
    </div>
    <div class="main"><router-view></router-view></div>
  </div>
</template>
<script>
  import menu from './menu';
  import root from './root';
  import { getChildMenuByIndex } from '../common/utils';

  export default {
    name: 'home',
    components: {
      default: root,
      'left-menu': menu,
      showMenuIndex: []
    },
    created() {
    //      const query = window.location.href.replace(/http[s]*:\/\//g, '').replace(window.location.host, '');
    //      const paths = query.split('/');
    //      let name = paths[paths.length - 1];
    //      name = (name === '/' || !name) ? 'mediaCenter' : name;


      const showMenuIndex = JSON.parse(localStorage.getItem('menu'));
      const normalMenu = ['mediaCenter', 'taskCenter', 'personalCenter'];
      this.showMenuIndex = showMenuIndex.length? normalMenu.concat(getChildMenuByIndex('')) : normalMenu;

      if (window.location.pathname === '/') {
        this.$router.push({ name: 'mediaCenter' });
      }
    },
    data() {
      return {

      };
    }
  };
</script>
