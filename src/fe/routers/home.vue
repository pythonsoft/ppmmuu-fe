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

  export default {
    name: 'home',
    components: {
      default: root,
      'left-menu': menu,
      showMenuIndex: []
    },
    created() {
      const query = window.location.href.replace(/http[s]*:\/\//g, '').replace(window.location.host, '');
      const paths = query.split('/');
      let name = paths[paths.length - 1];

      name = (name === '/' || !name) ? 'mediaCenter' : name;

      let showMenuIndex = this.$route.params.menu;

      if (showMenuIndex) {
        localStorage.setItem('menu', showMenuIndex.join(','));
        this.showMenuIndex = showMenuIndex;
      } else {
        showMenuIndex = localStorage.getItem('menu');
        this.showMenuIndex = showMenuIndex ? showMenuIndex.split(',') : [];
      }
    },
    data() {
      return {

      };
    }
  };
</script>
