const api = require('../../api/media');
const utils = require('../../common/utils');

const common = {
  getThumb(item) {
    return api.getIcon(item.id);
  },
  getDuration(item) {
    return utils.formatDuration(item.duration / 25 * 1000);
  },
  getMediaFormatStyle(item) {
    return item.hd_flag === 0 ? 'media-center-color-span _480P' : 'media-center-color-span _1080P';
  },
  getMediaFormat(item) {
    return item.hd_flag === 0 ? '720P' : '1080P';
  },
  getReplaceName(item) {
    let name = this.getTitle(item);

    if (name) {
      name = name.replace('<em>', '');
      name = name.replace('</em>', '');
    }
    return name;
  },
  getTitle(item) {
    return item.program_name_en || item.program_name_cn || item.name || '(此视频不包含标题信息)';
  }
};

module.exports = common;
