<template>
  <transition name="fj-zoom-in-top">
    <div :class="[$style.wrap, 'clearfix']" v-show="visible" v-clickoutside="handleClose">
      <div>
        <span :class="$style.groupLabel">群名</span>
        <div :class="$style.groupName">
          <fj-input
            v-if="isEditGroupName"
            size="small"
            v-model="name"
            @keyup.native.enter="handleUpdate"
            v-clickoutside="handleUpdate"></fj-input>
          <span v-else>{{ groupName }}</span>
        </div>
        <i v-if="!isEditGroupName" :class="['iconfont icon-edit-outline', $style.editIcon]" @click="isEditGroupName = true"></i>
      </div>
      <i :class="[$style.addMemberBtn, 'iconfont icon-jia']" @click="showDepartmentBrowser"></i>
      <div v-for="member in members" :key="member" :class="$style.item" :title="(infos[member] && infos[member].nickname) || ''">
        <img :src="member.avatar" :class="['im-avatar im-img-style', $style.avatar]" width="24" height="24">
        <p :class="$style.nickname">{{ (infos[member] && infos[member].nickname) || '' }}</p>
      </div>
    </div>
  </transition>
</template>
<script>
  import Clickoutside from '../../fjUI/utils/clickoutside';

  export default {
    directives: { Clickoutside },
    props: {
      groupName: String,
      visible: {
        type: Boolean,
        default: false
      },
      members: {
        type: Array,
        default: []
      },
      infos: Object
    },
    data() {
      return {
        isEditGroupName: false,
        name: this.groupName
      };
    },
    watch: {
      groupName(val) {
        this.name = val;
      }
    },
    methods: {
      showDepartmentBrowser() {
        this.$emit('show-department-browser');
      },
      handleClose(e) {
        if (e.id === 'show-group-member-btn') return;
        this.$emit('update:visible', false);
      },
      handleUpdate() {
        console.log('handleUpdate');
        this.isEditGroupName = false;
        this.$emit('update-group-name', this.name);
      }
    }
  };
</script>
<style module>
  .wrap {
    position: absolute;
    top: 39px;
    left: 0;
    right: 0;
    height: 125px;
    padding: 10px 14px;
    border-bottom: 1px solid #E3EAF3;
    z-index: 1;
    overflow: auto;
    background: #F3F5F6;
  }
  .addMemberBtn {
    float: left;
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 5px 9px;
    text-align: center;
    font-size: 14px;
    color: #9FB3CA;
    border: 1px dashed #9FB3CA;
    border-radius: 50%;
    cursor: pointer;
  }
  .item {
    float: left;
    width: 36px;
    margin: 5px 9px;
    text-align: center;
    cursor: default;
  }
  .avatar {
    display: block;
    margin: 0 auto;
  }
  .nickname {
    width: 36px;
    margin-top: 4px;
    font-size: 12px;
    color: #4C637B;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
  }
  .groupLabel {
    font-size: 12px;
    color: #4C637B;
  }
  .groupName {
    display: inline-block;
    margin-left: 12px;
    margin-right: 8px;
    font-size: 12px;
    color: #2A3E52;
  }
  .groupName input {
    width: 228px;
  }
  .editIcon {
    color: #344C67;
  }
</style>
