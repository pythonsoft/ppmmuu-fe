<template>
  <div class="page-wrap" ref="videoWrap">
    <video
      @contextmenu.prevent="()=>{return false;}"
      class="live-player"
      v-if="onLiveProgram === currentProgram || !currentProgram"
      :src="liveUrl"
      :style="{height: `${videoHeight}px`}"
      webkit-playsinline
      playsinline
      controls="controls"
      autoPlay="autoPlay"
      ></video>
    <player
      v-else
      :poster="getThumb({ id: objectId, from_where: fromWhere })"
      :url="url"
      :videoId="objectId"
      :streamInfo="streamInfo"
      :fromWhere="fromWhere"></player>
    <ul class="navbar" v-model="channel">
      <li
        v-for="item in channelList"
        :id="item._id"
        :class="['tab-item', { 'normal': channel !== item._id }]"
        @click="linkToChannel(item._id)">
        <img class="channel-item-img" :src="item.avatar" width="26" height="26" />
        {{ item.name }}
      </li>
    </ul>
    <div class="datetime-wrap">
      <div class="live-datetime-input" @click="pickerVisible=true">
        <i class="iconfont icon-zhiborili"></i>
        {{ formatTime(date, 'YYYY-MM-DD') }}
      </div>
      <button class="live-btn" @click="handleClickLiveBtn"><i class="iconfont icon-zhibobtn"></i>直播</button>
    </div>
    <ul class="program-list">
      <p v-if="loadingProgram" class="empty-text">加载中...</p>
      <p v-else-if="programList.length === 0" class="empty-text">暂无节目</p>
      <template v-else v-for="item in programList">
        <li
          v-if="item.isActive"
          @click="handleChangeCurrProgram(item._id, item.name, item.materialTime.from)"
          :class="[
            'programItem',
            'active',
            {'current': item._id === currentProgram},
            {'on': item._id === onLiveProgram},
            'clearfix']">
          <span class="programItemTime">{{ item.startTime }}</span>
          <span v-if="item._id === onLiveProgram" class="onLiveText">直播中</span>
        </li>
        <li v-else class="programItem clearfix">
          <span class="programItemTime">{{ item.startTime }}</span>
        </li>
      </template>
    </ul>
    <fj-datetime-picker
      :keys="['year', 'month', 'date']"
      :visible.sync="pickerVisible"
      :endDate="pickerEndDate"
      :value="date"
      @confirm="setDate"></fj-datetime-picker>
  </div>
</template>
<script>
  import {
    getThumb
  } from '../../../fe/routers/mediaCenter/common';
  import {
    formatTime,
    formatDate
  } from '../../../fe/common/utils';
  import { fileInfoTYPE } from "../../../fe/routers/library/config";
  import Player from '../watch/player';
  import liveAPI from '../../../fe/api/live';

  export default {
    data() {
      return {
        videoHeight: 0,
        liveUrl: '',
        objectId: '',
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0
        },
        type: '',
        fromWhere: '',
        files: [],
        currentProgram: '',
        onLiveProgram: '',
        programIds: [],
        programList: [],
        loadingProgram: false,
        pickerVisible: false,
        pickerEndDate: new Date(),
        date: new Date(),
        channel: 'phoenixtv_infonews',
        channelList: {
          phoenixtv_infonews: { _id: 'phoenixtv_infonews', name: '资讯台', avatar: require('./avatar/infonews_channel.jpg'), liveSource: '凤凰卫视资讯台HD', liveUrl: 'http://hkss3.phoenixtv.com/live/ngrp:pic.stream_all/playlist.m3u8' },
          phoenixtv_chinese: { _id: 'phoenixtv_chinese', name: '中文台', avatar: require('./avatar/chinese_channel.jpg'), liveSource: '凤凰卫视中文台HD', liveUrl: 'http://hkss3.phoenixtv.com/live/pcc.stream_360p/playlist.m3u8' },
        }
      };
    },
    watch: {
      '$route'(val) {
        this.updateChannel();
      },
      date(val) {
        // 获取节目单
        this.updateProgramList();
      },
      currentProgram(val) {
        this.updateProgramInfo();
      }
    },
    created() {
      this.updateChannel();
    },
    mounted() {
      const videoWidth = this.$refs.videoWrap.getBoundingClientRect().width;
      this.videoHeight = videoWidth * 9 / 16;
    },
    methods: {
      getThumb,
      formatTime,
      setDate(date) {
        this.date = new Date(date);
      },
      linkToChannel(channel) {
        this.$router.push({
          name: 'live',
          query: { channel: channel }
        });
      },
      handleClickLiveBtn() {
        this.date = new Date();
        // 切换program
        this.currentProgram = this.onLiveProgram;
      },
      updateChannel() {
        const query = this.$route.query;
        if (query.channel) {
          this.channel = query.channel;
        } else {
          this.channel = 'phoenixtv_infonews';
        }
        // 获取节目单
        this.updateProgramList();
        // 将日期重置为今天
        this.date = new Date();
        this.liveUrl = this.channelList[this.channel].liveUrl;
      },
      updateProgramList() {
        this.loadingProgram = true;
        const reqData = {
          channel: this.channel,
          time: formatDate(this.date)
        };
        liveAPI.listProgram({ params: reqData }).then((res) => {
          this.loadingProgram = false;
          const list = res.data.docs;
          const now = new Date().toISOString();
          const tempIds = [];
          this.programList = list.map(item => {
            tempIds.push(item._id);
            const range = item.materialTime;
            if (range.to <= now) {
              item.isActive = true;
            } else {
              if (range.from <= now) {
                this.currentProgram = item._id;
                this.onLiveProgram = item._id;
                item.isActive = true;
              } else {
                item.isActive = false;
              }
            }
            item.startTime = formatTime(range.from);
            return item;
          });
          this.programIds = tempIds;
        }).catch((error) => {
          this.loadingProgram = false;
          this.$message.error(error);
        });
      },
      updateProgramInfo() {
        if (this.onLiveProgram === this.currentProgram) return;
        liveAPI.getProgram({ params: { _id: this.currentProgram } }).then((res) => {
          const list = res.data;
          let program = {
            objectId: '',
            streamUrl: '',
            inpoint: 0,
            outpoint: 0,
            fromWhere: ''
          };

          for (let i = 0, len = list.length; i < len; i++) {
            if (list[i].type === fileInfoTYPE.LOW_BIT_VIDEO.value) {
              program = list[i];
            }
          }
          this.objectId = program.objectId;
          this.url = program.streamUrl;
          this.streamInfo = {
            INPOINT: program.inpoint,
            OUTPOINT: program.outpoint
          };
          this.type = program.type;
          this.fromWhere = program.fromWhere;
          this.files = list;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      handleChangeCurrProgram(programId, programName, startTime) {
        this.currentProgram = programId;
      }
    },
    components: {
      Player
    }
  };
</script>
<style>
  .page-wrap {
    position: relative;
    padding-top: 45px;
    padding-bottom: 55px;
    /*flex-grow: 1;*/
    background: #F8FAFB;
    /*overflow-y: auto;*/
  }
  .navbar {
    display: flex;
    background-color: #fff;
  }
  .tab-item {
    /*flex: 1;*/
    position: relative;
    display: flex;
    color: #333;
    padding: 10px 0 10px 15px;
    font-weight: bold;
    align-items: center;
  }
  .tab-item.normal {
    font-weight: normal;
  }
  .tab-item.normal:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    opacity: .5;
    height: 100%;
    width: 100%;
  }
  .channel-item-img {
    width: 26px;
    margin-right: 3.5px;
  }
  .datetime-wrap {
    display: flex;
    padding: 9px 3px;
  }
  .live-datetime-input {
    flex: .6;
    background: #fff;
    margin: 0 12px;
    padding: 8.5px 15px;
    box-shadow: 0 0 1px #E2E2E2;
    border-radius: 3px;
    font-size: 14px;
    color: #767676;
  }
  .live-datetime-input .iconfont {
    font-size: 14px;
    padding-right: 6px;
  }
  .live-btn {
    flex: .4;
    /*width: 82px;*/
    margin-right: 12px;
    font-size: 12px;
    color: #767676;
    background-color: #fff;
    padding: 8.5px 15px;
    border: 0;
    border-radius: 3px;
    appearance: none;
    outline: 0;
    text-align: center;
    box-shadow: 0 0 1px #E2E2E2;
  }
  .live-btn .iconfont {
    font-size: 12px;
    color: #767676;
    padding-right: 6px;
  }
  .program-list .empty-text {
    background: #fff;
    padding: 13px 15px;
    font-size: 15px;
    color: #333333;
  }
  .programItem {
    display: flex;
    padding: 13px 15px;
    font-size: 15px;
    color: #aaa;
    background: #fff;
  }
  .programItem.active {
    color: #333333;
  }
  .programItem.current {
    background: #F2F6FA;
  }
  .programItem.on {
    font-weight: bold;
    color: #38B1EB;
  }
  .programItemTime {
    flex: 1;
  }
  .onLiveText {
    position: relative;
    width: 58px;
    padding-left: 11px;
  }
  .onLiveText:before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38B1EB;
  }
  .live-player {
    width: 100%;
  }
</style>
