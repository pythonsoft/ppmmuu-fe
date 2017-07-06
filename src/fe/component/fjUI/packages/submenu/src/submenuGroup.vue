<template>
  <li class="fj-submenu-group">
    <div class="fj-submenu-group-title" @click="handleClick">
      <slot name="title"></slot>
    </div>
    <ul v-show="opened"><slot></slot></ul>
  </li>
</template>
<script>
  export default {
    name: 'FjSubmenuGroup',
    props: {
      index: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        opened: false,
        items: {}
      }
    },
    watch: {
      '$parent.activedIndex'(val) {
        this.initOpenedMenu(val);
      }
    },
    methods: {
      handleClick() {
        this.opened = !this.opened;
      },
      addItem(item) {
        this.$set(this.items, item.index, item);
      },
      initOpenedMenu(index) {
        const activeItem = this.items[index];
        if (activeItem) {
          this.opened = true;
        }
      }
    },
    created() {
      this.$on('add-item', this.addItem);
    },
    mounted() {
      this.initOpenedMenu(this.$parent.activedIndex);
    }
  }
</script>
