import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/base.css';
import routes from './routers/routes';
import { formatTime, valueLengthLimit, ensureLocalData } from './common/utils';

const api = require('./api/user');

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
    //todo 在调用next之前需要加载动画
    api.getUserAuth().then((res) => {
      ensureLocalData(res.data);
      next();
    }).catch(() => {
      //todo 出错处理，提示可以刷新界面重试
    });
  }
});

new Vue({
  router,
  template: `
    <div id="app">
      <router-view></router-view>
    </div>
  `
}).$mount('#app');
