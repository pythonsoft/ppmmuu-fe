export default function (fn, interval) {
  const todo = fn;
  let timer;
  let isFirstTime = true;
  return (...args) => {
    // 第一次立即调用
    if (isFirstTime) {
      todo.apply(this, args);
      isFirstTime = false;
      return;
    }
    // 如果该次延迟执行还没有完成，则忽略接下来调用该函数的请求
    if (timer) return;
    // 将即将被执行的函数延迟一段时间执行
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      todo.apply(this, args);
    }, interval || 500);
  };
}
