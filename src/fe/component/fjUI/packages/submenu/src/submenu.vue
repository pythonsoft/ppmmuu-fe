<template>
  <ul class="fj-submenu">
    <slot></slot>
  </ul>
</template>
<script>
  export default {
    name: 'FjSubmenu',
    props: {
      defaultActive: String,
      router: Boolean
    },
    data() {
      return {
        activedIndex: this.defaultActive
      };
    },
    watch: {
      defaultActive(val) {
        this.activedIndex = val;
      }
    },
    methods: {
      handleMenuItemClick(item) {
        this.activedIndex = item.index;

        this.$emit('select', item.index, item.route);
        if (this.router) {
          const route = item.route || item.index;
          const path = this.$route.path;
          const newPath = this.handleChangePath(path, 2, route);
          this.$router.push(newPath);
        }
      },
      handleChangePath(path, level, route) {
        const pathArr = path.split('/');
        pathArr[level] = route;
        return pathArr.join('/');
      }
    },
    mounted() {
      this.$on('item-click', this.handleMenuItemClick);
    }
  };
</script>
