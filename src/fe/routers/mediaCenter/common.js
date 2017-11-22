const api = require('../../api/media');
const utils = require('../../common/utils');

const common = {
  getThumb(item) {
    return api.getIcon(item.id, item.from_where);
  },
  getDuration(item) {
    return utils.formatDuration(item.duration / 25 * 1000);
  },
  getMediaFormatStyle(item, className) {
    if (!className) {
      className = 'media-center-color-span';
    }

    return className + (item.hd_flag === 0 ? ' _720P' : ' _1080P');
  },
  getMediaFormat(item) {
    return item.hd_flag === 0 ? '720P' : '1080P';
  },
  getReplaceName(item) {
    let name = common.getTitle(item);

    if (name) {
      name = name.replace('<em>', '');
      name = name.replace('</em>', '');
    }
    return name;
  },
  getTitle(item) {
    return item.name || item.program_name_cn || item.program_name_en || '(此视频不包含标题信息)';
  },
  getDescription(item) {
    return item.content_introduction || item.content || common.getTitle(item);
  }
};

module.exports = common;

