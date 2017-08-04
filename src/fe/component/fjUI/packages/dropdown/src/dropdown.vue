<template>
  <div class="fj-dropdown" :class="visible ? 'showButton' : ''">
    <fj-button type="text" @click.stop="handleClick"><slot></slot></fj-button>
    <div v-if="visible" v-clickoutside="handleClose"><slot name="dropdown"></slot></div>
  </div>
</template>
<script>
  import FjButton from '../../button';
  import Clickoutside from '../../../utils/clickoutside';

  export default {
    name: 'FjDropdown',
    data() {
      return {
        visible: false
      };
    },
    methods: {
      handleClick() {
        this.visible = !this.visible;
      },
      handleClose() {
        this.visible = false;
      },
      handleItemClick(item, command) {
        this.visible = false;
        this.$emit('command', command);
      }
    },
    mounted() {
      this.$on('item-click', this.handleItemClick);
    },
    components: {
      FjButton
    },
    directives: { Clickoutside }
  };
</script>
