export const appendToBody = function appendToBody(el) {
  document.body.appendChild(el);
};

export const getPosition = function getPosition(ele, oRefer = document.body) {
  let x = ele.offsetLeft;
  let y = ele.offsetTop;
  let p = ele.offsetParent;
  while (p && p !== oRefer && p !== document.body) {
    if (window.navigator.userAgent.indexOf('MSIE 8.0') > -1) {
      x += p.offsetLeft;
      y += p.offsetTop;
    } else {
      x += p.offsetLeft + p.clientLeft;
      y += p.offsetTop + p.clientTop;
    }
    p = p.offsetParent;
  }
  return { x, y };
};
