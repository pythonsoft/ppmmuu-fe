import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/base.css';
import routes from './routers/routes';
import { formatTime, valueLengthLimit } from './common/utils';

// const reportAPI = require('./api/report');

Vue.use(VueRouter);

Vue.filter('formatTime', formatTime);
Vue.filter('valueLengthLimit', valueLengthLimit);

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '';
  next();
});

new Vue({
  router,
  template: `
    <div id="app">
      <router-view></router-view>
    </div>
  `
}).$mount('#app');


function getPerformanceTiming() {
  if (!window.performance) {
    console.log('浏览器不支持 window.performance');
    return;
  }
  const t = window.performance.timing;
  const timeline = {};

  // TCP建立连接完成握手时间
  timeline.connect = t.connectEnd - t.connectStart;
  // Time To First Byte(白屏时间
  timeline.ttfb = t.responseStart - t.navigationStart;
  // request请求耗时
  timeline.requestTime = t.responseEnd - t.requestStart;

  // Time To Interactive(首次可持续交互时间
  timeline.tti = t.domInteractive - t.requestStart;
  // 解析dom树耗时
  timeline.domReady = t.domComplete - t.responseEnd;
  // 页面加载时间
  timeline.loadPage = t.loadEventEnd - t.navigationStart;
  return timeline;
}
function formatFn() {
  const comment = {
    connect: 'TCP建立连接完成握手耗时',
    ttfb: '白屏时间',
    requestTime: 'request请求耗时',
    tti: '首次可持续交互时间',
    domReady: '解析dom树耗时',
    loadPage: '页面加载时间'
  };
  const timeline = getPerformanceTiming();
  const keys = Object.keys(comment);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    result[key] = { name: comment[key], value: timeline[key] };
    console.log(comment[key]+'('+key+')'+': '+timeline[key]);
  }
  return result;
}
// const onloadFn = window.onload;
// window.onload = function () {
//   onloadFn && onloadFn();
//   setTimeout(()=> {
//     const data = formatFn();
//     const time = formatTime(new Date().getTime());
//     reportAPI.reportInfo({ info: data, time: time, router: window.location.pathname }).then((res) => {});
//   }, 500);
// };
window.getMeasure = function () {
  const measure = window.performance.getEntriesByType('measure');
  measure.forEach(function(item) {
    console.log(`${item.name}: ${item.duration}`);
  });
}
