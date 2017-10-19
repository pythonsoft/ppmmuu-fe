const store = {};

const bubble = {};

bubble.on = function (eventName, fn) {
  if(!store[eventName]) {
    store[eventName] = [];
  }

  store[eventName].push(fn);
};

bubble.emit = function (eventName, params) {
  if(store[eventName] && store[eventName].length > 0) {
    for(let i = 0; i < store[eventName].length; i++) {
      store[eventName][i].apply(arguments);
    }
  }
};
