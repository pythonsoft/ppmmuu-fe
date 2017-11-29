<template>
  <fj-dialog class="help-file-read" width="800px" title="fileReader" :visible.sync="display" @close="cancelDialog">
    <template>
      <div v-if="installMessage.length === 0" class="help-file-read-content" v-html="content"></div>
      <div v-else class="help-file-read-content">
        <div v-for="item in installMessage">{{item}}</div>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!isSuccess">
        <fj-button @click="cancelDialog">取消</fj-button><!--
        --><fj-button type="primary" :loading="isBtnLoading" @click="install">开始升级</fj-button>
      </div>
    </template>
  </fj-dialog>
</template>
<script>
  import '../index.css';
  const api = require('../../../../../api/help');
  import { formatContent } from '../../../../../common/utils';

  export default {
    name: 'helpFileReader',
    props: {
      packageInfo: { type: Object },
      visible: { type: Boolean }
    },
    data() {
      return {
        size: { width: '758', height: '400' },
        content: '',
        isBtnLoading: false,
        installMessage: [],
        display: false,
        isSuccess: false,
      };
    },
    watch: {
      visible(v) {
        if(v) {
          this.display = v;
          this.readFile();
        }
      }
    },
    methods: {
      cancelDialog() {
        this.$emit('update:visible', false);
        this.$emit('close');
      },
      install() {
        const me = this;
        this.isBtnLoading = true;

        api.installPackage({
          id: this.packageInfo._id
        }).then((res) => {
          me.isBtnLoading = false;
          me.isSuccess = true;
          me.getDetail();
        }).catch((error) => {
          me.isBtnLoading = false;
          me.installMessage.push(error);
        });
      },
      readFile() {
        const me = this;
        api.readFile({
          params: { id: this.packageInfo._id, filePath: 'version.json' }
        }, me).then((res) => {
          me.content = formatContent(res.data);
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      getDetail() {
        const me = this;

        api.detail({
          params: { id: this.packageInfo._id }
        }).then((res) => {
          me.installMessage = res.data.logs;
          setTimeout(function() {
            if(me.installMessage.indexOf('upgrade success.') === -1) {
              me.getDetail();
            }
          }, 1000);
        }).catch((error) => {
          me.installMessage.push(error);
          setTimeout(function() {
            if(me.installMessage.indexOf('upgrade success.') === -1) {
              me.getDetail();
            }
          }, 1000);

        });
      }
    }
  }
</script>

