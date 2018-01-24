<template>
  <div class="im-dialog-main-left">
    <div class="im-main-left-header">
      <div class="im-main-left-header-top">
        <div class="im-main-left-header-top-avatar">
          <img
            :src="myselfInfo.photo"
            class="im-avatar im-img-style"
            width="24"
            height="24" />
        </div>
        <div class="im-main-left-header-top-name">{{ myselfInfo.name || '昵称' }}</div>
      </div>
      <div class="iconfont icon-tongxunlu im-icon-menu" @click="$emit('display-menu')"></div>
      <!-- <div class="im-dialog-main-left-search">
        <fj-input
          placeholder="请输入用户名"
          size="small"
          theme="fill"
          v-model="keyword"
          icon="icon-search input-search-icon"
          @on-icon-click=""
          @keydown.native.enter.prevent=""
        ></fj-input>
      </div> -->
    </div>
    <ul class="im-main-left-dialog-list">
      <li
        v-for="id in contactIds"
        v-if="contactObj[id]"
        :key="id"
        :class="getRecentContactClass(contactObj[id], id)"
        @click="(e) => {contactClick(e, contactObj[id])}"
      >
        <div class="avatar">
          <img v-if="contactObj[id].avatar" :src="contactObj[id].avatar" class="im-avatar" width="24" height="24">
          <img
            v-else-if="contactObj[id].members"
            v-for="(member, index) in contactObj[id].members.slice(0, 4)"
            :src="(users[member] && users[member].avatar) || '/static/img/avatar.png'"
            class="im-avatar im-img-style im-avatar-group"
            width="16" height="16"
            :style="getGroupMemberAvatarStyle(index, contactObj[id].members.length)"
          >
          <img v-else class="im-avatar im-img-style" width="24" height="24">
          <div class="im-item-message-circle" v-if="contactObj[id]._hasUnreadMessage"></div>
        </div>
        <div class="content">
          {{ contactObj[id].groupid ? contactObj[id].name : contactObj[id].nickname }}
        </div>
      </li>
      <li class="im-main-left-dialog-list-item" v-if="loadingContacts < 2">加载中...</li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      myselfInfo: Object,
      talkToSession: String,
      contactIds: Array,
      contactObj: Object,
      users: Object,
      loadingContacts: Number
    },
    data() {
      return {};
    },
    methods: {
      contactClick(e, item) {
        this.$emit('contact-click', e, item);
      },
      getRecentContactClass(item, id) {
        const currentItem = this.contactObj[this.talkToSession];
        if (!currentItem) return 'im-main-left-dialog-list-item';
        if (currentItem.groupid) {
          if (currentItem.groupid === item.groupid) {
            return 'im-main-left-dialog-list-item active';
          }
        } else {
          if (currentItem.name === item.name) {
            return 'im-main-left-dialog-list-item active';
          }
        }
        return 'im-main-left-dialog-list-item';
      },
      getGroupMemberAvatarStyle(index, length) {
        let style_config = {};
        if (length < 4) {
          style_config = {
            0: 'top: 0; left: 4px; z-index: 1;',
            1: 'top: 8px; left: 0px; z-index: 2;',
            2: 'top: 8px; left: 8px; z-index: 3;'
          };
        } else {
          style_config = {
            0: 'top: 0; left: 0; z-index: 1;',
            1: 'top: 0; left: 8px; z-index: 2;',
            2: 'top: 8px; left: 0px; z-index: 3;',
            3: 'top: 8px; left: 8px; z-index: 4;'
          };
        }
        return style_config[index];
      }
    }
  };
</script>
