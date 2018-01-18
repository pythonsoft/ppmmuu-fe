<template>
  <div class="layout-tab-panel">
    <div :class="{'layout-tab-item': true, 'active': menu.active, 'disable': !menu.active}" v-for="(menu, index) in menus" :key="menu.key" @click="handleClick(index)">{{menu.label}}</div>
  </div>
</template>
<script>
  // # p+index
  import './index.css';

  export default {
    name: 'tab',
    props: {
      menus: {
        type: Array
      }
    },
    data() {
      return {
      };
    },
    watch: {

    },
    created() {
    },
    computed:{
    },
    methods: {
      handleClick(index){
        this.$emit('tab-click', index);
      }
    }
  };
</script>
