import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/base.css';
import routes from './routers/routes';
import { formatTime, valueLengthLimit, ensureLocalData } from './common/utils';

const api = require('./api/user');


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
  if(to.fullPath === '/login') {
    next();
  }else {
    api.getUserAuth().then((res) => {
      ensureLocalData(res.data);
      unmountLoadingBox();
      next();
    }).catch(() => {
      unmountLoadingBox();
      mountRefreshBox();
    });
  }
});

const unmountLoadingBox = function() {
  const loadingBox = document.getElementById('app-loading-bar-mask');
  loadingBox.parentNode.removeChild(loadingBox);
};
const mountRefreshBox = function() {
  const app = document.getElementById('app');
  const refreshBox = document.createElement('div');
  const refreshIcon = document.createElement('span');
  const refreshText = document.createElement('p');
  refreshBox.className = 'app-refresh-wrap';
  refreshIcon.className = 'iconfont icon-refresh';
  refreshText.textContent = '点击刷新';

  refreshBox.appendChild(refreshIcon);
  refreshBox.appendChild(refreshText);
  app.appendChild(refreshBox);
  refreshIcon.addEventListener('click', function() {
    location.reload();
  });
};

new Vue({
  router,
  template: `
    <div id="app">
      <div id="app-loading-bar-mask">
        <div class="app-loading-bar-wrap">
          <div class="app-loading-bar">
            <svg width="672px" height="20px" viewBox="0 0 672 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <!-- Generator: Sketch 48.1 (47250) - http://www.bohemiancoding.com/sketch -->
              <title>Combined Shape</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g id="媒体库" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M672,0.105117767 L660.513684,20 L648.06069,20 L659.607695,-7.10542736e-15 L672,0 L672,0.105117767 Z M648.06069,2.48689958e-14 L636.513684,20 L624.06069,20 L635.607695,-7.10542736e-15 L648.06069,0 Z M624.06069,-7.81597009e-14 L612.513684,20 L600.06069,20 L611.607695,4.26325641e-14 L624.06069,0 Z M600.06069,-7.46069873e-14 L588.513684,20 L576.06069,20 L587.607695,-7.10542736e-15 L600.06069,0 Z M576.06069,-2.84217094e-14 L564.513684,20 L552.06069,20 L563.607695,-7.10542736e-15 L576.06069,0 Z M552.06069,-2.84217094e-14 L540.513684,20 L528.06069,20 L539.607695,-7.10542736e-15 L552.06069,0 Z M528.06069,-2.84217094e-14 L516.513684,20 L504.06069,20 L515.607695,-4.26325641e-14 L528.06069,0 Z M504.06069,7.10542736e-15 L492.513684,20 L480.06069,20 L491.607695,-3.55271368e-14 L504.06069,0 Z M480.06069,7.10542736e-15 L468.513684,20 L456.06069,20 L467.607695,-3.55271368e-14 L480.06069,0 Z M456.06069,-1.77635684e-14 L444.513684,20 L432.06069,20 L443.607695,-3.55271368e-14 L456.06069,0 Z M432.06069,-1.77635684e-14 L420.513684,20 L408.06069,20 L419.607695,-7.10542736e-15 L432.06069,0 Z M408.06069,3.55271368e-14 L396.513684,20 L384.06069,20 L395.607695,-7.10542736e-15 L408.06069,0 Z M384.06069,7.10542736e-15 L372.513684,20 L360.06069,20 L371.607695,-7.10542736e-15 L384.06069,0 Z M360.06069,7.10542736e-15 L348.513684,20 L336.06069,20 L347.607695,-7.10542736e-15 L360.06069,0 Z M336,0.105117767 L324.513684,20 L312.06069,20 L323.607695,-3.55271368e-14 L336,0 L336.06069,0 L336,0.105117767 Z M312.06069,-1.77635684e-14 L300.513684,20 L288.06069,20 L299.607695,-7.10542736e-15 L312.06069,0 Z M288.06069,7.10542736e-15 L276.513684,20 L264.06069,20 L275.607695,-7.10542736e-15 L288.06069,0 Z M264.06069,1.0658141e-14 L252.513684,20 L240.06069,20 L251.607695,-1.42108547e-14 L264.06069,0 Z M240.06069,3.55271368e-15 L228.513684,20 L216.06069,20 L227.607695,-2.13162821e-14 L240.06069,0 Z M216.06069,3.55271368e-15 L204.513684,20 L192.06069,20 L203.607695,-2.13162821e-14 L216.06069,0 Z M192.06069,-1.0658141e-14 L180.513684,20 L168.06069,20 L179.607695,-7.10542736e-15 L192.06069,0 Z M168.06069,3.55271368e-15 L156.513684,20 L144.06069,20 L155.607695,-7.10542736e-15 L168.06069,0 Z M144.06069,3.55271368e-15 L132.513684,20 L120.06069,20 L131.607695,-7.10542736e-15 L144.06069,0 Z M120.06069,3.55271368e-15 L108.513684,20 L96.0606898,20 L107.607695,7.10542736e-15 L120.06069,0 Z M96.0606898,1.0658141e-14 L84.5136844,20 L72.0606898,20 L83.6076952,7.10542736e-15 L96.0606898,0 Z M72.0606898,-3.55271368e-15 L60.5136844,20 L48.0606898,20 L59.6076952,7.10542736e-15 L72.0606898,0 Z M48.0606898,3.55271368e-15 L36.5136844,20 L24.0606898,20 L35.6076952,7.10542736e-15 L48.0606898,0 Z M24.0606898,-3.55271368e-15 L12.5136844,20 L0.0606897708,20 L11.6076952,7.10542736e-15 L24.0606898,0 Z M0.0606897708,3.23352456e-15 L0,0.105117767 L0,0 L0.0606897708,0 Z" id="Combined-Shape" fill="#38B1EB"></path>
              </g>
            </svg>
          </div>
          <p class="app-loading-text">正在加载...</p>
        </div>
      </div>
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
