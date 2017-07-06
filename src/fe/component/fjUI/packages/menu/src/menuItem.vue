<template>
  <li class="fj-menu-item" :class="{ 'active': active }" @click="handleClick">
    <slot></slot>
  </li>
</template>
<script>
  export default {
    name: 'FjMenuItem',
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
        if (parent && parent.$options.name !== 'FjMenu') {
          parent = parent.$parent;
        }
        return parent;
      },
      active() {
        return this.index === this.parent.activedIndex || this.route === this.parent.activedIndex;
      }
    },
    methods: {
      handleClick() {
        this.parent.$emit('item-click', this);
      }
    }
  };
</script>
