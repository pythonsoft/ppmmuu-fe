<template>
  <two-column :leftWidth="201">
    <template slot="left">
      <div class="media-left">
        <div class="media-search">
          <fj-input placeholder="铿锵三人行" size="mini" v-model="keyword" icon="搜索" @on-icon-click="searchClick" @keydown.native.enter.prevent="searchClick"></fj-input>
        </div>
        <div class="media-category" v-if="categories.length">
          <h4>类别</h4>
          <fj-checkbox-group v-model="checkboxCategory">
            <template v-for="category in categories">
              <div class="category-checkbox">
                <fj-checkbox :label="category">{{category}}</fj-checkbox>
              </div>
            </template>
          </fj-checkbox-group>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>高级</h4>
          <fj-checkbox-group v-model="checkboxTime">
            <template v-for="time in times">
              <div class="category-checkbox">
                <fj-checkbox :label="time">{{time}}</fj-checkbox>
              </div>
            </template>
          </fj-checkbox-group>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>开始时间</h4>
        </div>
      </div>
    </template>
    <template slot="right">

    </template>
  </two-column>
</template>
<script>
  import './mediaCenter.css';
  import TwoColumn from '../../component/layout/twoColumn';

  export default {
    data() {
      return {
        defaultRoute: '/',
        checkboxCategory: [],
        checkboxTime: [],
        categories: ['评论节目', '财经节目', '资讯节目'],
        times: ['不限', '3小时内', '5小时内', '7小时内']

      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    components: {
      'two-column': TwoColumn
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      searchClick() {

      }
    }
  };
</script>
