<template>
  <div :class="`fj-pagination-${theme}`">
    <div class="fj-pagination-total">共{{ total }}条</div><!--
    --><ul class="fj-page-list">
      <li :class="['iconfont icon-arrow-left fj-pagination-prev', { 'disabled': internalCurrentPage <= 1 }]" @click="prev"></li>
      <li
        :class="{ active: internalCurrentPage === 1 }"
        v-if="internalPageCount > 0"
        @click="handlePageClick(1)">1</li>
      <li
        v-if="showPrevMore">...</li>
      <li
        v-for="page in pages"
        :class="{ active: internalCurrentPage === page }"
        @click="handlePageClick(page)">{{ page }}</li>
      <li
        v-if="showNextMore">...</li>
      <li
        :class="{ active: internalCurrentPage === internalPageCount }"
        v-if="internalPageCount > 1"
        @click="handlePageClick(internalPageCount)">{{ internalPageCount }}</li>
      <li :class="['iconfont icon-arrow-right fj-pagination-next', { 'disabled': internalCurrentPage === internalPageCount || internalPageCount === 0 }]" @click="next"></li>
    </ul><!--
    --><div class="fj-pagination-jump">
      第
      <input
        type="number"
        class="fj-pagination-editor"
        min="1"
        :max="internalPageCount"
        v-model="jumpVal"
      >
      页
      <button class="fj-pagination-go" @click="jump">GO</button>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FjPagination',
    props: {
      theme: {
        type: String,
        default: 'normal'
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
        internalCurrentPage: 1,
        internalPageSize: 20,
        showPrevMore: false,
        showNextMore: false,
        jumpVal: ''
      };
    },
    computed: {
      internalPageCount() {
        if (typeof this.total === 'number') {
          return Math.ceil(this.total / this.internalPageSize);
        }
        return null;
      },
      pages() {
        const showCount = 7;
        const currentPage = Number(this.internalCurrentPage);
        const pageCount = Number(this.internalPageCount);

        let showPrevMore = false;
        let showNextMore = false;

        if (pageCount > showCount) {
          if (currentPage > showCount - 2) {
            showPrevMore = true;
          }
          if (currentPage < pageCount - 2) {
            showNextMore = true;
          }
        }

        const array = [];

        if (!showPrevMore && showNextMore) {
          for (let i = 2; i < showCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && !showNextMore) {
          for (let i = pageCount - (showCount - 2); i < pageCount; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.floor(showCount / 2) - 1;
          for (let i = currentPage - offset; i <= currentPage + offset; i++) {
            array.push(i);
          }
        } else {
          for (let i = 2; i < pageCount; i++) {
            array.push(i);
          }
        }

        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;
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
      pageSize: {
        immediate: true,
        handler(val) {
          this.internalPageSize = val;
        }
      },
      internalCurrentPage(newVal, oldVal) {
        if (oldVal !== newVal) {
          this.$emit('update:currentPage', newVal, oldVal);
          this.$emit('current-change', newVal, oldVal);
        }
      },
      internalPageCount(val) {}
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
      getValidCurrentPage(value) {
        if (value < 1) return 1;
        if (value > this.internalPageCount) return this.internalPageCount;
        return value;
      },
      jump() {
        this.internalCurrentPage = this.getValidCurrentPage(Number(this.jumpVal));
        this.jumpVal = '';
      },
      handlePageClick(page) {
        const newPage = Number(page);
        if (newPage !== this.internalCurrentPage) {
          this.internalCurrentPage = this.getValidCurrentPage(newPage);
        }
      }
    }
  };
</script>
