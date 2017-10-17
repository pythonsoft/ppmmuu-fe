<template>
  <li class="fj-dropdown-item" @click.stop="handleClick"><slot></slot></li>
</template>
<script>
  export default {
    name: 'FjDropdownItem',
    props: {
      command: ''
    },
    methods: {
      handleClick(e) {
        const dropdownNode = this.$parent.$parent;
        dropdownNode.$emit('item-click', this, this.command);
      }
    }
  };
</script>
