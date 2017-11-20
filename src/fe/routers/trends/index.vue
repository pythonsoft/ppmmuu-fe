<template>
  <div class="trends-wrapper clearfix">
    <div class="scrum-stage">
      <div class="topic-box board">
        <div class="topic-box-header">
          <h3>精选话题</h3>
          <!-- <div class="topic-search-input">
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
          </div> -->
        </div>
        <div class="topic-box-content clearfix">
          <div class="topic-list">
            <h4 class="topic-list-title">百度热搜</h4>
            <ul>
              <li class="topic-list-item clearfix" v-for="(item, ranking) in realtimeBuzzBd">
                <span :class="[ranking < 3 ? 'num-top' : 'num-normal']">{{ ranking + 1 }}</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i :class="['iconfont', item.riseOrFall > 0 ? 'icon-rise' : 'icon-fall']"></i>{{ item.trends }}</span>
                  <p :class="['topic-name', {'active': item.keyword === keyword}]" @click="selectKeyword(item.keyword)">{{ item.keyword }}</p>
                  <i :style="{ width: '12px' }" class="iconfont fj-icon-loading" v-if="runningKeywords.indexOf(item.keyword)>=0">&#xe674;</i>
                </div>
              </li>
            </ul>
          </div>
          <div class="topic-list">
            <h4 class="topic-list-title">新浪微博</h4>
            <ul>
              <li class="topic-list-item clearfix" v-for="(item, ranking) in realtimeBuzzWb">
                <span :class="[ranking < 3 ? 'num-top' : 'num-normal']">{{ ranking + 1 }}</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count">{{ item.reads }}</span>
                  <p :class="['topic-name', {'active': item.keyword === keyword}]" @click="selectKeyword(item.keyword)">{{ item.keyword }}</p>
                  <i :style="{ width: '12px' }" class="iconfont fj-icon-loading" v-if="runningKeywords.indexOf(item.keyword)>=0">&#xe674;</i>
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
                  <img :src="getFaviconBgImg(tab.label)" width="42">
                  <img :ref="item.source" :src="getFavicon(item.source)" :width="getFaviconWidth(item.source)">
                </div>
                <div :style="{ overflow: 'hidden' }">
                  <!--<a :href="item.url" target="_blank" class="article-title" v-html="item.title" @click="showWebBrowser(item.title, item.url)"></a>-->
                  <a href="javascript:;" class="article-title" v-html="item.title" @click="showWebBrowser(item.title, item.url)"></a>
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
                  <!--<a class="geo-article-title" v-html="item.title" :href="item.url" target="_blank"></a>-->
                  <a href="javascript:;" class="geo-article-title" v-html="item.title" @click="showWebBrowser(item.title, item.url)"></a>
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
        <div class="empty-box" v-show="showEmptySpreadPath">没有数据</div>
      </div>
    </div>
    <div class="scrum-stage">
      <div class="spread-trend-box board">
        <div class="spread-trend-chart-box" ref="spreadTrendChart"></div>
      </div>
      <div class="event-timeline-box board">
        <h3>事件脉络</h3>
        <div class="empty-box" v-show="timelineData.length === 0">没有数据</div>
        <div v-for="(event, eventIndex) in timelineData">
          <h4 class="timeline-title">
            {{ event.name }}
            <i class="iconfont icon-clock timeline-title-icon"></i>
          </h4>

          <template v-for="(date, index) in event.dateList">
            <span class="timeline-date">{{ date }}</span>
            <span class="timeline-total">热门文章共{{ event.mailuo[date].length }}篇</span>
            <!-- <span
              class="timeline-fold-btn"
              @click="foldView(eventIndex, date)"
              v-show="event.showArticleLength[date].length>3 && event.showArticleLength[date].show > 3">
              收起
              <i class="iconfont icon-arrow-right icon-fold"></i>
            </span> -->
            <span
              class="timeline-fold-btn"
              @click="foldView(eventIndex, date)"
              >
              收起
              <i class="iconfont icon-arrow-right icon-fold"></i>
            </span>
            <ul class="timeline-article-list">
              <li class="timeline-article-item" v-for="article in event.mailuo[date].slice(0, event.showArticleLength[date].show)">
                <!--<a :href="article.url" target="_blank" class="timeline-article-title" @click="showWebBrowser(article)">{{ article.title }}</a>-->
                <a href="javascript:;" class="timeline-article-title" @click="showWebBrowser(article.title, article.url)">{{ article.title }}</a>
                <span class="timeline-article-info">{{ `${article.time.split(' ')[1]} &nbsp;&nbsp; ${article.source}` }}</span>
              </li>
              <li class="timeline-article-item" v-show="event.showArticleLength[date].show < event.showArticleLength[date].length">
                <span class="timeline-view-more" @click="showMoreView(eventIndex, date)">加载更多</span>
              </li>
            </ul>
          </template>
        </div>
      </div>
      <div class="sentiment-box board">
        <div class="sentiment-chart-box" ref="sentimentChart">
        </div>
        <div class="empty-box" v-show="showEmptySentiment">没有数据</div>
      </div>
    </div>
    <web-browser
      :visible.sync="webBrowserVisible"
      :title="webBrowserTitle"
      :url="webBrowserUrl"
      @close="webBrowserClose"
    ></web-browser>
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
  import '../../static/umpBlue';
  import './index.css';
  import BigdataAPI from './api';
  import { geoOption, convertGeoData } from './option/geoOption';
  import { spreadPathOption, convertGraph } from './option/spreadPathOption';
  import { spreadTrendOption, getTrendSeries } from './option/spreadTrendOption';
  import { sentimentOption, convertOpinionData, convertSentimentData } from './option/sentimentOption';
  import WebBrowser from "../../component/higherOrder/webBrowser/index.vue";

  const MEDIA_TYPE = [
    { label: '热门报道', name: '热门报道' },
    { label: '新闻', name: '新闻' },
    { label: '百度', name: '网页' },
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
    components: {WebBrowser},
    data() {
      return {
        MEDIA_TYPE: MEDIA_TYPE,
        HISTORY_TYPE: HISTORY_TYPE,
        activeHistoryType: '0',
        activeMediaType: '热门报道',
        keyword: '',
        customKeyword: '',
        realtimeBuzzBd: [],
        realtimeBuzzWb: [],
        articleList: [],
        areaList: [],
        activeArea: '',
        areaNewsData: {},
        sentimentObj: {},
        timelineData: [],
        showEmptySentiment: false,
        showEmptySpreadPath: false,
        runningKeywords: [],
        webBrowserVisible: false,
        webBrowserTitle: '',
        webBrowserUrl: '',
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
      BigdataAPI.getRealtimeBuzzWb({ params: { size: 30 } })
        .then((response) => {
          this.realtimeBuzzWb = response.data;
        }).catch((error) => {
        });
      this.refreshKeywordsStatus();
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
        BigdataAPI.getKeywordStatus({ params: { keywords: v } })
        .then((response) => {
          if (response.data[0].status === 'ok') {
            this.updateAll(v);
          } else {
            if(this.runningKeywords.indexOf(v) < 0) {
              this.runningKeywords.push(v);
            } else {
              this.$message.warning('话题正在分析中...');
            }
          }
        }).catch((error) => {
        });
      },
      activeMediaType(v) {
        this.updateArticleList({ media_type: v, keyword: this.keyword });
      },
      activeHistoryType(v) {
        this.updateGeoData({ history: v, keyword: this.keyword });
      }
    },
    methods: {
      webBrowserClose() {
        this.webBrowserVisible = false;
      },
      showWebBrowser(title, url) {
        this.webBrowserVisible = true;
        this.webBrowserTitle = title;
        this.webBrowserUrl = url;
      },
      refreshKeywordsStatus() {
        if (this.runningKeywords.length > 0) {
          BigdataAPI.getKeywordStatus({ params: { keywords: this.runningKeywords.join(',') } })
          .then((response) => {
            const responseData = response.data;
            responseData.forEach((item) => {
              if (item.status === 'ok') {
                const index = this.runningKeywords.indexOf(item.keyword);
                this.runningKeywords.splice(index, 1);
              }
            });
          }).catch((error) => {
          });
        }
        setTimeout(() => {
          this.refreshKeywordsStatus();
        }, 30000);
      },
      getFaviconBgImg(name) {
        return `/static/picture/${name}.png`;
      },
      getFavicon(source) {
        return `/static/picture/${source}.jpg`;
      },
      getFaviconWidth(name) {
        let width = 42;
        let height = 42;
        if (this.$refs[name]) {
          if (this.$refs[name].constructor === Array && this.$refs[name].length > 0) {
            width = this.$refs[name][0].naturalWidth;
            height = this.$refs[name][0].naturalHeight;
          } else {
            width = this.$refs[name].naturalWidth;
            height = this.$refs[name].naturalHeight;
          }
        }
        if (!width || !height) return 42;
        if (width >= height) {
          return 42;
        }
        return 42 * width / height;
      },
      foldView(eventIndex, date) {
        const dateObj = this.timelineData[eventIndex].showArticleLength[date];
        dateObj.show = 0;
        this.timelineData[eventIndex].showArticleLength[date] = Object.assign({}, dateObj);
      },
      showMoreView(eventIndex, date) {
        const dateObj = this.timelineData[eventIndex].showArticleLength[date];
        dateObj.show = dateObj.show + 6 > dateObj.length ? dateObj.length : dateObj.show + 6;
        this.timelineData[eventIndex].showArticleLength[date] = Object.assign({}, dateObj);
      },
      selectKeyword(keyword) {
        this.keyword = keyword;
      },
      changeKeyword() {
        this.keyword = this.customKeyword;
      },
      updateAll(v) {
        this.updateArticleList({ media_type: this.activeMediaType, keyword: v });
        this.updateGeoData({ history: this.activeHistoryType, keyword: v });
        this.updateTrends({ keyword: v });
        this.updateTimeline({ keyword: v });
        this.updateSpreadPathData({ keyword: v });
        this.updateOpinion({ keyword: v });
      },
      updateArticleList(reqData) {
        // reqData.keyword = '';
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
        // reqData.keyword = '';
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
          this.geoChart.hideLoading();
        });
      },
      updateTrends(reqData) {
        // reqData.keyword = '';
        this.spreadTrendChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowTrends({ params: reqData })
        .then((response) => {
          const resData = response.data;
          this.spreadTrendChart.hideLoading();
          this.spreadTrendChart.setOption({ series: getTrendSeries(resData) });
        }).catch((error) => {
          this.spreadTrendChart.hideLoading();
        });
      },
      updateTimeline(reqData) {
        // reqData.keyword = '';
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
            const lengthObj = {};
            dateList.forEach(function(date) {
              const length = event.mailuo[date].length;
              const show = length > 3 ? 3 : length;
              lengthObj[date] = { length, show };
            });
            event.showArticleLength = lengthObj;
          });
          this.timelineData = data;
        }).catch((error) => {
        });
      },
      updateSpreadPathData(reqData) {
        // reqData.keyword = '';
        this.spreadPathChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowSpread({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          if (resData.constructor === Array && resData.length === 0) {
            this.showEmptySpreadPath = true;
            newOption.series = [{ data: [], edges: [] }];
          } else {
            this.showEmptySpreadPath = false;
            newOption.series = [{ data: convertGraph(resData.content_graph).nodes, edges: resData.content_graph.links }];
          }
          this.spreadPathChart.hideLoading();
          this.spreadPathChart.setOption(newOption);
        }).catch((error) => {
          this.spreadPathChart.hideLoading();
        });
      },
      updateOpinion(reqData) {
        // reqData.keyword = '';
        this.sentimentChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowOpinion({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          if (resData.constructor === Array && resData.length === 0) {
            this.showEmptySentiment = true;
            newOption.series = [{ data: [] }, { data: [] }];
            this.sentimentObj = {};
          } else {
            this.showEmptySentiment = false;
            newOption.series = [{ data: convertSentimentData(resData.total) }, { data: convertOpinionData(resData.opinions) }];
            const sentimentObj = { total: resData.total };
            resData.opinions.forEach(function(opinion) {
              sentimentObj[opinion.title] = opinion.sentiment;
            });
            this.sentimentObj = sentimentObj;
          }
          this.sentimentChart.hideLoading();
          this.sentimentChart.setOption(newOption);
        }).catch((error) => {
          this.sentimentChart.hideLoading();
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
