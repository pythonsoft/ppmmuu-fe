<template>
  <div class="fj-tab-pane" v-show="active"><slot></slot></div>
</template>
<script>
  export default {
    name: 'FjTabPane',
    props: {
      label: String,
      name: String,
      disabled: Boolean
    },
    data() {
      return {};
    },
    computed: {
      active() {
        return this.$parent.value === this.name;
      }
    },
    mounted() {
      this.$parent.addPanes(this);
    },
    destroyed() {
      this.$parent.removePanes(this);
    }
  };
</script>
