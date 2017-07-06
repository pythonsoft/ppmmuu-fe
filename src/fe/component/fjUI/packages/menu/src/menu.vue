<template>
  <ul class="fj-menu">
    <slot></slot>
  </ul>
</template>
<script>
  export default {
    name: 'FjMenu',
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
          this.$router.push(route);
        }
      }
    },
    mounted() {
      this.$on('item-click', this.handleMenuItemClick);
    }
  };
</script>
