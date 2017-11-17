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
  import { getChildMenuByIndex, getItemFromLocalStorage, getDefaultPageIndex } from '../common/utils';

  export default {
    name: 'home',
    components: {
      default: root,
      'left-menu': menu,
      showMenuIndex: []
    },
    created() {
      const me = this;
      const showMenuIndex = getItemFromLocalStorage('menu', me);
      const normalMenu = ['mediaCenter', 'taskCenter', 'personalCenter'];
      this.showMenuIndex = showMenuIndex.length? normalMenu.concat(getChildMenuByIndex('', false, me)) : normalMenu;

      if (window.location.pathname === '/') {
        const index = getDefaultPageIndex(showMenuIndex);
        this.$router.push({name: index});
      }
    },
    data() {
      return {

      };
    }
  };
</script>
