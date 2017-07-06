<template>
  <div>
    <div class="fj-tabs-header">
      <div
        v-for="pane in panes"
        class="fj-tabs-item"
        :class="{ 'active': pane.active, 'disable': pane.disabled }"
        @click="handleTabClick(pane)">
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
      value: {}
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
      handleTabClick(tab) {
        if (tab.disabled) return;
        this.$emit('input', tab.name);
        this.$emit('tab-click', tab);
      }
    }
  };
</script>
