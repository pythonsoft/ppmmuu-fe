<template>
  <div :class="$style.reportWrap">
    <div :class="[$style.headerWrap, $style.panel]">
      <div :class="$style.datePicker">
        <fj-date-picker type="datetimerange" theme="stroke" direction="horizontal" placeholder="请选择日期范围" v-model="datetimerange"></fj-date-picker>
      </div>
    </div>
    <div :class="[$style.titleWrap, $style.panel]">
      <h3>媒资报表总览</h3>
    </div>
    <div :class="[$style.panel]">
      <div :class="[$style.typeTitle, 'clearfix']">
        <h3>饼状图总览</h3>
        <div :class="$style.typeTitleSelect">
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
      <div :class="['clearfix', $style.pieWrap]">
        <div :class="$style.pieChartBox" ref="areasPie"></div>
        <div :class="$style.pieChartBox" ref="locationsPie"></div>
        <div :class="$style.pieChartBox" ref="typesPie"></div>
      </div>
    </div>
    <div :class="[$style.panel, $style.panelLastChild]">
      <div :class="[$style.typeTitle, 'clearfix']">
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
  import echarts from 'echarts';
  import RequestsAPI from '../../../api/requests';
  import { pieOption, convertPieData, convertPieLegend } from './option/pieOption';
  import { lineOption, convertLineSeries } from './option/lineOption';
  // import tempJson from './option/temp.json';

  const PIE_DATA_TYPES = [
    { value: 'FileSize', label: '文件大小' },
    { value: 'Duration', label: '时长' },
    { value: 'FileCount', label: '文件数' },
    { value: 'RecordCount', label: '条目数' }
  ];

  export default {
    data() {
      return {
        PIE_DATA_TYPES: PIE_DATA_TYPES,
        chartType: 'FileSize',
        datetimerange: [new Date(2017, 10), new Date(2017, 11)],
        startDatetime: '',
        endDatetime: '',
        pieData: {},
        lineData: []
      };
    },
    watch: {
      chartType(val) {
        this.updatePie();
        this.updateLine();
      },
      datetimerange(val) {
        console.log('datetimerange change', val);
      }
    },
    created() {
    },
    mounted() {
      this.initPie();
      this.initLine();
      this.getReport({ reporttype: 2, params: { startdatetime: 2017110100, enddatetime: 2017110123 } });
    },
    methods: {
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
        this.areasPie.setOption(newAreasPieOption);

        const newLocationsPieOption = this.getPieOption(this.pieData.Locations.Increment);
        this.locationsPie.setOption(newLocationsPieOption);

        const newTypesPieOption = this.getPieOption(this.pieData.Types.Increment);
        this.typesPie.setOption(newTypesPieOption);
      },
      updateLine() {
        const { legend, xAxis, areasSeries, locationsSeries, typesSeries } = this.lineData;

        const areasOption = {};
        areasOption.legend = { data: legend.Areas };
        areasOption.xAxis = [{ data: xAxis }];
        areasOption.series = convertLineSeries(areasSeries, legend.Areas, this.chartType);
        this.areasLine.setOption(areasOption);

        const locationsOption = {};
        locationsOption.legend = { data: legend.Locations };
        locationsOption.xAxis = [{ data: xAxis }];
        locationsOption.series = convertLineSeries(locationsSeries, legend.Locations, this.chartType);
        this.locationsLine.setOption(locationsOption);

        const typesOption = {};
        typesOption.legend = { data: legend.Types };
        typesOption.xAxis = [{ data: xAxis }];
        typesOption.series = convertLineSeries(typesSeries, legend.Types, this.chartType);
        this.typesLine.setOption(typesOption);
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
        data.params = JSON.stringify(params);


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
    float: left;
    height: 79px;
    line-height: 79px;
    font-size: 24px;
  }
  .typeTitleSelect {
    float: right;
    width: 210px;
    margin-top: 24px;
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
