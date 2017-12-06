<template>
  <a :class="['fj-tab-item', {'is-selected': $parent.value === id}]"
    @click="$parent.$emit('input', id)">
    <div class="fj-tab-item-icon"><slot name="icon"></slot></div>
    <div class="fj-tab-item-label"><slot></slot></div>
  </a>
</template>
<script>
  export default {
    name: 'FjTabItem',
    props: {
      id: String
    }
  };
</script>
