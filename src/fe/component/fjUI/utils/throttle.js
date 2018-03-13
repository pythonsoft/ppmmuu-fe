export default function (fn, interval) {
  const todo = fn;
  let timer;
  let isFirstTime = true;
  return (...args) => {
    if (isFirstTime) {
      todo.apply(this, args);
      isFirstTime = false;
      return;
    }
    if (timer) return;
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      todo.apply(this, args);
    }, interval || 500);
  };
}
