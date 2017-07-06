<template>
  <div class="fj-form-item" :class="{
    'is-error': showMessage,
    'is-required': isRequired || required
  }">
    <label v-if="label" :for="prop" :style="labelStyle">{{label}}</label>
    <div class="fj-form-item-content" :style="contentStyle">
      <slot></slot>
      <div class="fj-form-item-error" v-if="showMessage">{{validateMessage}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'FjFormItem',
    props: {
      label: String,
      labelWidth: String,
      prop: String,
      required: Boolean
    },
    data() {
      return {
        validateMessage: '',
        showMessage: false,
        isRequired: false
      };
    },
    computed: {
      form() {
        return this.$parent;
      },
      labelStyle() {
        let style = {};
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) style.width = labelWidth;
        return style;
      },
      contentStyle() {
        let style = {};
        const labelWidth = this.labelWidth || this.form.labelWidth;
        if (labelWidth) style.marginLeft = labelWidth;
        return style;
      }
    },
    methods: {
      getRules() {
        let formRules = this.form.rules;
        formRules = formRules ? formRules[this.prop] : [];
        return formRules;
      },
      getFilteredRule(trigger) {
        const rules = this.getRules();
        return rules.filter((rule) => {
          return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
        });
      },
      getFieldValue() {
        const data = this.form.model;
        if (!data || !this.prop) return null;
        return data[this.prop];
      },
      onFieldChange() {
        this.validate('change');
      },
      onFieldBlur() {
        this.validate('blur');
      },
      validate(trigger, callback = function () {}) {
        const rules = this.getFilteredRule(trigger);
        if (!rules || rules.length === 0) {
          callback();
          return;
        }

        let error = false;
        let errors = [];
        const value = this.getFieldValue();

        rules.forEach((rule) => {
          if (rule.validator) {
            error = !rule.validator(rule, value);
          } else if (rule.required) {
            error = typeof value === 'string' ? !value.trim() : !value;
          }
          if (error) {
            errors.push(rule);
          }
        });
        this.validateMessage = errors.length > 0 ? errors[0].message : '';
        this.showMessage = !!(errors.length > 0);
        callback(this.validateMessage);
      }
    },
    mounted() {
      if (this.prop) {
        this.form.$emit('add-field', this);
        let rules = this.getRules();
        if (rules.length > 0) {
          for (let i = 0; i < rules.length; i++) {
            if (rules[i].required) {
              this.isRequired = true;
              break;
            }
          }
          this.$on('form-change', this.onFieldChange);
          this.$on('form-blur', this.onFieldBlur);
        }
      }
    },
    beforeDestroy() {
      this.form.$emit('remove-field', this);
    }
  };
</script>
