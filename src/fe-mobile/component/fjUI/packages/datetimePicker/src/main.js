import Vue from 'vue';
import DatetimePickerComponent from './datetimePicker';

const DatetimePickerConstructor = Vue.extend(DatetimePickerComponent);

let instance;
const instances = [];
let seed = 1;

const DatetimePicker = function (options = {}) {
  seed += 1;
  const id = `datetime-picker-${seed}`;
  instance = new DatetimePickerConstructor({
    props: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instances.push(instance);
  return instance.vm;
};
