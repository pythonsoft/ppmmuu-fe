<template>
  <div>
      <div v-for="(item, index) in splits" :style="item" class="layout-panel-item">
        <slot :name="index" :height="getValue(item.height)" :width="getValue(item.width)" ></slot>
      </div>
      <div
        v-for="(item, index) in bars"
        :style="item"
        :class="getBarClass()"
        @mousedown="(e) => mousedown(e, index)"
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
      canResize: { type: Boolean, default: true }
    },
    data() {
      return {
        splits: [],
        bars: [],
        position: { x: 0, y: 0 },
        index: 0,
        isStartMove: false
      };
    },
    watch: {
      parentSize() {
        this.setSplits(this.panels);
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
        const bars = [];
        for (let i = 0, len = this.splits.length; i < len; i++) {
          if (i < len - 1) {
            bars.push(this.setSlideBarStyle(this.splits[i]));
          }
        }

        this.bars = bars;
      },
      setSplits(v) {
        const splits = v.replace(/\s/g, '').trim().split(',');
        const size = this.direction === 'x' ? this.parentSize.width : this.parentSize.height;
        let temp = 0;
        let rs = null;
        const arr = [];

        for (let i = 0, len = splits.length; i < len; i++) {
          temp = this.calculate(splits[i], size, splits);
          rs = this.getCssAndPos(temp, rs ? rs.nextPosition : null);
          arr.push(rs.css);
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
          css.height = `${size}px`;
          p.top += size;
        } else {
          css.top = `${p.top}px`;
          css.left = `${p.left}px`;
          css.width = `${size}px`;
          css.height = `${this.parentSize.height}px`;
          p.left += size;
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
        if (!this.isStartMove) { return false; }

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
