<template>
  <div :class="$style.liveWrap">
    <div :class="$style.channelWrap">
      <h3 :class="$style.channelTitle">直播频道</h3>
      <ul>
        <li
          v-for="item in channelList"
          :class="[$style.channelItem, {[$style.on]: item._id === channel}]"
          @click="linkToChannel(item._id)">
            <span :class="$style.channelItemImgBox">
              <img :class="$style.channelItemImg" :src="item.avatar" width="16" height="16" />
            </span>
            <span :class="$style.channelItemText" :title="item.name">{{ item.name }}</span>
          </li>
      </ul>
    </div>
    <div :class="$style.programWrap">
      <div :class="[$style.programHeader, 'clearfix']">
        <h3 :class="$style.programTitle">节目单</h3>
        <div :class="$style.datePicker">
          <fj-date-picker
            type="date"
            placeholder="请选择日期"
            v-model="date"
            format="YYYY-MM-DD"
            theme="fill"
            size="small"
            :clearable="false"></fj-date-picker>
        </div>
        <span :class="$style.liveSwitch" @click="handleClickLiveBtn"><i class="iconfont icon-live-stroke"></i> 直播</span>
      </div>
      <ul>
        <p v-if="loadingProgram" :class="$style.emptyText">加载中...</p>
        <p v-else-if="programList.length === 0" :class="$style.emptyText">暂无节目</p>
        <template v-else v-for="item in programList">
          <li
            v-if="item.isActive"
            @click="handleChangeCurrProgram(item._id, item.name)"
            :class="[
              $style.programItem,
              $style.active,
              {[$style.current]: item._id === currentProgram},
              {[$style.on]: item._id === onLiveProgram},
              'clearfix']">
            <span :class="$style.programItemTime">{{ item.startTime }}</span>
            <span :class="$style.programItemName">{{ item.name }}</span>
            <span v-if="item._id === onLiveProgram" :class="$style.onLiveText">直播中</span>
          </li>
          <li v-else :class="[$style.programItem, 'clearfix']">
            <span :class="$style.programItemTime">{{ item.startTime }}</span>
            <span :class="$style.programItemName">{{ item.name }}</span>
          </li>
        </template>
      </ul>
    </div>
    <div :class="$style.playerWrap" ref="playerWrap">
      <player
        :video-id="objectId"
        :height="playerHeight"
        :width="playerWidth"
        :url="url"
        :stream-info="streamInfo"
        :from-where="fromWhere"
        :file-type="type"
        :name="name"
        :files="files"
        :download-menu="DropdownMenu"
        :show-cut-icon="true"
        :is-auto-play="true"
        @on-ended="autoPlay"></player>
    </div>
  </div>
</template>
<script>
  import {
    FROM_WHERE,
    formatTime,
    formatDate
  } from '../../common/utils';
  import DropdownMenu from './component/dropdownMenu';
  import Player from '../subscriptions/component/player';
  import throttle from '../../component/fjUI/utils/throttle';
  import liveAPI from '../../api/live';

  const channelList = [
    { _id: '中文台', name: '中文台', avatar: require('./chinese_channel.webp') },
    { _id: '咨询台', name: '咨询台', avatar: require('./infonews_channel.webp') },
    { _id: '香港台', name: '香港台', avatar: require('./hk_channel.webp') }
  ];

  export default {
    data() {
      return {
        DropdownMenu: DropdownMenu,
        objectId: '',
        playerWidth: 0,
        playerHeight: 0,
        url: '',
        name: '',
        channel: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0
        },
        type: '',
        fromWhere: '',
        files: [],
        currentProgram: '',
        onLiveProgram: '',
        channelList: channelList,
        programList: [],
        programIds: [],
        date: new Date(),
        onLive: true,
        loadingProgram: false
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
      this.updatePlayerSize();
      window.addEventListener('resize', throttle(this.updatePlayerSize, 200));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.updatePlayerSize, 200));
    },
    methods: {
      autoPlay() {
        const index = this.programIds.indexOf(this.currentProgram);
        this.currentProgram = this.programIds[index + 1];
      },
      updatePlayerSize() {
        if (!this.$refs.playerWrap) return;
        const playerWrapRectObject = this.$refs.playerWrap.getBoundingClientRect();
        const playerWidth = playerWrapRectObject.width;
        const playerHeight = playerWrapRectObject.height;
        this.playerWidth = playerWidth;
        this.playerHeight = playerHeight;
      },
      handleClickLiveBtn() {
        this.onLive = true;
        this.date = new Date();
        // 切换program
        this.currentProgram = this.onLiveProgram;
      },
      updateChannel() {
        const query = this.$route.query;
        if (query.channel) {
          this.channel = query.channel;
        } else {
          this.channel = this.channelList[0]._id;
        }
        // 获取节目单
        this.updateProgramList();
        // 将日期重置为今天
        this.date = new Date();
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
            item.startTime = formatTime(range.from, 'HH:mm');
            return item;
          });
          this.programIds = tempIds;
        }).catch((error) => {
          this.loadingProgram = false;
          this.$message.error(error);
        });
      },
      updateProgramInfo() {
        liveAPI.getProgram({ params: { _id: this.currentProgram } }).then((res) => {
          const list = res.data;
          let program_720P = {};
          let program_360P = {};
          let program = {
            objectId: '',
            streamUrl: '',
            inpoint: 0,
            outpoint: 0,
            fromWhere: ''
          };
          for (let i = 0; i < list.length; i++) {
            if (list[i].typeName === '720P') {
              program_720P = list[i];
              break;
            } else if (list[i].typeName === '360P') {
              program_360P = list[i];
            }
          }
          if (program_720P.typeName) {
            program = program_720P;
          } else if (program_360P.typeName) {
            program = program_360P;
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
      linkToChannel(channel) {
        this.$router.push({
          name: 'live',
          query: { channel: channel }
        });
      },
      handleChangeCurrProgram(programId, programName) {
        this.currentProgram = programId;
        this.name = programName
      }
    },
    components: {
      Player
    }
  };
</script>
<style module>
  @import './index.css';
</style>
