<template>
  <div>
    <div v-if="type==='list'" class="subscribe-list">
      <SubscribeListItem listType="list" v-for="item in items" :item="item" :key="item.objectId"></SubscribeListItem>
    </div>

    <ul v-else class="subscribe-grid clearfix" :style="{ width: !width ? '100%' : width + 'px' }">
      <SubscribeListItem v-for="item in items" :item="item" :key="item.objectId"></SubscribeListItem>
    </ul>
  </div>
</template>
<script>
  import SubscribeListItem from './subscribeListItem';

  export default {
    name: 'mediaCenterGridView',
    props: {
      type: { type: String, default: 'grid' },
      width: { type: Number, default: 100 },
      items: { type: Array, default: [] },
      editable: { type: Boolean, default: false }
    },
    data() {
      return {
        selectInfoId: ''
      };
    },
    methods: {
      deleteItem(item) {
        this.$emit('deleteItem', item);
      },
      change(item) {
        this.selectInfoId = item.id;
        this.$emit('currentItemChange', item);
      }
    },
    components: {
      SubscribeListItem
    }
  };
</script>
