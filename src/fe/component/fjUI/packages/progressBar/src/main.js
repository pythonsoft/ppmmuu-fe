import Vue from 'vue';
import ProgressBar from './progressBar';

let count = 0;

const FjProgressBarEventBus = new Vue({
  data: {
    percent: 0,
    show: false,
    canSuccess: true,
    n: 0.2,
    trickleSpeed: 400,
    termination: 300,
    transition: {
      speed: '.5s',
      opacity: '.2s'
    }
  }
});
window.FjProgressBarEventBus = FjProgressBarEventBus;

const Progress = {
  vm: FjProgressBarEventBus,
  state: {
    timer: null
  },
  start() {
    count += 1;
    if (this.state.timer) return;
    // console.log('start percent', this.vm.percent);
    this.vm.percent = 0;
    this.vm.show = true;
    this.vm.canSuccess = true;
    this.state.timer = setInterval(() => {
      if (this.vm.percent < 0.96) {
        this.increase();
      }
    }, this.vm.trickleSpeed);
  },
  increase() {
    this.vm.percent = ((1 - this.vm.n) * this.vm.percent) + this.vm.n;
    // this.vm.percent = this.vm.percent + 0.03 * Math.random();
    // console.log('increase percent', this.vm.percent);
  },
  hide() {
    clearInterval(this.state.timer);
    this.state.timer = null;
    setTimeout(() => {
      this.vm.show = false;
      Vue.nextTick(() => {
        setTimeout(() => {
          this.vm.percent = 0;
        }, 100);
      });
    }, this.vm.termination);
  },
  finish() {
    if (this.state.timer) {
      count -= 1;
      if (count === 0) {
        this.vm.percent = 1;
        this.hide();
      }
    }
  },
  restart() {
    if (this.state.timer) {
      count -= 1;
      clearInterval(this.state.timer);
      this.state.timer = null;
      this.vm.show = false;
      Vue.nextTick(() => {
        this.vm.percent = 0;
        setTimeout(() => {
          this.start();
        }, this.vm.trickleSpeed);
      });
    } else {
      this.start();
    }
  },
  fail() {
    if (this.state.timer) {
      count -= 1;
      if (count === 0) {
        this.vm.percent = 1;
        this.vm.canSuccess = false;
        this.hide();
      }
    }
  }
};

export default Progress;
