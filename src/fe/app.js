import moment from 'moment';
import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/base.css';
import routes from './routers/routes';

Vue.use(VueRouter);

Vue.filter('formatTime', (value, formatString) => {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
  return moment(value).format(formatString);
});

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
      <fj-progress-bar></fj-progress-bar>
      <div class="menu"><router-view name="menu"></router-view></div>
      <div class="main"><router-view></router-view></div>
    </div>
  `
}).$mount('#app');
