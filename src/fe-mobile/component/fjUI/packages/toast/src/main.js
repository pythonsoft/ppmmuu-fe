import Vue from 'vue';
import ToastComponent from './toast';

const ToastConstructor = Vue.extend(ToastComponent);

let instance;
let seed = 1;

const Toast = function (options = {}) {
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  seed += 1;
  const id = `toast-component-${seed}`;

  instance = new ToastConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  return instance.vm;
};

['success', 'warning', 'info', 'error', 'loading'].forEach((type) => {
  Toast[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    options.icon = type === 'loading' ? 'icon-loading fj-icon-loading' : `icon-circle-${type}`;
    return Toast(options);
  };
});

export default Toast;
