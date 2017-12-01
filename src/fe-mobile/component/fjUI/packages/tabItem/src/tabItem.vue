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
<style>
  .fj-tab-item {
    flex: 1;
    display: block;
    color: #9FB3CA;
  }
  .fj-navbar .fj-tab-item {
    padding: 12px 0;
  }
  .fj-navbar .fj-tab-item.is-selected {
    font-weight: bold;
    border-bottom: 2px solid #38B1EB;
  }
  .fj-tab-item.is-selected {
    color: #38B1EB;
  }
  .fj-tab-item-icon {
    margin: 8.5px auto 7.5px;
    width: 25px;
    height: 25px;
    line-height: 1;
  }
  .fj-tab-item-icon:empty {
    display: none;
  }
  .fj-tab-item-label {
    font-size: 12px;
    line-height: 1;
    margin-bottom: 2px;
  }
  .fj-navbar .fj-tab-item-label {
    font-size: 15px;
  }
</style>
