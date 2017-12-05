<template>
  <header class="fj-header">
    <div class="fj-header-button">
      <i class="iconfont icon-phoenixtv"></i>
    </div>
    <template v-if="contentType === 'default'">
      <h1 class="fj-header-title">{{ title }}</h1>
      <div class="fj-header-button" @click="changeContentType('searchInput')">
        <i class="iconfont icon-search-left"></i>
      </div>
    </template>
    <template v-else>
      <div class="fj-search-bar">
        <i class="iconfont icon-search-left fj-search-bar-icon"></i>
        <input
          ref="input"
          type="text"
          class="fj-search-input"
          placeholder="请输入关键词"
          :value="currentValue"
          @focus="handleFocus"
          @input="handleInput"
          @keyup.enter.prevent="">
          <i
            v-show="showClearBtn"
            class="iconfont icon-circle-error fj-search-bar-icon"
            @click.stop.prevent="resetCurrentValue"></i>
      </div>
      <span class="fj-search-cancel" @click="changeContentType('default')">取消</span>
    </template>
  </header>
</template>
<script>
  export default {
    name: 'FjHeader',
    props: {
      title: String,
      value: {},
      defaultContentType: {
        type: String,
        default: 'default'
      },
      showClearBtn: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        contentType: this.defaultContentType,
        currentValue: this.value
      };
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
      contentType(val) {
        if (val === 'searchInput') {
          this.$nextTick(() => {
            this.$refs.input.focus();
          });
        }
      },
      defaultContentType(val) {
        this.contentType = val;
      }
    },
    methods: {
      changeContentType(type) {
        this.contentType = type;
        this.$emit('on-content-type-change', type);
      },
      handleSearch() {
        this.$emit('search');
      },
      handleInput(e) {
        const value = e.target.value;
        this.currentValue = value;
        this.$emit('input', value);
      },
      handleFocus(e) {
        this.$emit('input-focus');
      },
      resetCurrentValue() {
        this.currentValue = '';
        this.$emit('input', '');
      }
    }
  };
</script>
