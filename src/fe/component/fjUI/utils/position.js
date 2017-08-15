export const appendToBody = function appendToBody(el) {
  document.body.appendChild(el);
};
export const getPosition = function getPosition(ele, oRefer) {
  //oRefer是定位参照物。可以不写，不写就是和浏览器的绝对位置
  //注意：oRefer必须是ele的offset祖先，要不然取到的值是ele距离body的绝对偏移量

  oRefer = oRefer || document.body;
  let x = ele.offsetLeft;
  let y = ele.offsetTop;
  let p = ele.offsetParent;

  while(p !== oRefer && p !== document.body) {

    if (window.navigator.userAgent.indexOf('MSIE 8.0') > -1) {
      x += p.offsetLeft;
      y += p.offsetTop;
    } else {
      x += p.offsetLeft+p.clientLeft;
      y += p.offsetTop+p.clientTop;
    }

    p = p.offsetParent;
  }

  return { x, y };

};
