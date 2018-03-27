<template>
  <div>
      <div v-for="(item, index) in splits" :style="item" class="layout-panel-item">
        <slot :name="index" :height="getValue(item.height)" :width="getValue(item.width)" ></slot>
      </div>
      <div
        v-for="(item, index) in bars"
        :style="item"
        :class="getBarClass()"
        @mousedown="(e) => {mousedown(e, index)}"
      ></div>
  </div>
</template>
<script>
  // # p+index
  import './index.css';

  export default {
    name: 'panelView',
    props: {
      parentSize: { type: Object, default() { return { width: '100', height: '100' }; } },
      panels: { type: String, default: '#-p1, 30' },
      direction: { type: String, default: 'x' },
      canResize: { type: Boolean, default: true },
      limitResize: { type: Boolean, default: false },
      limitResizeScale: { type: Number, default: 0 },
      name: { type: String }
    },
    data() {
      return {
        size: { height: 0, width: 0 },
        splits: [],
        bars: [],
        position: { x: 0, y: 0 },
        index: 0,
        isStartMove: false
      };
    },
    watch: {
      parentSize(v) {
        this.setSplits(this.panels);
        this.setSlideBars();
        this.size = v;
      },
      panels(v) {
        this.setSplits(v);
        this.setSlideBars();
      }
    },
    created() {
      this.setSplits(this.panels);
      this.setSlideBars();
    },
    methods: {
      getBarClass() {
        let v = '';
        let h = '';

        if (!this.canResize) {
          v = 'layout-panel-slide-vertical-bar-no-resize';
          h = 'layout-panel-slide-horizontal-bar-no-resize';
        } else {
          v = 'layout-panel-slide-vertical-bar';
          h = 'layout-panel-slide-horizontal-bar';
        }

        return `layout-panel-slide-bar ${this.direction === 'x' ? v : h}`;
      },
      setSlideBarStyle(item) {
        const style = { top: 0, left: 0 };
        if (this.direction === 'x') {
          style.top = item.top;
          style.left = `${item.left.replace('px', '') * 1 + item.width.replace('px', '') * 1 - 1}px`;
          style.height = item.height;
          style.width = '4px';
        } else {
          style.top = `${item.top.replace('px', '') * 1 + item.height.replace('px', '') * 1 - 1}px`;
          style.left = item.left;
          style.height = '4px';
          style.width = item.width;
        }

        return style;
      },
      setSlideBars() {
        const flag = this.direction === 'x' ? 'height' : 'width';
        let bars = [];

        if (this.bars.length !== 0) {
          bars = this.bars;

          for (let i = 0, len = this.splits.length; i < len; i++) {
            if (i < len - 1) {
              const keys = Object.keys(bars[i]);
              const newBars = this.setSlideBarStyle(this.splits[i]);
              keys.forEach(key => {
                bars[i][key] = newBars[key];
              });
            }
          }
          // if (this.size[flag] !== this.parentSize[flag]) {
          //   for (let i = 0, len = bars.length; i < len; i++) {
          //     bars[i][flag] = `${this.parentSize[flag]}px`;
          //   }
          // }
        } else {
          for (let i = 0, len = this.splits.length; i < len; i++) {
            if (i < len - 1) {
              bars.push(this.setSlideBarStyle(this.splits[i]));
            }
          }
        }

        this.bars = bars;
      },
      setSplits(v) {
        const flag = this.direction === 'x' ? 'height' : 'width';
        const splits = v.replace(/\s/g, '').trim().split(',');
        const size = this.direction === 'x' ? this.parentSize.width : this.parentSize.height;
        let temp = 0;
        let rs = null;
        let arr = [];
        if (this.splits.length !== 0) {
          arr = this.splits;

          for (let i = 0, len = splits.length; i < len; i++) {
            temp = this.calculate(splits[i], size, splits);
            rs = this.getCssAndPos(temp, rs ? rs.nextPosition : null);
            const keys = Object.keys(arr[i]);
            keys.forEach(key => {
              arr[i][key] = rs.css[key];
            });
          }
          // if (this.size[flag] !== this.parentSize[flag]) {
          //   for (let i = 0, len = arr.length; i < len; i++) {
          //     arr[i][flag] = `${this.parentSize[flag]}px`;
          //   }
          // }
        } else {
          for (let i = 0, len = splits.length; i < len; i++) {
            temp = this.calculate(splits[i], size, splits);
            rs = this.getCssAndPos(temp, rs ? rs.nextPosition : null);
            arr.push(rs.css);
          }
        }

        this.splits = arr;
      },
      getArray(v) {
        return v.match(/p[0-9]/img);
      },
      calculate(exp, size, splits) {
        let v = (`${exp}`).replace(/#/g, size);
        const arr = this.getArray(v);
        let temp = '';
        if (arr) {
          for (let i = 0, len = arr.length; i < len; i++) {
            temp = splits[arr[i].substring(1) * 1];
            if (temp.indexOf('#') !== -1) {
              temp = temp.replace(/#/g, size);
            }
            if (this.getArray(temp)) {
              temp = this.calculate(temp, size);
            }
            v = v.replace(arr[i], temp);
          }
        }

        return (new Function(`return ${v}`))();
      },
      getCssAndPos(size, pos) {
        const css = {};
        pos = pos || { top: 0, left: 0 };
        const p = { top: pos.top, left: pos.left };

        if (this.direction === 'y') {
          css.top = `${p.top}px`;
          css.left = `${p.left}px`;
          css.width = `${this.parentSize.width}px`;
          css.height = `${size - 2}px`;
          p.top += size + 2;
        } else {
          css.top = `${p.top}px`;
          css.left = `${p.left}px`;
          css.width = `${size - 2}px`;
          css.height = `${this.parentSize.height}px`;
          p.left += size + 2;
        }

        return { css: css, nextPosition: p };
      },
      getValue(v) {
        return typeof v === 'number' ? v : v.replace('px', '') * 1;
      },
      mousedown(e, index) {
        if (!this.canResize) { return false; }
        this.position = { x: e.pageX, y: e.pageY };
        this.index = index;
        this.isStartMove = true;

        document.body.addEventListener('mousemove', this.mousemove);
        document.body.addEventListener('mouseup', this.mouseup);

        return false;
      },
      mousemove(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isStartMove) { return false; }
        if(this.limitResize){
          if(this.direction == 'x' && e.pageX < this.limitResizeScale) {
            return false;
          }
          if(this.direction == 'y' && e.pageY < this.limitResizeScale) {
            return false;
          }
        }

        const offset = { x: e.pageX - this.position.x, y: e.pageY - this.position.y };
        const index = this.index;

        if (this.direction === 'x') {
          const left = this.splits[index];
          const right = this.splits[index + 1];
          const bar = this.bars[index];

          left.width = `${this.getValue(left.width) + offset.x}px`;
          right.width = `${this.getValue(right.width) - offset.x}px`;
          right.left = `${this.getValue(right.left) + offset.x}px`;

          bar.left = `${this.getValue(bar.left) + offset.x}px`;
        } else {
          const top = this.splits[index];
          const bottom = this.splits[index + 1];
          const bar = this.bars[index];

          top.height = `${this.getValue(top.height) + offset.y}px`;
          bottom.height = `${this.getValue(bottom.height) - offset.y}px`;
          bottom.top = `${this.getValue(bottom.top) + offset.y}px`;

          bar.top = `${this.getValue(bar.top) + offset.y}px`;
        }

        this.position = { x: e.pageX, y: e.pageY };
        return false;
      },
      mouseup() {
        document.body.removeEventListener('mousemove', this.mousemove);
        document.body.removeEventListener('mouseup', this.mouseup);
        this.isStartMove = false;
        return false;
      }
    }
  };
</script>
