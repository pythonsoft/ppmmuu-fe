<template>
  <div>
    <storage-path v-if="showPath" @show-back="showPathBackClick" @edit-tactics="editPathTactics">

    </storage-path>
    <storage-tactics v-if="showTactics" :showBack="true" :source="source" :sourceType="sourceType" @show-back="showTacticsBackClick">

    </storage-tactics>
  </div>
</template>

<script>
  import storagePath from './component/storagePath';
  import storageTactics from '../storageTactics/component/storageTactics';

  export default {
    components: {
      'storage-path': storagePath,
      'storage-tactics': storageTactics
    },
    data() {
      return {
        showPath: true,
        showTactics: false,
        source: null,
        sourceType: '1'
      };
    },
    methods: {
      showPathBackClick() {
      },
      editPathTactics(row) {
        console.log('hello');
        this.showPath = false;
        this.showTactics = true;
        this.source = row;
      },
      showTacticsBackClick() {
        this.showPath = true;
        this.showTactics = false;
      }
    }
  };
</script>