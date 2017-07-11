<template>
    <div class="permission-content">
      <div class="top-search">
        <div class="search-title"><slot name="search-left"></slot></div>
        <div class="search-right-content">
            <slot name="search-right"></slot>
        </div>
      </div>
       <div class="permission-operation">
         <slot name="operation"></slot>
       </div>
       <slot></slot>
        <div>
          <slot name="table"></slot>
          <slot name="pagination"></slot>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'TableListLayout'
  };
</script>
<style>
    .permission-content {
      margin-left: 20px;
      margin-top: 10px;
    }

    .top-search {
      height: 40px;
      width: 100%;
      line-height: 38px;
      position: relative;
      min-width: 700px;
    }

    .permission-operation{
      background: #F2F6FA;
      line-height: 46px;
      height: 46px;
      margin-top: 10px;
      padding-left: 14px;
      overflow: hidden;
    }

    .table-pagination {
      margin-top: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      color: #4C637B;
    }
</style>
