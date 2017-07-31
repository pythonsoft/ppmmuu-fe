<template>
  <layout-three-column :leftWidth="201" :rightWidth="439">
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
          <fj-input v-model="startTime"></fj-input>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>结束时间</h4>
          <fj-input v-model="endTime"></fj-input>
        </div>
      </div>
    </template>
    <template slot="center">
      <div class="media-center">
        <div class="media-search-result">
          <span>耗时30秒,结果3000条</span>
        </div>
        <ul class="media-list">
          <li class="media-item-li" v-for="item in items">
            <div class="media-item">
              <img class="media-thumb" src="">
              <span class="media-duration">02:48:22</span>
            </div>
            <div>
              <span class="media-format _480P">480P</span>
              <span class="media-title"><<铿锵三人行>>中国隐形富豪财富足够再建个北京城(许子东 梁文道)</span>
            </div>
            <div class="media-item-category">类别: 评论节目</div>
            <div class="media-item-storage-time">2017-04-14T22:40:09Z</div>
          </li>
        </ul>
        <div class="media-pagination">
          <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
        </div>
      </div>
    </template>
    <template slot="right">
      <div class="media-right">
        <div class="">

        </div>
      </div>
    </template>
  </layout-three-column>
</template>
<script>
  import './mediaCenter.css';
  import threeColumn from '../../component/layout/threeColumn';

  export default {
    data() {
      return {
        defaultRoute: '/',
        keyword: '',
        checkboxCategory: [],
        checkboxTime: [],
        startTime: '',
        endTime: '',
        categories: ['评论节目', '财经节目', '资讯节目'],
        times: ['不限', '3小时内', '5小时内', '7小时内'],
        items: ['a', 'b', 'c', 'd'],
        pageSize: 15,
        total: 0,
        currentPage: 0
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    components: {
      'layout-three-column': threeColumn
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      searchClick() {

      },
      handleCurrentPageChange(){

      }
    }
  };
</script>
