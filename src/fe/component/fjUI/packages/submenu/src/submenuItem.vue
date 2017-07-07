<template>
  <li class="fj-submenu-item" :class="{ 'active': active }" @click="handleClick">
    <slot></slot>
  </li>
</template>
<script>
  export default {
    name: 'FjSubmenuItem',
    props: {
      index: {
        type: String,
        required: true
      },
      route: {}
    },
    data() {
      return {};
    },
    computed: {
      parent() {
        let parent = this.$parent;
        if (parent && parent.$options.name !== 'FjSubmenu') {
          parent = parent.$parent;
        }
        return parent;
      },
      group() {
        let group = null;
        if (this.$parent && this.$parent.$options.name === 'FjSubmenuGroup') {
          group = this.$parent;
        }
        return group;
      },
      active() {
        return this.index === this.parent.activedIndex || this.route === this.parent.activedIndex;
      }
    },
    methods: {
      handleClick() {
        this.parent.$emit('item-click', this);
      }
    },
    created() {
      if (this.group) {
        this.group.$emit('add-item', this);
      }
    }
  };
</script>
