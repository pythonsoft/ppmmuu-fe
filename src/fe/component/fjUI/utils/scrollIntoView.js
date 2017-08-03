export default function (container, selected) {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }
  const selectedTop = selected.offsetTop;
  const selectedHeight = selected.offsetHeight;
  const containerHeight = container.clientHeight;
  const containerScrollTop = container.scrollTop;

  if (selectedTop < containerScrollTop) {
    container.scrollTop = selectedTop;
  }
  if (selectedTop + selectedHeight > containerScrollTop + containerHeight) {
    container.scrollTop = (selectedTop + selectedHeight) - containerHeight;
  }
}
