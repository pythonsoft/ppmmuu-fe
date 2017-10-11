const utils = require('../../../../common/utils');

const config = {};

config.TYPE = {
  DOWNLOAD: { text: '下载', value: '1', key: 'DOWNLOAD' },
  DOWNLOAD_MEDIAEXPRESS: { text: '凤云快传', value: '2', key: 'DOWNLOAD' },
};

config.getTextByValue = function(v, st) {
  return utils.getTextByValue(config, v, st);
};

module.exports = config;
