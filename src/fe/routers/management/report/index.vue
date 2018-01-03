<template>
  <div :class="$style.reportWrap">
    <div :class="[$style.headerWrap, $style.panel, 'clearfix']">
      <span :class="$style.headerLabel">视图类型：</span>
      <div :class="$style.headerRadio">
        <fj-radio-group v-model="viewRange">
          <fj-radio label="year">年</fj-radio>
          <fj-radio label="month">月</fj-radio>
          <fj-radio label="date">日</fj-radio>
        </fj-radio-group>
      </div>
      <div :class="$style.headerSelect">
        <fj-select placeholder="请选择年份" v-model="year" size="small" theme="fill">
          <fj-option
            v-for="item in years"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div :class="$style.headerSelect" v-show="viewRange !== 'year'">
        <fj-select placeholder="请选择月份" v-model="month" size="small" theme="fill">
          <fj-option
            v-for="item in months"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div :class="$style.headerSelect" v-show="viewRange === 'date'">
        <fj-select placeholder="请选择日期" v-model="date" size="small" theme="fill">
          <fj-option
            v-for="item in dates"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div :class="$style.headerSelect">
        <fj-select placeholder="请选择" v-model="chartType" size="small" theme="fill">
          <fj-option
            v-for="item in PIE_DATA_TYPES"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
    </div>
    <div :class="[$style.titleWrap, $style.panel]">
      <h3>媒资报表总览</h3>
    </div>
    <div :class="[$style.panel]">
      <div :class="$style.typeTitle">
        <h3>饼状图总览</h3>
      </div>
      <div :class="['clearfix', $style.pieWrap]">
        <div :class="$style.pieChartBox" ref="areasPie"></div>
        <div :class="$style.pieChartBox" ref="locationsPie"></div>
        <div :class="$style.pieChartBox" ref="typesPie"></div>
      </div>
    </div>
    <div :class="[$style.panel, $style.panelLastChild]">
      <div :class="$style.typeTitle">
        <h3>线状图总览</h3>
      </div>
    </div>
    <div :class="$style.lineChartBox" ref="areasLine"></div>
    <div :class="$style.lineChartBox" ref="locationsLine"></div>
    <div :class="$style.lineChartBox" ref="typesLine"></div>
  </div>
</template>
<script>
  import '../../../static/umpBlue';
  import { getDayCountOfMonth, fillupZero } from '../../../common/utils';
  import echarts from 'echarts';
  import RequestsAPI from '../../../api/requests';
  import { pieOption, convertPieData, convertPieLegend } from './option/pieOption';
  import { lineOption, convertLineSeries } from './option/lineOption';
  // import tempJson from './option/temp.json';

  const emptyGraphic = {
    type: 'text',
    top: 'center',
    left: 'center',
    style: {
      text: '暂无数据'
    }
  };

  const PIE_DATA_TYPES = [
    { value: 'FileSize', label: '文件大小' },
    { value: 'Duration', label: '时长' },
    { value: 'FileCount', label: '文件数' },
    { value: 'RecordCount', label: '条目数' }
  ];
  const viewRangeTypes = {
    year: 3,
    month: 1,
    date: 0
  };

  export default {
    data() {
      const now = new Date();
      return {
        PIE_DATA_TYPES: PIE_DATA_TYPES,
        viewRange: 'month',
        years: [],
        months: [],
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        date: now.getDate(),
        chartType: 'FileSize',
        pieData: {},
        lineData: []
      };
    },
    computed: {
      dates() {
        const dates = [];
        const dayCountOfMonth = getDayCountOfMonth(this.year, this.month - 1);
        for (let i = 1; i <= dayCountOfMonth; i++) {
          dates.push({ value: i, label: i });
        }
        return dates;
      },
      timeinterval() {
        return viewRangeTypes[this.viewRange];
      },
      startdatetime() {
        const startdatetimeArr = [this.year, fillupZero(this.month), fillupZero(this.date), '00'];
        if (this.viewRange === 'month') {
          startdatetimeArr[2] = '01';
        } else if (this.viewRange === 'year') {
          startdatetimeArr[2] = '01';
          startdatetimeArr[1] = '01';
        }
        return startdatetimeArr.join('');
      },
      enddatetime() {
        const enddatetimeArr = [this.year, fillupZero(this.month), fillupZero(this.date), '23'];
        if (this.viewRange === 'month') {
          enddatetimeArr[2] = getDayCountOfMonth(this.year, this.month - 1);
        } else if (this.viewRange === 'year') {
          enddatetimeArr[2] = '31';
          enddatetimeArr[1] = '12';
        }
        return enddatetimeArr.join('');
      }
    },
    watch: {
      chartType(val) {
        this.updatePie();
        this.updateLine();
      },
      viewRange(val) {
        this.getReport();
      },
      year(val) {
        this.getReport();
      },
      month(val) {
        this.getReport();
      },
      date(val) {
        this.getReport();
      }
    },
    created() {
      this.initOptions();
    },
    mounted() {
      this.initPie();
      this.initLine();
      this.getReport();
    },
    methods: {
      initOptions() {
        const now = new Date();
        const currentYear = now.getFullYear();

        const years = [];
        for (let i = currentYear; i > currentYear - 10; i--) {
          years.push({ value: i, label: i });
        }
        this.years = years;

        const months = [];
        for (let i = 1; i < 13; i++) {
          months.push({ value: i, label: i });
        }
        this.months = months;
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
      },
      updatePie() {
        const newAreasPieOption = this.getPieOption(this.pieData.Areas.Increment);
        if (this.pieData.Areas.Increment.length === 0) {
          newAreasPieOption.graphic = emptyGraphic;
        }
        this.areasPie.setOption(newAreasPieOption);

        const newLocationsPieOption = this.getPieOption(this.pieData.Locations.Increment);
        if (this.pieData.Locations.Increment.length === 0) {
          newLocationsPieOption.graphic = emptyGraphic;
        }
        this.locationsPie.setOption(newLocationsPieOption);

        const newTypesPieOption = this.getPieOption(this.pieData.Types.Increment);
        if (this.pieData.Types.Increment.length === 0) {
          newTypesPieOption.graphic = emptyGraphic;
        }
        this.typesPie.setOption(newTypesPieOption);
      },
      updateLine() {
        const { legend, xAxis, areasSeries, locationsSeries, typesSeries } = this.lineData;

        if (xAxis.length === 0) {
          lineOption.graphic = emptyGraphic;
        } else {
          lineOption.graphic = { $action: 'remove' };
        }
        const areasOption = lineOption;
        areasOption.legend.data = legend.Areas;
        areasOption.xAxis[0].data = xAxis;
        areasOption.series = convertLineSeries(areasSeries, legend.Areas, this.chartType);
        this.areasLine.setOption(areasOption, true);

        const locationsOption = lineOption;
        locationsOption.legend.data = legend.Locations;
        locationsOption.xAxis[0].data = xAxis;
        locationsOption.series = convertLineSeries(locationsSeries, legend.Locations, this.chartType);
        this.locationsLine.setOption(locationsOption, true);

        const typesOption = lineOption;
        typesOption.legend.data = legend.Types;
        typesOption.xAxis[0].data = xAxis;
        typesOption.series = convertLineSeries(typesSeries, legend.Types, this.chartType);
        this.typesLine.setOption(typesOption, true);
      },
      convertLineData(curve) {
        const curveItem = curve.length > 0 ? curve[0] : {};
        const keys = Object.keys(this.pieData);
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

        const xAxis = [];
        const areasSeries = {};
        const locationsSeries = {};
        const typesSeries = {};

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

        curve.forEach(item => {
          xAxis.push(item._id + '');
          item.Areas.forEach(area => {
            areasSeries[area.Name].push(area.Increment);
          });
          item.Locations.forEach(location => {
            locationsSeries[location.Name].push(location.Increment);
          });
          item.Types.forEach(type => {
            typesSeries[type.Name].push(type.Increment);
          });
        });
        return {
          legend: legend,
          xAxis: xAxis,
          areasSeries: areasSeries,
          locationsSeries: locationsSeries,
          typesSeries: typesSeries
        };
      },
      getPieOption(data) {
        const option = {};
        option.series = [{ data: convertPieData(data, this.chartType) }];
        option.legend = [{ data: convertPieLegend(data) }];
        return option;
      },
      getReport(params = {}) {
        this.areasPie.showLoading({ color: '#38B1EB' });
        this.locationsPie.showLoading({ color: '#38B1EB' });
        this.typesPie.showLoading({ color: '#38B1EB' });
        this.areasLine.showLoading({ color: '#38B1EB' });
        this.locationsLine.showLoading({ color: '#38B1EB' });
        this.typesLine.showLoading({ color: '#38B1EB' });
        const data = {};
        data.path = '/get_report';
        const reqData = { reporttype: 2 };
        reqData.params = Object.assign(params, {
          timeinterval: this.timeinterval,
          startdatetime: this.startdatetime,
          enddatetime: this.enddatetime
        });
        data.params = JSON.stringify(reqData);


        // const resData = tempJson.data;
        // this.pieData = resData.pie;
        // this.lineData = this.convertLineData(resData.curve);

        // this.areasPie.hideLoading();
        // this.locationsPie.hideLoading();
        // this.typesPie.hideLoading();
        // this.areasLine.hideLoading();
        // this.locationsLine.hideLoading();
        // this.typesLine.hideLoading();
        // this.updatePie();
        // this.updateLine();

        RequestsAPI.sendRequests(data)
          .then((response) => {
            const resData = response.data;
            this.pieData = resData.pie;
            this.lineData = this.convertLineData(resData.curve);

            this.areasPie.hideLoading();
            this.locationsPie.hideLoading();
            this.typesPie.hideLoading();
            this.areasLine.hideLoading();
            this.locationsLine.hideLoading();
            this.typesLine.hideLoading();
            this.updatePie();
            this.updateLine();
          }).catch((error) => {
            this.$message.error(error);
            this.areasPie.hideLoading();
            this.locationsPie.hideLoading();
            this.typesPie.hideLoading();
            this.areasLine.hideLoading();
            this.locationsLine.hideLoading();
            this.typesLine.hideLoading();
          });
      }
    }
  };
</script>
<style module>
  .reportWrap {
    width: 100%;
    padding: 10px 20px;
    background-color: #f6f7f8;
  }
  .panel {
    padding: 0 27px;
    margin-bottom: 10px;
    background-color: #fff;
  }
  .panelLastChild {
    margin-bottom: 0;
  }
  .headerWrap {
    padding: 15px 27px;
  }
  .datePicker {
    float: left;
    width: 292px;
  }
  .titleWrap {
    padding: 42px 27px;
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    color: #303641;
  }
  .typeTitle {
    border-bottom: 1px solid #e3e3e3;
  }
  .typeTitle h3 {
    height: 79px;
    line-height: 79px;
    font-size: 24px;
  }
  .headerLabel,
  .headerRadio {
    float: left;
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
  }
  .headerSelect {
    float: left;
    width: 150px;
    margin-right: 10px;
  }
  .pieWrap {
    height: 505px;
    padding: 50px 0;
  }
  .pieChartBox {
    float: left;
    width: 33.3%;
    height: 100%;
  }
  .lineChartBox {
    width: 100%;
    height: 520px;
    margin-bottom: 5px;
    padding: 38px 27px;
    background: #fff;
  }
</style>
