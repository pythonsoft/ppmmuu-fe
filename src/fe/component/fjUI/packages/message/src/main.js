import Vue from 'vue';
import MessageComponent from './message.vue';

const MessageConstructor = Vue.extend(MessageComponent);

let instance;
let instances = [];
let seed = 1;

const Message = function (options = {}) {
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  seed += 1;
  const id = `message-component-${seed}`;
  options.onClose = function () {
    Message.close(id);
  };
  instance = new MessageConstructor({
    data: options
  });
  instance.id = id;
  instance.vm = instance.$mount();
  console.log('instance.vm', instance.vm);
  document.body.appendChild(instance.vm.$el);
  instance.vm.visible = true;
  instances.push(instance);
  return instance.vm;
};

['success', 'warning', 'info', 'error'].forEach((type) => {
  Message[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    return Message(options);
  };
});

Message.close = function (id) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      instances.splice(i, 1);
      break;
    }
  }
};
export default Message;
