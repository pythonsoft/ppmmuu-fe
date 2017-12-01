export const DAY_DURATION = 24 * 60 * 60 * 1000;

export const isDate = function (date) {
  if (date === undefined || date === null) return false;
  return !isNaN(new Date(date).getTime());
};
export const toDate = function (date) {
  return isDate(date) ? new Date(date) : null;
};
export const fillupZero = function (v) {
  return v < 10 ? `0${v}` : v;
};
export const clearHours = function (time) {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

export const formatDate = function (date, format = 'YYYY-MM-DD') {
  date = toDate(date);
  if (!date) return '';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const secs = date.getSeconds();

  let result = format;
  result = result.replace(/YYYY/, year);
  result = result.replace(/MM/, fillupZero(month));
  result = result.replace(/DD/, fillupZero(day));
  result = result.replace(/HH/, fillupZero(hours));
  result = result.replace(/mm/, fillupZero(minutes));
  result = result.replace(/ss/, fillupZero(secs));
  return result;
};
