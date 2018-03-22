/**
 * Created by steven on 2017/8/21.
 */

const config = {};

config.getTextValueByType = {
  1: '快编',
  2: '入库',
  3: '上架',
}

config.TYPE_MAP = {
  '1': '快编',
  '2': '入库',
  '3': '上架',
}

config.TYPE = [
  { text: '快编', value: '1', key: '1' },
  { text: '入库', value: '2', key: '2' },
  { text: '上架', value: '3', key: '3' },
];

module.exports = config;
