<template>
  <div></div>
</template>
<script>
  import Quill from 'quill/core';
  import Snow from 'quill/themes/snow';
  import Toolbar from 'quill/modules/toolbar';

  Quill.register({
    'themes/snow': Snow,
    'modules/toolbar': Toolbar
  });

  export default {
    props: {
      editorInstance: {},
      editable: Boolean,
      value: String
    },
    data() {
      return {
        selfValue: this.value,
        index: 0
      };
    },
    watch: {
      editable(val) {
        this.quill.enable(val);
      },
      value(val) {
        if (val !== this.selfValue) {
          this.selfValue = val;
          this.quill.setText(val);
          const length = this.quill.getLength();
          this.quill.setSelection(length + 1, 0);
        }
      }
    },
    mounted() {
      const options = {
        modules: {
          toolbar: false
        },
        placeholder: '请输入正文',
        theme: 'snow'
      };

      this.quill = new Quill(this.$el, options);
      this.quill.enable(this.editable);

      this.quill.on('text-change', this.textChangeHandler);
      this.quill.on('selection-change', this.selectionHandle);
      this.editorInstance.$on('insertTag', this.insertTag);
    },
    beforeDestroy() {
      this.quill.off('text-change', this.textChangeHandler);
      this.quill = null;
    },
    methods: {
      selectionHandle(range, oldRange, source) {
        if (range) {
          this.index = range.index;
        }
      },
      textChangeHandler(delta, oldDelta, source) {
        const text = this.quill.getText();
        this.selfValue = text;
        this.$nextTick(() => {
          const range = this.quill.getSelection();
          if (range) {
            this.index = range.index;
          }
        });
        this.$emit('input', text);
      },
      insertTag(val) {
        console.log(this.index);
        this.quill.insertText(this.index, `${val}\n`);
        this.quill.setSelection(this.index + val.length + 1, 0);
      }
    }
  };
</script>
<style>
  @import "quill/dist/quill.core.css";
  .ql-editor {
    padding: 0;
  }
  .ql-editor.ql-blank::before {
    left: 0;
    font-style: normal;
    font-size: 14px;
    color: #9FB3CA;
    line-height: 21px;
  }
  .ql-container {
    font-size: 14px;
  }
</style>
