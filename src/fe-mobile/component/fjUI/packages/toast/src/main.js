import Vue from 'vue';
import ToastComponent from './toast';

const ToastConstructor = Vue.extend(ToastComponent);

let instance;
const instances = [];
let seed = 1;

const Toast = function (options = {}) {
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  seed += 1;
  const id = `toast-component-${seed}`;
  options.onClose = function () {
    Toast.close(id);
  };
  instance = new ToastConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instances.push(instance);
  return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  Toast[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    options.icon = `icon-circle-${type}`;
    return Toast(options);
  };
});

Toast.close = function (id) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      instances.splice(i, 1);
      break;
    }
  }
};
export default Toast;
