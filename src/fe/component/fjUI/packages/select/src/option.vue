<template>
  <li
    class="fj-select-dropdown-item"
    :class="{ 'selected': itemSelected, 'hover': itemHovering }"
    @mouseenter="handleHover"
    @click.stop="selectOptionClick">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>
<script>
  export default {
    name: 'FjOption',
    props: {
      value: {
        required: true
      },
      label: [String, Number]
    },
    data() {
      return {
      };
    },
    computed: {
      currentLabel() {
        return this.label || this.value || '';
      },
      itemSelected() {
        const value = this.parent.value || '';
        return value === this.value;
      },
      itemHovering() {
        return this.parent.options[this.parent.hoverIndex] === this;
      },
      parent() {
        return this.$parent.$parent;
      }
    },
    created() {
      this.parent.options.push(this);
    },
    methods: {
      selectOptionClick() {
        this.parent.$emit('option-click', this);
      },
      handleHover() {
        this.parent.hoverIndex = this.parent.options.indexOf(this);
      }
    }
  };
</script>
