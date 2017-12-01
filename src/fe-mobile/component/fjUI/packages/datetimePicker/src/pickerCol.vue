<template>
   <div class="fj-picker-col" ref="pickerCol">
    <div class="fj-picker-col-mask"></div>
    <div class="fj-picker-col-content" :style="translateElStyle">
      <div :class="['fj-picker-col-item', {'isSelected': index === valueIndex}]" v-for="(item, index) in col">{{ `${fillupZero(item)}${unit}` }}</div>
    </div>
  </div>
</template>

<script>
  import draggable from './util/draggable';
  import { fillupZero } from './util';

  export default {
    props: {
      col: {
        type: Array,
        default() {
          return [];
        }
      },
      value: {},
      valueKey: String,
      unit: String
    },
    data() {
      return {
        translateElStyle: {},
        itemHeight: 39,
        currentValue: this.value
      };
    },
    mounted() {
      this.initEvents();
      // const translateY = -this.valueIndex * this.itemHeight;
      // this.translateTop = translateY;
      this.updateTranslateStyle();
      // console.log('this.value', this.value);
      // console.log('this.valueIndex', this.valueIndex);
    },
    computed: {
      valueIndex() {
        return this.col.indexOf(this.value);
      },
      translateTop() {
        return -this.valueIndex * this.itemHeight;
      }
    },
    watch: {
      currentValue(val) {
        this.$emit('change', val);
      },
      translateTop(val) {
        this.updateTranslateStyle();
      }
    },
    methods: {
      fillupZero,
      initEvents() {
        const el = this.$refs.pickerCol;
        let dragState = {};
        let translateY = this.translateTop;
        draggable(el, {
          start: (event) => {
            dragState = {
              startTop: event.pageY
            };
          },
          drag: (event) => {
            dragState.top = event.pageY;
            const distance = dragState.top - dragState.startTop;
            const translate = this.translateTop + distance;
            this.updateTranslateStyle(translate);
            translateY = translate;
            // console.log('drag', distance);
          },
          end: () => {
            this.$nextTick(() => {
              let translate = Math.round(translateY / this.itemHeight) * this.itemHeight;
              // 超过范围的判断
              const max = 0;
              const min = - (this.col.length - 1) * this.itemHeight;
              translate = Math.max(Math.min(translate, max), min);
              this.updateTranslateStyle(translate);
              // this.translateTop = translate;
              this.currentValue = this.translateToValue(translate);
            });
            dragState = {};
          }
        })
      },
      translateToValue(translate) {
        translate = Math.round(translate / this.itemHeight) * this.itemHeight;
        const index = Math.abs(translate / this.itemHeight);
        return this.col[index];
      },
      updateTranslateStyle(translateY = this.translateTop) {
        this.translateElStyle = {
          transform: `translate(0, ${translateY}px)`
        };
      }
    }
  };
</script>
