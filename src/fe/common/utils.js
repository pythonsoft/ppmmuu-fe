const utils = {};

utils.formatQuery = function formatQuery(obj, isGet = false) {
  const rs = Object.assign(obj);
  rs.timestamps = new Date().getTime();

  return isGet ? { params: rs } : rs;
};

utils.deepClone = function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * @description 去重合并
 * @param arr1
 * @param arr2
 * @returns []
 */
utils.hardMerge = function hardMerge(arr1, arr2){
  for (var i = 0 ; i < arr1.length ; i ++ ){
    for(var j = 0 ; j < arr2.length ; j ++ ){
      if (arr1[i] === arr2[j]){
        arr1.splice(i,1);
      }
    }
  }
  for(var i = 0; i <arr2.length; i++){
    arr1.push(arr2[i]);
  }
  return arr1;
}

module.exports = utils;
