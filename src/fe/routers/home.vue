<template>
  <div>
    <div id="app-loading-bar-mask" v-if="isShowLoading">
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
    <div class="app-refresh-wrap" v-else-if="isShowRefreshBox">
      <span class="iconfont icon-refresh" @click="reload"></span>
      <p>点击刷新</p>
    </div>
    <template v-else>
      <fj-progress-bar></fj-progress-bar>
      <left-menu :showMenuIndex="showMenuIndex">
      </left-menu>
      <div class="main"><router-view></router-view></div>
      <im></im>
    </template>
  </div>
</template>
<script>
  import menu from './menu';
  import root from './root';
  import { getChildMenuByIndex, getItemFromLocalStorage, getDefaultPageIndex, ensureLocalData } from '../common/utils';
  import Im from '../component/im/index';

  const userAPI = require('../api/user');

  export default {
    name: 'home',
    components: {
      Im,
      default: root,
      'left-menu': menu
    },
    data() {
      return {
        isShowLoading: true,
        isShowRefreshBox: false,
        showMenuIndex: []
      }
    },
    created() {
      userAPI.getUserAuth({}, null, true).then((res) => {
        ensureLocalData(res.data);
        this.isShowLoading = false;
        console.log('getItemFromLocalStorage --->', res.data, getItemFromLocalStorage('jwtToken'));

        const showMenuIndex = getItemFromLocalStorage('menu', this);
        const normalMenu = ['taskCenter', 'personalCenter'];
        this.showMenuIndex = showMenuIndex.length? normalMenu.concat(getChildMenuByIndex('', false, this)) : normalMenu;

        if (window.location.pathname === '/') {
          const index = getDefaultPageIndex(showMenuIndex);
          this.$router.push({name: index});
        }
      }).catch((error) => {
        const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004', '-3005'];
        if (loginStatusCodeArr.indexOf(error.status) !== -1) {
          window.location.href = '/login';
        } else {
          this.isShowLoading = false;
          this.isShowRefreshBox = true;
        }
      });
    },
    methods: {
      reload() {
        window.location.reload();
      }
    }
  };
</script>
