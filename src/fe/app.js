import Vue from 'vue';
import VueRouter from 'vue-router';
import './css/base.css';
import routes from './routers/routes';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    console.log('scrollBehavior');
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '';
  next();
})

new Vue({
  router,
  template: `
    <div id="app">
      <div class="menu"><router-view name="menu"></router-view></div>
      <div class="main"><router-view></router-view></div>
    </div>
  `
}).$mount('#app');
