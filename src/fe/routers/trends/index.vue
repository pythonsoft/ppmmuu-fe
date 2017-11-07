<template>
  <div class="trends-wrapper clearfix">
    <div class="scrum-stage">
      <div class="topic-box board">
        <div class="topic-box-header">
          <h3>精选话题</h3>
        </div>
        <div class="topic-box-content clearfix">
          <div class="topic-list">
            <h4 class="topic-list-title">百度热搜</h4>
            <ul>
              <li class="topic-list-item clearfix">
                <span class="num-top">1</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i class="iconfont icon-rise"></i>48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">2</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i class="iconfont icon-fall"></i>48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">3</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i class="iconfont icon-fall"></i>48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">4</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i class="iconfont icon-fall"></i>48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
                </div>
              </li>
              <li class="topic-list-item clearfix">
                <span class="num-normal">5</span>
                <div :style="{ overflow: 'hidden' }">
                  <span class="count"><i class="iconfont icon-fall"></i>48856</span>
                  <p class="topic-name">贝加尔湖现死海豹</p>
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
        <fj-tabs v-model="activeTabName">
          <fj-tab-pane label="热门报道" name="tab1">
            <ul>
              <li class="article-list-item">
                <div class="article-source-image">
                  <img src="" width="42" height="42">
                </div>
                <div :style="{ overflow: 'hidden' }">
                  <h4 class="article-title">因乐视网IPO财务造假，发审委多人被抓；姜姓律师因另案被抓</h4>
                  <p class="article-abstract">多名发审委委员被采取强制措施，警方顺藤摸瓜，案件慢慢发酵，更多人深陷其中。消息人...</p>
                  <span class="article-info">人民网 &nbsp;&nbsp; 2017-06-12 15:34</span>
                </div>
              </li>
              <li class="article-list-item">
                <div class="article-source-image">
                  <img src="" width="42" height="42">
                </div>
                <div :style="{ overflow: 'hidden' }">
                  <h4 class="article-title">因乐视网IPO财务造假，发审委多人被抓；姜姓律师因另案被抓</h4>
                  <p class="article-abstract">多名发审委委员被采取强制措施，警方顺藤摸瓜，案件慢慢发酵，更多人深陷其中。消息人...</p>
                  <span class="article-info">人民网 &nbsp;&nbsp; 2017-06-12 15:34</span>
                </div>
              </li>
              <li class="article-list-item">
                <div class="article-source-image">
                  <img src="" width="42" height="42">
                </div>
                <div :style="{ overflow: 'hidden' }">
                  <h4 class="article-title">因乐视网IPO财务造假，发审委多人被抓；姜姓律师因另案被抓</h4>
                  <p class="article-abstract">多名发审委委员被采取强制措施，警方顺藤摸瓜，案件慢慢发酵，更多人深陷其中。消息人...</p>
                  <span class="article-info">人民网 &nbsp;&nbsp; 2017-06-12 15:34</span>
                </div>
              </li>
            </ul>
          </fj-tab-pane>
          <fj-tab-pane label="新闻" name="tab2">新闻</fj-tab-pane>
          <fj-tab-pane label="百度" name="tab3">百度</fj-tab-pane>
          <fj-tab-pane label="微博" name="tab4">微博</fj-tab-pane>
          <fj-tab-pane label="微信" name="tab5">微信</fj-tab-pane>
          <fj-tab-pane label="论坛" name="tab6">论坛</fj-tab-pane>
          <fj-tab-pane label="博客" name="tab7">博客</fj-tab-pane>
        </fj-tabs>
      </div>
    </div>
    <div class="scrum-stage">
      <div class="geo-box board">
        <h3>地域风向标</h3>
        <div class="geo-chart-box" ref="geoChart"></div>
        <div class="geo-news-box">
          <fj-tabs v-model="activeTabName">
            <fj-tab-pane label="实时热点" name="tab1">
              <ul class="geo-list clearfix">
                <li class="geo-item-on">全域</li>
                <li>广州</li>
                <li>深圳</li>
                <li>佛山</li>
              </ul>
              <ul class="geo-article-list">
                <li class="clearfix">
                  <h4 class="geo-article-title">今年国庆，很多徒步队伍先后进入这条探险级新线路——念青东，数百座海拔 6000 米以</h4>
                  <span class="geo-article-time">2017-06-12 15:34</span>
                </li>
                <li class="clearfix">
                  <h4 class="geo-article-title">今年国庆，很多徒步队伍先后进入这条探险级新线路——念青东，数百座海拔 6000 米以</h4>
                  <span class="geo-article-time">2017-06-12 15:34</span>
                </li>
                <li class="clearfix">
                  <h4 class="geo-article-title">今年国庆，很多徒步队伍先后进入这条探险级新线路——念青东，数百座海拔 6000 米以</h4>
                  <span class="geo-article-time">2017-06-12 15:34</span>
                </li>
              </ul>
            </fj-tab-pane>
            <fj-tab-pane label="今日热点" name="tab6">今日热点</fj-tab-pane>
            <fj-tab-pane label="七日热点" name="tab7">七日热点</fj-tab-pane>
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
        <div class="clearfix">
          <span class="timeline-date">2017-10-18</span>
          <span class="timeline-fold-btn">收起 <i class="iconfont icon-arrow-right icon-fold"></i></span>
          <ul class="timeline-article-list">
            <li class="timeline-article-item">
              <h4 class="timeline-article-title">学习十九大精神进行时｜成都市教育局专题传达学习党的十九大及全市传达学习会精神</h4>
              <span class="timeline-article-info">19:26 成都教育发布</span>
            </li>
            <li class="timeline-article-item">
              <h4 class="timeline-article-title">学习十九大精神进行时</h4>
              <span class="timeline-article-info">19:26 成都教育发布</span>
            </li>
            <li class="timeline-article-item">
              <span class="timeline-view-more">加载更多</span>
            </li>
          </ul>
        </div>
        <div class="clearfix">
          <span class="timeline-date">2017-10-19</span>
          <span class="timeline-fold-btn">收起 <i class="iconfont icon-arrow-right icon-fold"></i></span>
          <ul class="timeline-article-list">
            <li class="timeline-article-item">
              <h4 class="timeline-article-title">学习十九大精神进行时｜成都市教育局专题传达学习党的十九大及全市传达学习会精神</h4>
              <span class="timeline-article-info">19:26 成都教育发布</span>
            </li>
            <li class="timeline-article-item">
              <h4 class="timeline-article-title">学习十九大精神进行时</h4>
              <span class="timeline-article-info">19:26 成都教育发布</span>
            </li>
            <li class="timeline-article-item">
              <span class="timeline-view-more">加载更多</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="sentiment-box board">
        <div class="sentiment-chart-box" ref="sentimentChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import './index.css';
  import echarts from 'echarts';
  import china from 'echarts/map/js/china';
  import { geoOption } from './option/geoOption';
  import { spreadPathOption } from './option/spreadPathOption';
  import { spreadTrendOption } from './option/spreadTrendOption';
  import { sentimentOption } from './option/sentimentOption';

  export default {
    data() {
      return {
        activeTabName: 'tab1'
      };
    },
    mounted() {
      const geoChart = echarts.init(this.$refs.geoChart);
      geoChart.setOption(geoOption);

      const spreadPathChart = echarts.init(this.$refs.spreadPathChart);
      spreadPathChart.setOption(spreadPathOption);

      const spreadTrendChart = echarts.init(this.$refs.spreadTrendChart);
      spreadTrendChart.setOption(spreadTrendOption);

      const sentimentChart = echarts.init(this.$refs.sentimentChart);
      sentimentChart.setOption(sentimentOption);
    }
  };
</script>
