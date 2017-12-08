const supportTouch = 'ontouchstart' in window;

let isDragging = false;

export default function (element, options) {
  const moveFn = function (event) {
    if (options.drag) {
      options.drag(supportTouch ? event.changedTouches[0] || event.touches[0] : event);
    }
  };
  const endFn = function (event) {
    if (!supportTouch) {
      document.removeEventListener('mousemove', moveFn);
      document.removeEventListener('mouseup', endFn);
    }
    document.onselectstart = null;
    document.ondragstart = null;
    isDragging = false;
    if (options.end) {
      options.end(supportTouch ? event.changedTouches[0] || event.touches[0] : event);
    }
  };
  element.addEventListener(supportTouch ? 'touchstart' : 'mousedown', (event) => {
    if (isDragging) return;
    document.onselectstart = function () {
      return false;
    };
    document.ondragstart = function () {
      return false;
    };
    isDragging = true;
    if (options.start) {
      event.preventDefault();
      options.start(supportTouch ? event.changedTouches[0] || event.touches[0] : event);
    }
  });
  if (supportTouch) {
    element.addEventListener('touchmove', moveFn);
    element.addEventListener('touchend', endFn);
    element.addEventListener('touchcancel', endFn);
  } else {
    element.addEventListener('mousemove', moveFn);
    element.addEventListener('mouseup', moveFn);
  }
}
