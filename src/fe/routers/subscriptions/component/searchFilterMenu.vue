<template>
  <div class="search-filter-menu" :style="menuStyle">
    <li v-for="menu in menus" class="clearfix">
      <span class="label">{{ menu.label }}</span>
      <div v-if="menu.items" class="value-box">
        <span
          v-for="item in menu.items"
          @click="selectValue(menu, item.value)"
          :class="getItemClass(menu, item.value)">
          {{ item.label }}
        </span>
      </div>
    </li>
  </div>
</template>
<script>
  export default {
    props: {
      menuStyle: {},
      filterList: {},
      menus: []
    },
    data() {
      return {
      };
    },
    methods: {
      getItemClass(menu, value) {
        // if (!menu.multiple) {
        //   console.log(this.filterList[menu.key], value);
        // }
        const className = ['value-item'];
        if (this.filterList[menu.key]) {
          if (menu.multiple) {
            const tempArr = this.filterList[menu.key].split(' ');
            if (tempArr.indexOf(value) > -1) {
              className.push('active');
            }
          } else {
            if (this.filterList[menu.key] === value) {
              className.push('active');
            }
          }
        }
        return className;
      },
      selectValue(menu, value) {
        const filterList = Object.assign({}, this.filterList);
        if (menu.multiple) {
          if (filterList[menu.key]) {
            const tempArr = filterList[menu.key].split(' ');
            tempArr.push(value);
            filterList[menu.key] = tempArr.join(' ');
          } else {
            filterList[menu.key] = value;
          }
        } else {
          filterList[menu.key] = value;
        }
        this.$emit('update-filter-list', filterList);
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
  .search-filter-menu li+li {
    border-top: 1px solid #EBF3FB;
  }
  .search-filter-menu li .label {
    float: left;
    width: 96px;
    color: #4C637B;
    padding: 10px;
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
</style>
