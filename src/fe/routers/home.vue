<template>
  <div>
    <fj-progress-bar></fj-progress-bar>
    <left-menu :showMenuIndex="showMenuIndex">
    </left-menu>
    <div class="main"><router-view></router-view></div>
    <im></im>
  </div>
</template>
<script>
  import menu from './menu';
  import root from './root';
  import { getChildMenuByIndex, getItemFromLocalStorage, getDefaultPageIndex } from '../common/utils';
  import Im from '../component/im/index';

  export default {
    name: 'home',
    components: {
      Im,
      default: root,
      'left-menu': menu,
      showMenuIndex: []
    },
    created() {
      const me = this;
      const showMenuIndex = getItemFromLocalStorage('menu', me);
      const normalMenu = ['taskCenter', 'personalCenter'];
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
