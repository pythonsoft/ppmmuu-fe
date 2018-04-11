<template>
  <div>
    <div v-if="processData.length" class="process-table">
      <div class="process-table-header">
        <span class="process-table-header-span">流程</span>
        <span class="process-table-header-span">状态</span>
        <span class="process-table-header-span">进度</span>
      </div>
      <div class="process-body">
        <div class="process-body-left">
          <div v-show="processData.length > 1" class="process-line">
            <div class="process-circle"></div>
            <div class="process-route"></div>
            <div class="process-circle"></div>
            <div class="process-route"></div>
            <div class="process-circle"></div>
            <div class="process-route"></div>
            <div class="process-circle"></div>
          </div>
        </div>
        <div class="process-body-right">
          <div v-for="row in processData" class="process-items">
            <div :class="['process-item','process-item-first', row.status !=='2' ? 'process-item-not-start' : '']">{{row.text}}</div>
            <div class="process-item" v-html="formatPacakgeStatus[row.status]"></div>
            <div class="process-item">{{row.process}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      暂无
    </div>
  </div>
</template>

<script>
  import { formatPacakgeStatus } from '../config';
  export default {
    props: {
      processData: {
        type: Array,
        default() {
          return [
            { text: '下载', status: '2', process: '100%'},
            { text: '转码', status: '2', process: '100%'},
            { text: '入库', status: '3', process: '100%'},
            { text: '上架', status: '4', process: '100%'},
          ]
        },
      }
    },
    data() {
      return {
        formatPacakgeStatus,
      }
    },
    created() {

    },
    methods: {
    }
  }
</script>
<style scope>
  .process-table {
    width: 320px;
    font-size: 12px;
    color: #2A3E52;
  }

  .process-table-header {
    margin-left: 22px;
  }

  .process-table-header-span {
    display: inline-block;
    margin-bottom: 20px;
    width: 32%;
  }

  .process-body {
    position: relative;
    height: 175px;
    width: 100%;
  }

  .process-body-left {
    position: absolute;
    left: 0;
    top: 5px;
    height: 100%;
  }

  .process-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5px;
  }

  .process-circle {
    width: 6px;
    height: 6px;
    background: #FFFFFF;
    border-radius: 50%;
    border: 1px solid #CED9E5;
  }

  .process-route {
    height: 36px;
    width: 1px;
    border: 1px solid #EBF3FB;
  }

  .process-body-right {
    position: absolute;
    left: 5px;
    top: 0;
    height: 100%;
    width: 320px;
  }

  .process-items {
    margin-bottom: 20px;
  }

  .process-item {
    display: inline-block;
    width: 32%;
  }

  .process-item-first {
    padding-left: 17px;
  }

  .process-item-not-start {
    color: #9FB3CA;
  }

</style>