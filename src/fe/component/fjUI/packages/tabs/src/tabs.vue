<template>
  <div :class="[{'theme-dark': theme === 'dark'}, customClass]">
    <div class="fj-tabs-header" :class="customHeaderClass">
      <div
        v-for="(pane, index) in panes"
        class="fj-tabs-item"
        :class="{ 'active': pane.active, 'disable': pane.disabled }"
        @click="handleTabClick(pane, index)">
        {{ pane.label }}
      </div>
    </div>
    <div class="fj-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FjTabs',
    props: {
      value: {},
      theme: {
        type: String,
        default: 'normal'
      },
      customClass: String,
      customHeaderClass: String
    },
    data() {
      return {
        panes: []
      };
    },
    watch: {
      value(val) {
      }
    },
    methods: {
      addPanes(item) {
        const index = this.$slots.default.indexOf(item.$vnode);
        this.panes.splice(index, 0, item);
      },
      removePanes(item) {
        const panes = this.panes;
        const index = panes.indexOf(item);
        if (index > -1) {
          panes.splice(index, 1);
        }
      },
      handleTabClick(tab, index) {
        if (tab.disabled) return;
        this.$emit('input', tab.name);
        this.$emit('tab-click', tab, index);
      }
    }
  };
</script>
