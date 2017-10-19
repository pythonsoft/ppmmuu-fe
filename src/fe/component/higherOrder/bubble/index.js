if(!window._ump_store) {
  window._ump_store = {};
}

const bubble = {};

bubble.on = function (eventName, fn) {
  if(!window._ump_store[eventName]) {
    window._ump_store[eventName] = [];
  }

  window._ump_store[eventName].push(fn);
};

bubble.emit = function (eventName) {
  if(window._ump_store[eventName] && window._ump_store[eventName].length > 0) {
    let params = [];

    if(arguments && arguments.length > 0) {
      params = Array.prototype.slice.call(arguments);
      params.shift();
    }

    for(let i = 0; i < window._ump_store[eventName].length; i++) {
      window._ump_store[eventName][i] && window._ump_store[eventName][i].apply(window._ump_store[eventName][i], params);
    }
  }
};

bubble.off = function (eventName, fn) {
  if(window._ump_store[eventName] && window._ump_store[eventName].length > 0) {
    if(!fn) {
      window._ump_store[eventName] = [];
    }else {
      for (let  i = 0, n = 0; i < window._ump_store[eventName].length; i ++) {
        if (window._ump_store[eventName][i] !== fn) {
          window._ump_store[eventName][n++] = window._ump_store[eventName][i];
        }
      }
      window._ump_store[eventName].length -= 1;
    }
  }
};

export default bubble;
