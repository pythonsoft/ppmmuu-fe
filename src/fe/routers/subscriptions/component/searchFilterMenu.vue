<template>
  <div class="search-filter-menu" :style="menuStyle">
    <li v-for="menu in menus" class="clearfix">
      <span :class="['label', {'label-l': menu.type === 'daterange'}]">{{ menu.label }}</span>
      <div v-if="menu.items" class="value-box">
        <span
          v-for="item in menu.items"
          :key="item.value"
          @click="selectValue(menu, item.value)"
          :class="getItemClass(menu, item.value)">
          {{ item.label }}
        </span>
      </div>
      <div v-else-if="menu.type === 'daterange'" class="value-box">
        <div class="datetimerange-box">
        <fj-date-picker
          type="datetimerange"
          direction="horizontal"
          placeholder="请选择日期范围"
          v-model="menu.selected"
        ></fj-date-picker>
        </div>
      </div>
    </li>
    <div class="search-filter-menu-footer">
      <fj-button size="mini" @click="handleCancel">取消</fj-button><!--
      --><fj-button size="mini" type="primary" @click="handleClick">搜索</fj-button>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      menuStyle: {},
      filterList: {},
      menus: [],
    },
    data() {
      return {
        fullTime: [],
        selfFilterList: {}
      };
    },
    watch: {
      fullTime(val) {
        if (val.length > 0) {
          const time = val[0]
            ? new Date(val[0]).toISOString() + ',' + new Date(val[1]).toISOString()
            : '';
          this.selfFilterList.full_time = time;
        }
      },
    },
    methods: {
      handleClick() {
        for (let i = 0, len = this.menus.length; i < len; i++) {
          const menu = this.menus[i];
          if (menu.type === 'daterange' && menu.selected.length) {
            const time = menu.selected[0]
                ? new Date(menu.selected[0]).toISOString() + ',' + new Date(menu.selected[1]).toISOString()
                : '';
            this.selfFilterList[menu.key]= time;
          }
        }
        this.$emit('update-filter-list', this.selfFilterList);
      },
      handleCancel() {
        this.$emit('unmount');
      },
      getItemClass(menu, value) {
        const className = ['value-item'];

        if (this.selfFilterList[menu.key]) {
          if (menu.multiple) {
            const tempArr = this.selfFilterList[menu.key].split(' ');
            if (tempArr.indexOf(value) > -1) {
              className.push('active');
            }
          } else {
            if (this.selfFilterList[menu.key] === value) {
              className.push('active');
            }
          }
        } else {
          if (menu.defaultValue && menu.defaultValue === value) {
            className.push('active');
            return className;
          }
        }
        return className;
      },
      selectValue(menu, value) {
        const filterList = Object.assign({}, this.selfFilterList);
        if (menu.multiple) {
          if (filterList[menu.key]) {
            const tempArr = filterList[menu.key].split(' ');
            if (tempArr.indexOf(value) > -1) {
              tempArr.splice(tempArr.indexOf(value), 1);
            } else {
              tempArr.push(value);
            }
            filterList[menu.key] = tempArr.join(' ');
          } else {
            filterList[menu.key] = value;
          }
        } else {
          if (filterList[menu.key] === value) {
            if (!menu.defaultValue) {
              filterList[menu.key] = '';
            }
          } else {
            filterList[menu.key] = value;
          }
        }
        this.selfFilterList = filterList;
      }
    }
  };
</script>
<style>
  .search-filter-menu {
    position: absolute;
    padding: 4px 0;
    background: #FFFFFF;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    z-index: 1;
    color: #2A3E52;
  }
  .search-filter-menu:after {
    content: '';
    position: absolute;
    top: -10px;
    right: 94px;
    border: 5px solid #fff;
    border-color: transparent transparent #fff transparent;
  }
  .search-filter-menu:before {
    content: '';
    position: absolute;
    top: -12px;
    right: 93px;
    border: 6px solid #CED9E5;
    border-color: transparent transparent #CED9E5 transparent;
  }
  .search-filter-menu li {
    padding: 0 23px;
  }
  .search-filter-menu li {
    border-bottom: 1px solid #EBF3FB;
  }
  .search-filter-menu li .label {
    float: left;
    width: 96px;
    color: #4C637B;
    padding: 10px;
    line-height: 22px;
  }
  .search-filter-menu li .label-l {
    line-height: 30px;
  }
  .search-filter-menu li .value-box {
    margin-left: 96px;
  }
  .search-filter-menu li .value-item {
    float: left;
    margin: 10px 12px 10px 0;
    padding: 2px 8px;
    color: #2A3E52;
    cursor: pointer;
    border-radius: 2px;
  }
  .search-filter-menu li .value-item:hover {
    background: #EBF3FB;
  }
  .search-filter-menu li .value-item.active {
    background: #38B1EB;
    color: #fff;
  }
  .datetimerange-box {
    margin: 10px;
    width: 300px;
  }
  .search-filter-menu-footer {
    text-align: right;
    margin: 10px;
    margin-right: 40px;
  }
  .search-filter-menu-footer button + button {
    margin-left: 10px;
  }
</style>
