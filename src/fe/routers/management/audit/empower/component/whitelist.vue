<template>
  <div>
    <div :style="{ lineHeight: '36px' }">
      <fj-button type="info" size="mini" @click.stop.prevent="addDepartmentClick">添加部门</fj-button>
      <fj-button type="danger" size="mini" @click.stop.prevent="deleteDepartmentClick" :disabled="selectedTableSelectedRows.length<1">删除</fj-button>
    </div>
    <div :style="{ borderTop: '1px solid #EBF3FB', marginTop: '20px' }">
      <fj-table :data="data" @selection-change="selectedTableSelectionChange">
        <fj-table-column type="selection" width="20"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
      </fj-table>
    </div>
    <add-group :visible.sync="dialogVisible"  @add-owner="addOwner" title="添加部门"></add-group>
  </div>
</template>
<script>
  import AddGroup from '../../../role/searchAddGroup';

  export default {
    props: {
      data: Array
    },
    data() {
      return {
        dialogVisible: false,
        deletable: false,
        tableData: [],
        selectedTableSelectedRows: []
      };
    },
    components: {
      'add-group': AddGroup
    },
    methods: {
      addOwner(row) {
        row = row.info ? row.info : row;
        const type = row.type || '3';
        const postData = {
          type: type,
          _id: row._id,
          name: row.name,
        };
        const data = this.data;
        let flag = true;
        for(let i = 0, len1 = data.length; i < len1; i++){
          if(data[i]._id === postData._id){
            flag = false;
          }
        }
        if(flag){
          data.push(postData);
        }
        this.dialogVisible = false;
      },
      addDepartmentClick() {
        this.dialogVisible = true;
      },
      deleteDepartmentClick() {
        const me = this;
        const users = this.data;
        const updateUsers = [];
        for(let j = 0, len1 = this.selectedTableSelectedRows.length; j < len1; j++) {
          let flag = false;
          for (let i = 0; i < users.length; i++) {
            if(users[i]._id === this.selectedTableSelectedRows[j]._id){
              users.splice(i, 1);
            }
          }
        }
      },
      selectedTableSelectionChange(rows) {
        if (rows.length) {
          this.deletable = true;
        } else {
          this.deletable = false;
        }
        this.selectedTableSelectedRows = rows;
      },
      closeDialog() {
        this.dialogVisible = false;
      }
    }
  };
</script>
