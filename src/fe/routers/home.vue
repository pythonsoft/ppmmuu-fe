<template>
  <div>
    <fj-progress-bar></fj-progress-bar>
    <div class="menu">
      <left-menu>
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
      'left-menu': menu
    },
    data() {
      return {

      }
    }
  };
</script>
