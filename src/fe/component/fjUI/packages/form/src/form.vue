<template>
  <form class="fj-form" :class="customClass">
    <slot></slot>
  </form>
</template>
<script>
  export default {
    name: 'FjForm',
    props: {
      model: Object,
      rules: Object,
      labelWidth: String,
      labelPosition: String,
      customClass: String
    },
    data() {
      return {
        fields: []
      };
    },
    methods: {
      validate(callback) {
        let valid = true;
        // let count = 0;

        if (this.fields.length === 0 && callback) callback(true);

        this.fields.forEach((field, index) => {
          field.validate('', (errors) => {
            if (errors) {
              valid = false;
            }
            // if (typeof callback === 'function' && ++count === this.fields.length) {
            //   callback(valid);
            // }
          });
        });
        callback && callback(valid);
      }
    },
    created() {
      this.$on('add-field', (field) => {
        if (field) {
          this.fields.push(field);
        }
      });
      this.$on('remove-field', (field) => {
        if (field.prop) {
          this.fields.splice(this.fields.indexOf(field), 1);
        }
      });
    }
  };
</script>
