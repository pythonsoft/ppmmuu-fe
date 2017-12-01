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
<style>
  @import "../../../variables.css";
  .fj-header {
    display: flex;
    align-items: center;
    text-align: center;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 45px;
    color: #fff;
    background-image: linear-gradient(90deg, #00B7CF 0%, #0082C0 100%);
    background-size: 100%;
    background-repeat: no-repeat;
    z-index: var(--z-index-header);
  }
  .fj-header-title {
    flex: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 17px;
    line-height: 1;
  }
  .fj-header-button {
    /*flex: .5;*/
    width: 25px;
    margin: 0 10px;
  }
  .fj-search-bar {
    display: flex;
    flex: 1;
    height: 30px;
    padding: 0 8px;
    background-image: linear-gradient(90deg, #34C7DB 0%, #209FE6 97%);
    border-radius: 50px;
    text-align: left;
  }
  .fj-search-bar-icon {
    font-size: 16px;
    line-height: 30px;
  }
  .fj-search-cancel {
    display: inline-block;
    color: #fff;
    margin: 0 10px;
  }
  .fj-search-input {
    flex: 1;
    margin: 0;
    padding: 0 10px;
    border: 0;
    border-radius: 0;
    outline: 0;
    /*line-height: 1.4;*/
    color: #fff;
    font-size: 14px;
    background-color: transparent;
  }
</style>
