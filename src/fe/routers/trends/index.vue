<template>
  <div class="trends-wrapper clearfix">
    <div class="scrum-stage">
      <div class="topic-box board">
        <div class="topic-box-header">
          <h3>精选话题</h3>
          <div class="topic-search-input">
            <fj-input
              placeholder="搜索其他话题"
              v-model="customKeyword"
              @change="()=>{}"
              @keydown.native.enter.prevent="changeKeyword"
              icon="icon-search input-search-icon"
              theme="fill"
              size="small"
              @on-icon-click="changeKeyword"
            ></fj-input>
          </div>
        </div>
        <div class="topic-box-content clearfix">
          <div class="topic-list">
            <h4 class="topic-list-title">百度热搜</h4>
            <ul>
              <li class="topic-list-item clearfix" v-for="item in realtimeBuzzBd">
                <span :class="[item.ranking < 4 ? 'num-top' : 'num-normal']">{{ item.ranking }}</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i :class="['iconfont', item.riseOrFall > 0 ? 'icon-rise' : 'icon-fall']"></i>{{ item.trends }}</span>
                  <p :class="['topic-name', {'active': item.keyword === keyword}]" @click="selectKeyword(item.keyword)">{{ item.keyword }}</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="topic-list">
            <h4 class="topic-list-title">新浪微博</h4>
            <ul>
              <li class="topic-list-item clearfix">
                <span class="num-top">1</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">2</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">3</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">4</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">5</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="article-box board">
        <fj-tabs v-model="activeMediaType">
          <fj-tab-pane
            v-for="tab in MEDIA_TYPE"
            :label="tab.label"
            :name="tab.name"
            :key="tab.name">
            <ul v-show="articleList.length > 0">
              <li v-for="item in articleList" class="article-list-item">
                <div class="article-source-image">
                  <img v-if="item.favicon" src="" width="42" height="42">
                </div>
                <div :style="{ overflow: 'hidden' }">
                  <a :href="item.url" target="_blank" class="article-title" v-html="item.title"></a>
                  <p class="article-abstract" v-html="item.summary"></p>
                  <span class="article-info">{{ `${item.source}  ${item.datetime}` }}</span>
                </div>
              </li>
            </ul>
            <div class="empty-box" v-show="articleList.length === 0">没有数据</div>
          </fj-tab-pane>
        </fj-tabs>
      </div>
    </div>
    <div class="scrum-stage">
      <div class="geo-box board">
        <h3>地域风向标</h3>
        <div class="geo-chart-box" ref="geoChart"></div>
        <div class="geo-news-box">
          <fj-tabs v-model="activeHistoryType">
            <fj-tab-pane
              v-for="tab in HISTORY_TYPE"
              :label="tab.label"
              :name="tab.name"
              :key="tab.label + tab.name">
              <ul class="geo-list clearfix">
                <li
                  v-for="area in areaList"
                  :class="{ 'geo-item-on' : activeArea === area.name }"
                  @click="activeArea = area.name">
                  {{ area.name }}
                </li>
              </ul>
              <ul class="geo-article-list" v-if="areaNewsData[activeArea]">
                <li v-for="item in areaNewsData[activeArea].news" class="clearfix">
                  <a class="geo-article-title" v-html="item.title" :href="item.url" target="_blank"></a>
                  <span class="geo-article-time">{{ item.datetime }}</span>
                </li>
              </ul>
              <div class="empty-box" v-show="!areaNewsData[activeArea] || areaNewsData[activeArea].news.length === 0">没有数据</div>
            </fj-tab-pane>
          </fj-tabs>
        </div>
      </div>
      <div class="spread-path-box board">
        <div class="spread-path-chart-box" ref="spreadPathChart"></div>
      </div>
    </div>
    <div class="scrum-stage">
      <div class="spread-trend-box board">
        <div class="spread-trend-chart-box" ref="spreadTrendChart"></div>
      </div>
      <div class="event-timeline-box board">
        <h3>事件脉络</h3>
        <div v-for="event in timelineData">
          <h4 class="timeline-title">
            {{ event.name }}
            <i class="iconfont icon-clock timeline-title-icon"></i>
          </h4>

          <template v-for="date in event.dateList">
          <span class="timeline-date">{{ date }}</span>
          <span class="timeline-total">热门文章共{{ event.mailuo[date].length }}篇</span>
          <!-- <span class="timeline-fold-btn">收起 <i class="iconfont icon-arrow-right icon-fold"></i></span> -->
          <ul class="timeline-article-list">
            <li class="timeline-article-item" v-for="article in event.mailuo[date]">
              <a :href="article.url" target="_blank" class="timeline-article-title">{{ article.title }}</a>
              <span class="timeline-article-info">{{ `${article.time.split(' ')[1]} &nbsp;&nbsp; ${article.source}` }}</span>
            </li>
            <!-- <li class="timeline-article-item">
              <span class="timeline-view-more">加载更多</span>
            </li> -->
          </ul>
          </template>
        </div>
      </div>
      <div class="sentiment-box board">
        <div class="sentiment-chart-box" ref="sentimentChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts';

  // import echarts from 'echarts/lib/echarts';
  // import 'echarts/lib/component/tooltip';
  // import 'echarts/lib/chart/line';
  // import 'echarts/lib/chart/pie';
  // import 'echarts/lib/chart/scatter';

  // import 'echarts/lib/chart/map';
  // import 'echarts/lib/chart/graph';
  // import 'echarts/lib/chart/effectScatter';

  // import 'echarts/lib/component/graphic';
  // import 'echarts/lib/component/grid';
  // import 'echarts/lib/component/legendScroll';
  // import 'echarts/lib/component/tooltip';
  // import 'echarts/lib/component/axisPointer';
  // import 'echarts/lib/component/geo';
  // import 'echarts/lib/component/brush';

  // import 'echarts/lib/component/title';

  // import 'echarts/lib/component/dataZoom';

  // import 'echarts/lib/component/markPoint';
  // import 'echarts/lib/component/markLine';
  // import 'echarts/lib/component/markArea';

  // import 'echarts/lib/component/timeline';
  // import 'echarts/lib/component/toolbox';

  import 'echarts/map/js/china';
  import './umpBlue';
  import './index.css';
  import BigdataAPI from './api';
  import { geoOption, convertGeoData } from './option/geoOption';
  import { spreadPathOption, convertGraph } from './option/spreadPathOption';
  import { spreadTrendOption, getTrendSeries } from './option/spreadTrendOption';
  import { sentimentOption, convertOpinionData, convertSentimentData } from './option/sentimentOption';

  const MEDIA_TYPE = [
    { label: '热门报道', name: '热门报道' },
    { label: '新闻', name: '新闻' },
    { label: '百度', name: '百度' },
    { label: '微博', name: '微博' },
    { label: '微信', name: '微信' },
    { label: '论坛', name: '论坛' },
    { label: '博客', name: '博客' }
  ];
  const HISTORY_TYPE = [
    { label: '实时热点', name: '0' },
    { label: '今日热点', name: '1' },
    { label: '七日热点', name: '7' }
  ];

  export default {
    data() {
      return {
        MEDIA_TYPE: MEDIA_TYPE,
        HISTORY_TYPE: HISTORY_TYPE,
        activeHistoryType: '0',
        activeMediaType: '热门报道',
        keyword: '',
        customKeyword: '',
        realtimeBuzzBd: [],
        articleList: [],
        areaList: [],
        activeArea: '',
        areaNewsData: {},
        sentimentObj: {},
        timelineData: []
      };
    },
    created() {
      BigdataAPI.getRealtimeBuzz({ params: { size: 30 } })
        .then((response) => {
          this.realtimeBuzzBd = response.data;
          if (this.realtimeBuzzBd.length > 0) {
            this.keyword = this.realtimeBuzzBd[0].keyword;
          }
        }).catch((error) => {
        });
    },
    mounted() {
      this.geoChart = echarts.init(this.$refs.geoChart, 'umpBlue');
      this.geoChart.setOption(geoOption);

      this.spreadPathChart = echarts.init(this.$refs.spreadPathChart, 'umpBlue');
      this.spreadPathChart.setOption(spreadPathOption);

      this.spreadTrendChart = echarts.init(this.$refs.spreadTrendChart, 'umpBlue');
      this.spreadTrendChart.setOption(spreadTrendOption);

      this.sentimentChart = echarts.init(this.$refs.sentimentChart, 'umpBlue');
      this.sentimentChart.setOption(sentimentOption);
      this.sentimentChart.on('pieselectchanged', (params)=> {
        this.updateSentiment(params);
      });
    },
    watch: {
      keyword(v) {
        this.updateArticleList({ media_type: this.activeMediaType, keyword: v });
        this.updateGeoData({ history: this.activeHistoryType, keyword: v });
        this.updateTrends({ keyword: v });
        this.updateTimeline({ keyword: v });
        this.updateSpreadPathData({ keyword: v });
        this.updateOpinion({ keyword: v });
      },
      activeMediaType(v) {
        this.updateArticleList({ media_type: v, keyword: this.keyword });
      },
      activeHistoryType(v) {
        this.updateGeoData({ history: v, keyword: this.keyword });
      }
    },
    methods: {
      selectKeyword(keyword) {
        this.keyword = keyword;
      },
      changeKeyword() {
        this.keyword = this.customKeyword;
      },
      updateArticleList(reqData) {
        reqData.keyword = '演员许敬义病逝';
        BigdataAPI.getRealtimeFlowNews({ params: reqData })
        .then((response) => {
          this.articleList = response.data.map(function(item) {
            const length = item.summary.length;
            item.summary = item.summary.slice(0, 100);
            if (length > 100) item.summary += '...';
            return item;
          });
        }).catch((error) => {
        });
      },
      updateGeoData(reqData) {
        reqData.keyword = '演员许敬义病逝';
        this.geoChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowGeo({ params: reqData })
        .then((response) => {
          const responseData = response.data;
          this.areaNewsData = responseData;

          const geoData = convertGeoData(responseData);
          let topGeoData = geoData;
          topGeoData = topGeoData.sort(function(a, b) {
            return b.value[2] - a.value[2];
          }).slice(0, 3);
          const newGeoOption = {};
          newGeoOption.series = [{ data: geoData }, { data: topGeoData }];
          this.geoChart.hideLoading();
          this.geoChart.setOption(newGeoOption);

          const keys = Object.keys(responseData);
          const areaList = [];
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            areaList.push(Object.assign({ name: key }, { count: responseData[key].count }));
          }
          areaList.sort(function(a, b) {
            return b.count - a.count;
          });
          this.areaList = areaList;
          this.activeArea = this.areaList.length > 0
            ? this.areaList[0].name
            : '';
        }).catch((error) => {
        });
      },
      updateTrends(reqData) {
        reqData.keyword = '全国文明城市公布';
        this.spreadTrendChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowTrends({ params: reqData })
        .then((response) => {
          const resData = response.data;
          this.spreadTrendChart.hideLoading();
          this.spreadTrendChart.setOption({ series: getTrendSeries(resData) });
        }).catch((error) => {
        });
      },
      updateTimeline(reqData) {
        reqData.keyword = '意大利无缘世界杯';
        BigdataAPI.getRealtimeFlowTimeline({ params: reqData })
        .then((response) => {
          const data = response.data;
          data.forEach(function(event) {
            const dateList = Object.keys(event.mailuo);
            dateList.sort(function(a, b) {
              const timeA = new Date(a).getTime();
              const timeB = new Date(b).getTime();
              return timeB - timeA;
            });
            event.dateList = dateList;
          });
          this.timelineData = data;
        }).catch((error) => {
        });
      },
      updateSpreadPathData(reqData) {
        reqData.keyword = '全国文明城市公布';
        this.spreadPathChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowSpread({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          newOption.series = [{ data: convertGraph(resData.content_graph).nodes, edges: resData.content_graph.links }];
          this.spreadPathChart.hideLoading();
          this.spreadPathChart.setOption(newOption);
        }).catch((error) => {
        });
      },
      updateOpinion(reqData) {
        reqData.keyword = '意大利无缘世界杯';
        this.sentimentChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowOpinion({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          newOption.series = [{ data: convertSentimentData(resData.total) }, { data: convertOpinionData(resData.opinions) }];
          this.sentimentChart.hideLoading();
          this.sentimentChart.setOption(newOption);
          const sentimentObj = { total: resData.total };
          resData.opinions.forEach(function(opinion) {
            sentimentObj[opinion.title] = opinion.sentiment;
          });
          this.sentimentObj = sentimentObj;

        }).catch((error) => {
        });
      },
      updateSentiment(params) {
        const name = params.name;
        const newOption = {};
        if (params.selected[name]) {
          newOption.series = [{ data: convertSentimentData(this.sentimentObj[name]) }];
        } else {
          newOption.series = [{ data: convertSentimentData(this.sentimentObj.total) }];
        }
        this.sentimentChart.setOption(newOption);
      }
    }
  };
</script>
