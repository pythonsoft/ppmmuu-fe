import Vue from 'vue';
import VueRouter from 'vue-router';
import FjUI from './component/fjUI';
import './css/base.css';
import routes from './routers/routes';
import { formatTime } from '../fe/common/utils';

Vue.use(VueRouter);
Vue.use(FjUI);
Vue.filter('formatTime', formatTime);

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
    <router-view></router-view>
  `
}).$mount('#app');
