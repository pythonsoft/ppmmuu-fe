const api = require('../../api/media');
const utils = require('../../common/utils');
const global = require('../../global');

const common = {
  getThumb(item) {
    if (item.getIcon) {
      return `${global.baseURL}${item.getIcon}`;
    }
    return api.getIcon(item.id, item.from_where);
  },
  getDuration(item) {
    return utils.formatDuration(item.duration / 25 * 1000);
  },
  getMediaFormatStyle(item, className) {
    if (!className) {
      className = 'media-center-color-span';
    }

    return className + (item.hd_flag === 0 ? ' _SD' : ' _HD');
  },
  getMediaFormat(item) {
    return item.hd_flag === 0 ? 'SD' : 'HD';
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
  },
  formatShowTime(item) {
    const timeConfig = [{
      key: 'full_name',
      name: '',
      value: ''
    }];
    for (let i = 0, len = timeConfig.length; i < len; i++) {
      const temp = timeConfig[i];
      const t = item[temp.key];
      if (t) {
        const compareDate = new Date('1900-01-01');
        if (new Date(t) > compareDate) {
          temp.value = utils.formatTime(t);
          return temp;
        }
      }
    }
    return { key: '', name: '', value: '' };
  }
};

module.exports = common;

