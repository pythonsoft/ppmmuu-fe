<template>
  <div>
    <bucket v-if="showBucket" @edit-path="editPath" @edit-tactics="editTactics">

    </bucket>
    <storage-path v-if="showPath" :showBack="true" :bucket="bucket" @show-back="showPathBackClick" @edit-tactics="editPathTactics">

    </storage-path>
    <storage-tactics v-if="showTactics" :showBack="true" :source="source" :sourceType="sourceType" @show-back="showTacticsBackClick">

    </storage-tactics>
  </div>
</template>

<script>
  import bucket from './component/bucket';
  import storagePath from '../storagePath/component/storagePath';
  import storageTactics from '../storageTactics/component/storageTactics';

  export default {
    components: {
      bucket: bucket,
      'storage-path': storagePath,
      'storage-tactics': storageTactics
    },
    data() {
      return {
        showBucket: true,
        showPath: false,
        showTactics: false,
        bucket: '',
        source: '',
        backType: 'bucket',
        sourceType: ''
      };
    },
    methods: {
      editPath(row) {
        this.showBucket = false;
        this.showPath = true;
        this.showTactics = false;
        this.bucket = row;
      },
      editTactics(row) {
        this.showBucket = false;
        this.showPath = false;
        this.showTactics = true;
        this.source = row;
        this.backType = 'bucket';
        this.sourceType = '0';
      },
      editPathTactics(row) {
        this.showBucket = false;
        this.showPath = false;
        this.showTactics = true;
        this.source = row;
        this.backType = 'path';
        this.sourceType = '1';
      },
      showPathBackClick() {
        this.showBucket = true;
        this.showPath = false;
      },
      showTacticsBackClick() {
        if (this.backType === 'bucket') {
          this.showBucket = true;
          this.showPath = false;
          this.showTactics = false;
        } else {
          this.showBucket = false;
          this.showPath = true;
          this.showTactics = false;
        }
      }
    }
  };
</script>