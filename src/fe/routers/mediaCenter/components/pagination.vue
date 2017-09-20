<template>
  <div>
    <ul class="fj-page-list">
      <li :class="['iconfont icon-arrow-left fj-pagination-prev', { 'disabled': internalCurrentPage <= 1 }]" @click="prev"></li>
      <li
        v-for="page in pages"
        :class="{ active: internalCurrentPage === page }"
        @click="handlePageClick(page)">{{ page }}</li>
      <li :class="['iconfont icon-arrow-right fj-pagination-next', { 'disabled': internalCurrentPage === internalPageCount || internalPageCount === 0 }]" @click="next"></li>
    </ul>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      displayCount: {
        type: Number,
        default: 10
      },
      pageSize: {
        type: Number,
        default: 20
      },
      total: Number,
      currentPage: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        internalCurrentPage: 1
      };
    },
    computed: {
      internalPageCount() {
        return Math.ceil(this.total / this.pageSize);
      },
      pages() {
        const currentPage = Number(this.internalCurrentPage);
        const pageCount = Number(this.internalPageCount);
        const displayCount = Number(this.displayCount);
        const array = [];
        let start = Math.floor((currentPage - 1) / displayCount) * displayCount + 1;
        let end = start + displayCount - 1;
        if (end > pageCount) {
          end = pageCount;
          start = end - displayCount + 1 < 1 ? 1 : end - displayCount + 1;
        }
        for (let i = start; i <= end; i++) {
          array.push(i);
        }
        return array;
      }
    },
    watch: {
      currentPage: {
        immediate: true,
        handler(val) {
          this.internalCurrentPage = val;
        }
      },
      internalCurrentPage(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.$emit('update:currentPage', newVal, oldVal);
          this.$emit('current-change', newVal, oldVal);
        }
      }
    },
    methods: {
      prev() {
        const newVal = this.internalCurrentPage - 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      next() {
        const newVal = this.internalCurrentPage + 1;
        this.internalCurrentPage = this.getValidCurrentPage(newVal);
      },
      handlePageClick(page) {
        const newPage = Number(page);
        if (newPage !== this.internalCurrentPage) {
          this.internalCurrentPage = this.getValidCurrentPage(newPage);
        }
      },
      getValidCurrentPage(value) {
        if (value < 1) return 1;
        if (value > this.internalPageCount) return this.internalPageCount;
        return value;
      }
    }
  };
</script>
