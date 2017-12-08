<template>
  <div class="page-wrap">
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>精选话题</h3>
      </div>
      <div class="topic-box-content">
        <div class="clearfix">
          <h4 :class="['topic-list-tab-item', {'active': activeTopicType === 'bd'}]" @click="activeTopicType = 'bd'">百度热搜</h4>
          <h4 :class="['topic-list-tab-item', {'active': activeTopicType === 'wb'}]" @click="activeTopicType = 'wb'">新浪微博</h4>
        </div>
        <ul v-show="activeTopicType === 'bd'">
          <li class="topic-list-item" v-for="(item, ranking) in realtimeBuzzBd">
            <span :class="[ranking < 3 ? 'num-top' : 'num-normal']">{{ ranking + 1 }}</span>
            <p :class="['topic-name', {'active': item.keyword === keyword}]" @click="keyword = item.keyword">{{ item.keyword }}</p>
            <i :style="{ width: '12px' }" class="iconfont icon-loading" v-if="runningKeywords.indexOf(item.keyword)>=0">&#xe69a;</i>
            <span class="count">{{ item.trends }}</span>
          </li>
        </ul>
        <ul v-show="activeTopicType === 'wb'">
          <li class="topic-list-item" v-for="(item, ranking) in realtimeBuzzWb">
            <span :class="[ranking < 3 ? 'num-top' : 'num-normal']">{{ ranking + 1 }}</span>
            <p :class="['topic-name', {'active': item.keyword === keyword}]" @click="keyword = item.keyword">{{ item.keyword }}</p>
            <span class="count">{{ item.reads }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>地域风向标</h3>
      </div>
      <div class="geo-chart-box" ref="geoChart"></div>
    </div>
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>传播趋势分析</h3>
      </div>
      <div class="spread-trend-chart-box" ref="spreadTrendChart"></div>
    </div>
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>热门报道</h3>
      </div>
      <ul v-show="articleList.length > 0">
        <li v-for="(item, index) in articleList.slice(0, articleLength)" class="article-list-item">
          <div :style="{ overflow: 'hidden' }">
            <a :href="item.url" target="_blank" class="article-title" v-html="item.title"></a>
            <!-- <a href="javascript:;" class="article-title" v-html="item.title" @click="showWebBrowser(item.title, item.url)"></a> -->
            <p class="article-abstract" v-html="item.summary"></p>
            <div class="article-footer">
              <div class="article-source-image">
                <img :src="getFaviconBgImg('热门报道')" width="20">
                <img :ref="item.source" :src="getFavicon(item.source)" :width="getFaviconWidth(item.source)">
              </div>
              <span class="article-info">{{ `${item.source}  ${item.datetime}` }}</span>
            </div>
          </div>
          <span class="article-view-more" v-show="index === articleLength - 1 && articleLength < articleList.length" @click="articleLength = articleList.length">加载更多</span>
        </li>
      </ul>
      <div class="empty-box" v-show="articleList.length === 0">没有数据</div>
    </div>
    <!-- <div class="topic-box board">
      <div class="topic-box-header">
        <h3>传播路径分析</h3>
      </div>
      <div class="spread-path-chart-box" ref="spreadPathChart"></div>
      <div class="empty-box" v-show="showEmptySpreadPath">没有数据</div>
    </div> -->
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>事件脉络</h3>
      </div>
      <div class="empty-box" v-show="timelineData.length === 0">没有数据</div>
      <div v-for="(event, eventIndex) in timelineData" class="event-timeline-item">
        <h4 class="article-title timeline-title">{{ event.name }}</h4>
        <template v-for="(date, index) in event.dateList">
          <div class="timeline-item">
            <span class="timeline-date">{{ date }}</span>
            <span class="timeline-total">热门文章共{{ event.mailuo[date].length }}篇</span>
            <span
              v-show="event.showArticleLength[date].show === 0"
              class="timeline-expand-btn"
              @click="showMoreView(eventIndex, date)"
              >
              展开
              <i class="iconfont icon-arrow-down icon-expand"></i>
            </span>
            <span
              v-show="event.showArticleLength[date].show > 0"
              class="timeline-expand-btn"
              @click="foldView(eventIndex, date)"
              >
              收起
              <i class="iconfont icon-arrow-up icon-expand"></i>
            </span>
          </div>
          <transition name="fj-picker">
            <ul class="timeline-article-list" v-if="event.showArticleLength[date].show > 0">
              <li class="timeline-article-item" v-for="(article, articleIndex) in event.mailuo[date].slice(0, event.showArticleLength[date].show)">
                <a :href="article.url" target="_blank" class="timeline-article-title">{{ article.title }}</a>
                <!-- <a href="javascript:;" class="timeline-article-title" @click="showWebBrowser(article.title, article.url)">{{ article.title }}</a> -->
                <span class="timeline-article-info">{{ `${article.time.split(' ')[1]} &nbsp;&nbsp; ${article.source}` }}</span>
                <span
                  class="article-view-more"
                  v-show="(articleIndex === event.showArticleLength[date].show - 1) && (event.showArticleLength[date].show < event.showArticleLength[date].length)"
                  @click="showMoreView(eventIndex, date)">加载更多</span>
              </li>
            </ul>
          </transition>
        </template>
      </div>
    </div>
    <div class="topic-box board">
      <div class="topic-box-header">
        <h3>舆情观点</h3>
      </div>
      <div class="sentiment-chart-box" ref="sentimentChart"></div>
      <div class="empty-box" v-show="showEmptySentiment">没有数据</div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/chart/line';
  import 'echarts/lib/chart/pie';
  import 'echarts/lib/chart/scatter';
  import 'echarts/lib/chart/effectScatter';
  import 'echarts/lib/chart/graph';

  import 'echarts/lib/component/grid';
  import 'echarts/lib/component/tooltip';
  import 'echarts/lib/component/axisPointer';
  import 'echarts/lib/component/geo';

  import 'echarts/lib/component/title';

  import 'echarts/lib/component/dataZoom';

  import 'echarts/lib/component/markPoint';
  import 'echarts/lib/component/markLine';
  import 'echarts/lib/component/markArea';

  import 'echarts/map/js/china';
  import umpBlue from './umpBlue.json';

  import './index.css';
  import {
    geoOption,
    convertGeoData
  } from '../../../fe/routers/trends/option/geoOption';
  import {
    spreadTrendOption,
    getTrendSeries
  } from '../../../fe/routers/trends/option/spreadTrendOption';
  import {
    spreadPathOption,
    convertGraph
  } from '../../../fe/routers/trends/option/spreadPathOption';
  import {
    sentimentOption,
    convertOpinionData,
    convertSentimentData
  } from '../../../fe/routers/trends/option/sentimentOption';
  import BigdataAPI from '../../../fe/routers/trends/api';

  export default {
    data() {
      return {
        keyword: '',
        runningKeywords: [],
        realtimeBuzzBd: [],
        realtimeBuzzWb: [],
        sentimentObj: {},
        articleList: [],
        timelineData: [],
        articleLength: 5,
        activeHistoryType: '0',
        activeTopicType: 'bd',
        activeMediaType: '热门报道',
        showEmptySpreadPath: true,
        showEmptySentiment: true,
        timeoutID: null
      };
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
              this.$toast('话题正在分析中...');
            }
          }
        }).catch((error) => {
        });
      }
    },
    created() {
      BigdataAPI.getRealtimeBuzz()
        .then((response) => {
          this.realtimeBuzzBd = response.data;
          if (this.realtimeBuzzBd.length > 0) {
            this.keyword = this.realtimeBuzzBd[0].keyword;
          }
        }).catch((error) => {
        });
      BigdataAPI.getRealtimeBuzzWb()
        .then((response) => {
          this.realtimeBuzzWb = response.data;
        }).catch((error) => {
        });
      this.refreshKeywordsStatus();
    },
    mounted() {
      const chartWidth = this.$refs.geoChart.getBoundingClientRect().width;
      const chartHeight = 2 * chartWidth / 3;

      echarts.registerTheme('umpBlue', umpBlue);
      this.geoChart = echarts.init(this.$refs.geoChart, 'umpBlue', { height: chartHeight });
      this.geoChart.setOption(geoOption);

      // this.spreadPathChart = echarts.init(
      //   this.$refs.spreadPathChart,
      //   'umpBlue',
      //   { height: chartHeight }
      // );
      // spreadPathOption.title = {};
      // this.spreadPathChart.setOption(spreadPathOption);

      this.spreadTrendChart = echarts.init(
        this.$refs.spreadTrendChart,
        'umpBlue',
        { height: chartHeight }
      );
      spreadTrendOption.title = {};
      spreadTrendOption.legend.right = 'auto';
      this.spreadTrendChart.setOption(spreadTrendOption);

      this.sentimentChart = echarts.init(
        this.$refs.sentimentChart,
        'umpBlue',
        { height: chartHeight }
      );
      sentimentOption.title = {};
      this.sentimentChart.setOption(sentimentOption);
      this.sentimentChart.on('pieselectchanged', (params)=> {
        this.updateSentiment(params);
      });
    },
    beforeDestroy() {
      if (this.timeoutID) {
        clearTimeout(this.timeoutID);
      }
    },
    methods: {
      getFaviconBgImg(name) {
        return `/static/picture/${name}.png`;
      },
      getFavicon(source) {
        return `/static/picture/${source}.jpg`;
      },
      getFaviconWidth(name) {
        let width = 20;
        let height = 20;
        if (this.$refs[name]) {
          if (this.$refs[name].constructor === Array && this.$refs[name].length > 0) {
            width = this.$refs[name][0].naturalWidth;
            height = this.$refs[name][0].naturalHeight;
          } else {
            width = this.$refs[name].naturalWidth;
            height = this.$refs[name].naturalHeight;
          }
        }
        if (!width || !height) return 20;
        if (width >= height) {
          return 20;
        }
        return 20 * width / height;
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
        this.timeoutID = setTimeout(() => {
          this.refreshKeywordsStatus();
        }, 30000);
      },
      updateAll(v) {
        this.updateArticleList({ media_type: this.activeMediaType, keyword: v });
        this.updateGeoData({ history: this.activeHistoryType, keyword: v });
        this.updateTrends({ keyword: v });
        this.updateTimeline({ keyword: v });
        // this.updateSpreadPathData({ keyword: v });
        this.updateOpinion({ keyword: v });
      },
      updateGeoData(reqData) {
        this.geoChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowGeo({ params: reqData })
        .then((response) => {
          const responseData = response.data;
          const geoData = convertGeoData(responseData);
          let topGeoData = geoData;
          topGeoData = topGeoData.sort(function(a, b) {
            return b.value[2] - a.value[2];
          }).slice(0, 3);
          const newGeoOption = {};
          newGeoOption.series = [{ data: geoData }, { data: topGeoData }];
          this.geoChart.hideLoading();
          this.geoChart.setOption(newGeoOption);
        }).catch((error) => {
          this.geoChart.hideLoading();
        });
      },
      updateTrends(reqData) {
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
      updateSpreadPathData(reqData) {
        this.spreadPathChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowSpread({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          if (!resData.content_graph) {
            this.showEmptySpreadPath = true;
            newOption.series = [{ data: [], edges: [] }];
          } else {
            this.showEmptySpreadPath = false;
            newOption.series = [{
              data: convertGraph(resData.content_graph).nodes,
              edges: resData.content_graph.links
            }];
          }
          this.spreadPathChart.hideLoading();
          this.spreadPathChart.setOption(newOption);
        }).catch((error) => {
          this.spreadPathChart.hideLoading();
        });
      },
      updateOpinion(reqData) {
        this.sentimentChart.showLoading({ color: '#38B1EB' });
        BigdataAPI.getRealtimeFlowOpinion({ params: reqData })
        .then((response) => {
          const resData = response.data;
          const newOption = {};
          if (!resData.opinions) {
            this.showEmptySentiment = true;
            newOption.series = [{ data: [] }, { data: [] }];
            this.sentimentObj = {};
          } else {
            this.showEmptySentiment = false;
            newOption.series = [
              { data: convertSentimentData(resData.total) },
              { data: convertOpinionData(resData.opinions) }
            ];
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
      updateArticleList(reqData) {
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
      updateTimeline(reqData) {
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
              // const show = length > 3 ? 3 : length;
              const show = 0;
              lengthObj[date] = { length, show };
            });
            event.showArticleLength = lengthObj;
          });
          this.timelineData = data;
        }).catch((error) => {
        });
      },
      foldView(eventIndex, date) {
        const dateObj = this.timelineData[eventIndex].showArticleLength[date];
        dateObj.show = 0;
        this.timelineData[eventIndex].showArticleLength[date] = Object.assign({}, dateObj);
      },
      showMoreView(eventIndex, currentDate) {
        const dateList = this.timelineData[eventIndex].dateList;
        const showArticleLength = this.timelineData[eventIndex].showArticleLength;

        dateList.forEach((date) => {
          if (date !== currentDate) {
            showArticleLength[date].show = 0;
          } else {
            showArticleLength[currentDate].show =
              showArticleLength[currentDate].show + 6 > showArticleLength[currentDate].length
              ? showArticleLength[currentDate].length
              : showArticleLength[currentDate].show + 6;

            // this.timelineData[eventIndex].showArticleLength[date] =
            // Object.assign({}, showArticleLength[currentDate]);
          }
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
