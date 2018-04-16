<template>
  <div :class="$style.reportWrap" ref="reportBody">
    <div :class="[$style.headerWrap, $style.panel]">
      <div :class="$style.datePicker">
        <fj-date-picker
          type="daterange"
          format="YYYY-MM-DD"
          theme="stroke"
          direction="horizontal"
          placeholder="请选择日期范围"
          v-model="daterange"></fj-date-picker>
      </div>
    </div>
    <div :class="[$style.titleWrap, $style.panel]">
      <h3>{{ `${dateToStr(new Date(this.daterange[0]), '-')} 至 ${dateToStr(new Date(this.daterange[1]), '-')} ` }}大洋媒资用量报表</h3>
      <div :class="[$style.overviewWrap, 'clearfix']">
        <div :class="$style.overviewItem" v-for="item in PIE_DATA_TYPES">
          <span :class="$style.label">{{ item.label }}</span>
          <span :class="$style.count">{{ getSummary(item) }}</span>
        </div>
      </div>
    </div>
    <div :class="[$style.panel]">
      <div :class="[$style.typeTitle]">
        <div :class="[$style.typeTitleInner, 'clearfix']">
          <h3>饼状图总览</h3>
          <div :class="$style.typeRadioGroup">
            <fj-radio-group v-model="chartValueType">
              <fj-radio-button label="Total">总量</fj-radio-button><!--
              --><fj-radio-button label="Increment">增量</fj-radio-button>
            </fj-radio-group>
          </div>
          <div :class="$style.typeRadioGroup">
            <fj-radio-group v-model="chartType">
              <fj-radio-button
                v-for="item in PIE_DATA_TYPES"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</fj-radio-button>
            </fj-radio-group>
          </div>
        </div>
      </div>
      <div :class="['clearfix', $style.pieWrap]">
        <div :class="$style.pieChartBox" ref="areasPie"></div>
        <div :class="$style.pieChartBox" ref="locationsPie"></div>
        <div :class="$style.pieChartBox" ref="typesPie"></div>
      </div>
    </div>
    <div :class="[$style.panel, $style.panelLastChild]">
      <div :class="[$style.typeTitle, fixLineChartsHeader ? $style.isFixed : '']" ref="lineChartsHeader">
        <div :class="[$style.typeTitleInner, 'clearfix']">
          <h3>线状图总览</h3>
          <div :class="$style.typeRadioGroup">
            <fj-radio-group v-model="lineValueType">
              <fj-radio-button label="Total">总量</fj-radio-button><!--
              --><fj-radio-button label="Increment">增量</fj-radio-button>
            </fj-radio-group>
          </div>
          <div :class="$style.typeRadioGroup">
            <fj-radio-group v-model="timeinterval">
              <fj-radio-button
                :disabled="loading"
                v-for="item in TIME_INTERVAL_MAP"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</fj-radio-button>
            </fj-radio-group>
          </div>
          <div :class="$style.typeRadioGroup">
            <fj-radio-group v-model="lineType">
              <fj-radio-button
                v-for="item in PIE_DATA_TYPES"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</fj-radio-button>
            </fj-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div :class="$style.lineChartBox" ref="statisticsLine"></div>
    <div :class="$style.lineChartBox" ref="areasLine"></div>
    <div :class="$style.lineChartBox" ref="locationsLine"></div>
    <div :class="$style.lineChartBox" ref="typesLine"></div>
  </div>
</template>
<script>
  import '../../../static/umpBlue';
  import { getDayCountOfMonth, fillupZero, formatSize, transformSecondsToHours } from '../../../common/utils';
  import echarts from 'echarts';
  import RequestsAPI from '../../../api/requests';
  import { pieOption, convertPieData, convertPieLegend } from './option/pieOption';
  import { lineOption, convertLineSeries } from './option/lineOption';
  import throttle from '../../../component/fjUI/utils/throttle';

  const emptyGraphic = {
    type: 'text',
    top: 'center',
    left: 'center',
    style: {
      text: '暂无数据'
    }
  };

  const PIE_DATA_TYPES = {
    FileSize: { value: 'FileSize', label: '文件大小', formatFn: formatSize, unit: 'Bytes' },
    Duration: { value: 'Duration', label: '时长', formatFn: function(data){ return transformSecondsToHours(data / 25); }, unit: '帧' },
    FileCount: { value: 'FileCount', label: '文件数', formatFn: function(data){ return `${data}个`; }, unit: '个' },
    RecordCount: { value: 'RecordCount', label: '条目数', formatFn: function(data){ return `${data}条`; }, unit: '条' }
  };

  const TIME_INTERVAL_MAP = {
    0: { value: 0, label: '小时' },
    1: { value: 1, label: '天' },
    3: { value: 3, label: '月' }
  };

  export default {
    data() {
      const now = new Date();
      // const currentYear = now.getFullYear() - 1;
      // const currentMonth = 11;
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      return {
        PIE_DATA_TYPES: PIE_DATA_TYPES,
        TIME_INTERVAL_MAP: TIME_INTERVAL_MAP,
        daterange: [new Date(currentYear, currentMonth - 1), new Date(currentYear, currentMonth)],
        timeinterval: 1,
        chartType: 'FileSize',
        lineType: 'FileSize',
        chartValueType: 'Total',
        lineValueType: 'Total',
        pieData: {},
        incrementSummary: {},
        lineData: [],
        loading: false,
        fixLineChartsHeader: false
      };
    },
    computed: {
    },
    watch: {
      chartType(val) {
        this.updatePie();
      },
      chartValueType(val) {
        this.updatePie();
      },
      lineType(val) {
        this.updateLine();
      },
      lineValueType(val) {
        this.updateLine();
      },
      daterange(val) {
        if (val[0] && val[1]) {
          const startdate = new Date(this.daterange[0]).getTime();
          const enddate = new Date(this.daterange[1]).getTime();
          const duration = (enddate - startdate) / (1000 * 60 * 60 * 24) + 1;
          let timeinterval = 0;
          if (duration < 14) {
            // 小时
            timeinterval = 0;
          } else if (duration >= 14 && duration <= 120) {
            // 天
            timeinterval = 1;
          } else {
            // 月
            timeinterval = 3;
          }
          if (timeinterval !== this.timeinterval) {
            this.timeinterval = timeinterval;
            this.getReport('pie');
          } else {
            this.getReport();
          }
        }
      },
      timeinterval(val) {
        this.getReport('line');
      }
    },
    created() {
    },
    mounted() {
      this.initPie();
      this.initLine();
      this.getReport();
      this.bodyWrap = document.getElementsByClassName('right-content')[0];
      this.bodyWrap.addEventListener('scroll', this.scrollHandler);
      window.addEventListener('resize', throttle(this.resizeHandler));
    },
    beforeDestroy() {
      this.bodyWrap.removeEventListener('scroll', this.scrollHandler);
      window.removeEventListener('resize', throttle(this.resizeHandler));
    },
    methods: {
      scrollHandler() {
        const distance = this.bodyWrap.scrollTop;
        if (distance > 990) {
          this.fixLineChartsHeader = true;
        } else {
          if (this.fixLineChartsHeader) this.fixLineChartsHeader = false;
        }
      },
      dateToStr(date, separator = '') {
        const year = date.getFullYear();
        const month = fillupZero(date.getMonth() + 1);
        const day = fillupZero(date.getDate());
        return `${year}${separator}${month}${separator}${day}`;
      },
      getSummary(item) {
        return this.incrementSummary[item.value] ? item.formatFn(this.incrementSummary[item.value]) : 0;
      },
      resizeHandler() {
        this.areasPie.resize();
        this.locationsPie.resize();
        this.typesPie.resize();

        this.areasLine.resize();
        this.locationsLine.resize();
        this.typesLine.resize();
        this.statisticsLine.resize();
      },
      initPie() {
        const areasPieOption = Object.assign({}, pieOption);
        areasPieOption.title.text = '各制作地点饼状图';
        this.areasPie = echarts.init(this.$refs.areasPie, 'umpBlue');
        this.areasPie.setOption(areasPieOption);

        const locationsPieOption = Object.assign({}, pieOption);
        locationsPieOption.title.text = '各文件状态饼状图';
        this.locationsPie = echarts.init(this.$refs.locationsPie, 'umpBlue');
        this.locationsPie.setOption(locationsPieOption);

        const typesPieOption = Object.assign({}, pieOption);
        typesPieOption.title.text = '各节目类型饼状图';
        this.typesPie = echarts.init(this.$refs.typesPie, 'umpBlue');
        this.typesPie.setOption(typesPieOption);
      },
      initLine() {
        const areasLineOption = Object.assign({}, lineOption);
        areasLineOption.title.text = '各制作地点曲线图';
        this.areasLine = echarts.init(this.$refs.areasLine, 'umpBlue');
        this.areasLine.setOption(areasLineOption);

        const locationsLineOption = Object.assign({}, lineOption);
        locationsLineOption.title.text = '各文件状态曲线图';
        this.locationsLine = echarts.init(this.$refs.locationsLine, 'umpBlue');
        this.locationsLine.setOption(locationsLineOption);

        const typesLineOption = Object.assign({}, lineOption);
        typesLineOption.title.text = '各节目类型曲线图';
        this.typesLine = echarts.init(this.$refs.typesLine, 'umpBlue');
        this.typesLine.setOption(typesLineOption);

        const statisticsLineOption = Object.assign({}, lineOption);
        typesLineOption.title.text = '全部数据曲线图';
        this.statisticsLine = echarts.init(this.$refs.statisticsLine, 'umpBlue');
        this.statisticsLine.setOption(statisticsLineOption);
      },
      updatePie() {
        const newAreasPieOption = this.getPieOption(this.pieData.Areas[this.chartValueType]);
        if (this.pieData.Areas[this.chartValueType].length === 0) {
          newAreasPieOption.graphic = emptyGraphic;
        }
        this.areasPie.setOption(newAreasPieOption);

        const newLocationsPieOption = this.getPieOption(this.pieData.Locations[this.chartValueType]);
        if (this.pieData.Locations[this.chartValueType].length === 0) {
          newLocationsPieOption.graphic = emptyGraphic;
        }
        this.locationsPie.setOption(newLocationsPieOption);

        const newTypesPieOption = this.getPieOption(this.pieData.Types[this.chartValueType]);
        if (this.pieData.Types[this.chartValueType].length === 0) {
          newTypesPieOption.graphic = emptyGraphic;
        }
        this.typesPie.setOption(newTypesPieOption);
      },
      updateLine() {
        const { legend, xAxis, statisticsSeries, areasSeries, locationsSeries, typesSeries } = this.lineData;
        const formatter = PIE_DATA_TYPES[this.lineType].formatFn;

        if (xAxis.length === 0) {
          lineOption.graphic = emptyGraphic;
        } else {
          lineOption.graphic = { $action: 'remove' };
        }
        lineOption.yAxis[0].name = PIE_DATA_TYPES[this.lineType].label;
        lineOption.yAxis[0].axisLabel.formatter = formatter;
        lineOption.tooltip.formatter = (params)=> {
          let result = `${params[0].name}<br/>`;
          params.forEach(item => {
            result += `${item.seriesName}: ${formatter(item.value)}<br/>`;
          });
          return result;
        };

        const statisticsOption = lineOption;
        statisticsOption.title.text = '全部数据曲线图';
        statisticsOption.legend.data = legend.Statistics;
        statisticsOption.xAxis[0].data = xAxis;

        statisticsOption.series = convertLineSeries(statisticsSeries, legend.Statistics, this.lineType);
        this.statisticsLine.setOption(statisticsOption, true);

        const areasOption = lineOption;
        areasOption.title.text = '各制作地点曲线图';
        areasOption.legend.data = legend.Areas;
        areasOption.xAxis[0].data = xAxis;
        areasOption.series = convertLineSeries(areasSeries, legend.Areas, this.lineType, this.lineValueType);
        this.areasLine.setOption(areasOption, true);

        const locationsOption = lineOption;
        locationsOption.title.text = '各文件状态曲线图';
        locationsOption.legend.data = legend.Locations;
        locationsOption.xAxis[0].data = xAxis;
        locationsOption.series = convertLineSeries(locationsSeries, legend.Locations, this.lineType, this.lineValueType);
        this.locationsLine.setOption(locationsOption, true);

        const typesOption = lineOption;
        typesOption.title.text = '各节目类型曲线图';
        typesOption.legend.data = legend.Types;
        typesOption.xAxis[0].data = xAxis;
        typesOption.series = convertLineSeries(typesSeries, legend.Types, this.lineType, this.lineValueType);
        this.typesLine.setOption(typesOption, true);
      },
      convertLineData(curve) {
        const curveItem = curve.length > 0 ? curve[0] : {};
        const keys = ['Areas', 'Locations', 'Types', 'Statistics'];
        const legend = {};

        // 获取每个曲线图的legend
        keys.forEach(key => {
          legend[key] = [];
          if (curveItem[key]) {
            curveItem[key].forEach(item =>{
              legend[key].push(item.Name);
            });
          }
        });
        legend.Statistics = ['总量', '增量'];

        const xAxis = [];
        const areasSeries = {};
        const locationsSeries = {};
        const typesSeries = {};
        const statisticsSeries = {};

        // 初始化每个曲线图对应的legend的series为数组
        legend.Areas.forEach(key =>{
          areasSeries[key] = [];
        }) ;
        legend.Locations.forEach(key =>{
          locationsSeries[key] = [];
        }) ;
        legend.Types.forEach(key =>{
          typesSeries[key] = [];
        }) ;
        legend.Statistics.forEach(key =>{
          statisticsSeries[key] = [];
        }) ;

        curve.forEach(item => {
          xAxis.push(item._id + '');
          item.Areas.forEach(area => {
            areasSeries[area.Name].push(area);
          });
          item.Locations.forEach(location => {
            locationsSeries[location.Name].push(location);
          });
          item.Types.forEach(type => {
            typesSeries[type.Name].push(type);
          });
          statisticsSeries['总量'].push(item.Total);
          statisticsSeries['增量'].push(item.Increment);
        });
        return {
          legend: legend,
          xAxis: xAxis,
          statisticsSeries: statisticsSeries,
          areasSeries: areasSeries,
          locationsSeries: locationsSeries,
          typesSeries: typesSeries
        };
      },
      getPieOption(data) {
        const option = {};
        option.series = [{ data: convertPieData(data, this.chartType, PIE_DATA_TYPES[this.chartType].formatFn) }];
        option.legend = [{ data: convertPieLegend(data) }];
        return option;
      },
      getPieData(reqData = {}) {
        const data = {};
        data.path = '/get_report';
        data.params = JSON.stringify(reqData);

        this.areasPie.showLoading({ color: '#38B1EB' });
        this.locationsPie.showLoading({ color: '#38B1EB' });
        this.typesPie.showLoading({ color: '#38B1EB' });
        RequestsAPI.sendRequests(data)
          .then((response) => {
            const resData = response.data;
            this.pieData = resData;
            this.incrementSummary = resData.IncrementSummary;

            this.areasPie.hideLoading();
            this.locationsPie.hideLoading();
            this.typesPie.hideLoading();

            this.updatePie();
          }).catch((error) => {
            this.$message.error(error);

            this.areasPie.hideLoading();
            this.locationsPie.hideLoading();
            this.typesPie.hideLoading();
          });
      },
      getLineData(reqData = {}) {
        this.loading = true;
        const data = {};
        data.path = '/get_report';
        data.params = JSON.stringify(reqData);

        this.statisticsLine.showLoading({ color: '#38B1EB' });
        this.areasLine.showLoading({ color: '#38B1EB' });
        this.locationsLine.showLoading({ color: '#38B1EB' });
        this.typesLine.showLoading({ color: '#38B1EB' });
        RequestsAPI.sendRequests(data)
          .then((response) => {
            const resData = response.data;
            this.lineData = this.convertLineData(resData);

            this.statisticsLine.hideLoading();
            this.areasLine.hideLoading();
            this.locationsLine.hideLoading();
            this.typesLine.hideLoading();

            this.updateLine();
          }).catch((error) => {
            this.$message.error(error);

            this.statisticsLine.hideLoading();
            this.areasLine.hideLoading();
            this.locationsLine.hideLoading();
            this.typesLine.hideLoading();
          }).then(() => {
            this.loading = false;
          });
      },
      getReport(type = 'all') {
        const startdatetime = this.dateToStr(new Date(this.daterange[0])) + '00';
        const enddatetime = this.dateToStr(new Date(this.daterange[1])) + '23';
        const params = {
          timeinterval: this.timeinterval,
          startdatetime: startdatetime,
          enddatetime: enddatetime
        };
        if (type === 'pie' || type === 'all') {
          this.getPieData(Object.assign({}, { params: params }, { reporttype: 2 }));
        }
        if (type === 'all' || type === 'line') {
          this.getLineData(Object.assign({}, { params: params }, { reporttype: 1 }));
        }
      }
    }
  };
</script>
<style module>
  @import url(./index.css);
</style>
