<template>
  <div :class='[ isDark ? "dropdown-menu-dark": "dropdown-menu"]' :style="menuStyle">
    <fj-dropdown-item
      v-for="item in menus"
      :command="item.command"
      :key="item.key">
      {{ item.name }}
    </fj-dropdown-item>
  </div>
</template>
<script>
  export default {
    props: {
      isDark: {},
      menuStyle: {},
      menus: []
    }
  };
</script>
<style>
  .dropdown-menu {
    position: absolute;
    padding: 4px 0;
    background: #FFFFFF;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    z-index: 201;
    color: #2A3E52;
  }
  .dropdown-menu-dark {
    position: absolute;
    padding: 4px 0;
    z-index: 201;
    color: #CED9E5;
    background: #021120;
    border: 1px solid #2A3E52;
    border-radius: 2px;
  }
  .dropdown-menu:after {
    content: '';
    position: absolute;
    top: -10px;
    right: 5px;
    border: 5px solid #fff;
    border-color: transparent transparent #fff transparent;
  }
  .dropdown-menu:before {
    content: '';
    position: absolute;
    top: -12px;
    right: 4px;
    border: 6px solid #CED9E5;
    border-color: transparent transparent #CED9E5 transparent;
  }
  .dropdown-item {
    padding: 0 13px;
    line-height: 24px;
    cursor: pointer;
  }
  .dropdown-item:hover {
    background-color: #38B1EB;
    color: #fff;
  }
  .showButton button {
    display: inline-block !important;
  }
  .dropdown-menu-dark .fj-dropdown-item:hover {
    background: #2A3E52;
    color: #CED9E5;
  }

</style>
