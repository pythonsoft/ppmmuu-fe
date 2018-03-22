const config = {};

config.basicFields = {
  基本信息: {
    templateName: {
      field: 'templateName', type: 'input', text: '模板名称', required: true, value: '', show: true
    },
    templateCode: {
      field: 'templateCode', type: 'input', text: '模板编码', required: true, value: '', show: true
    },
    fileformat: {
      field: 'fileformat',
      type: 'select',
      text: '容器格式',
      required: true,
      selected: 'mxf',
      show: true,
      options: [
        { text: 'avi', value: 'avi', key: 'avi' },
        { text: 'mpg', value: 'mpg', key: 'mpg' },
        { text: 'mp4', value: 'mp4', key: 'mp4' },
        { text: 'mov', value: 'mov', key: 'mov' },
        { text: 'mxf', value: 'mxf', key: 'mxf' },
        { text: 'ts', value: 'ts', key: 'ts' },
        { text: 'vob', value: 'vob', key: 'vob' },
        { text: 'flv', value: 'flv', key: 'flv' },
        { text: 'mp3', value: 'mp3', key: 'mp3' },
        { text: 'wav', value: 'wav', key: 'wav' },
        { text: 'wma', value: 'wma', key: 'wma' }
      ]
    }
  }
};
config.videoFields = {
  视频参数: {
    enablevideo: {
      field: 'enablevideo',
      type: 'select',
      text: '是否包含视频流',
      required: true,
      selected: 'true',
      options: [
        { text: '是', value: 'true', key: 'enablevideo1' },
        { text: '否', value: 'false', key: 'enablevideo2' }
      ]
    },
    vcodec: {
      field: 'vcodec',
      type: 'select',
      text: '编码格式',
      required: true,
      selected: 'libx264',
      show: true,
      options: [
        { text: 'libx264', value: 'libx264', key: 'libx264' },
        { text: 'mpeg2video', value: 'mpeg2video', key: 'mpeg2video' },
        { text: 'prores', value: 'prores', key: 'prores' }
      ]
    },
    pixfmt: {
      field: 'pixfmt',
      type: 'select',
      text: '采样格式',
      required: false,
      selected: 'yuv420p',
      options: [
        { text: 'yuv420p', value: 'yuv420p', key: 'yuv420p' },
        { text: 'yuv422p', value: 'yuv422p', key: 'yuv422p' },
        { text: 'yuyv422p', value: 'yuyv422p', key: 'yuyv422p' },
        { text: 'yuv422p10le', value: 'yuv422p10le', key: 'yuv422p10le' }]
    },
    wh: {
      field: 'wh',
      type: 'select',
      text: '分辨率',
      required: true,
      selected: '1920x1080',
      show: true,
      options: [
        { text: '1920x1080', value: '1920x1080', key: '1920x1080' },
        { text: '1280x720', value: '1280x720', key: '1280x720' },
        { text: '720x576', value: '720x576', key: '720x576' },
        { text: '640x360', value: '640x360', key: '640x360' }
      ]
    },
    vbitrate: {
      field: 'vbitrate',
      type: 'input',
      text: '比特率',
      required: false,
      value: '150',
      show: true,
      unit: 'MB',
      formatter: function (value) { return value * 1000 * 1000; }
    },
    framerate: {
      field: 'framerate', type: 'input', text: '帧率', required: false, value: '25', show: true, unit: '帧/秒'
    },
    progressive: {
      field: 'progressive',
      type: 'select',
      text: '逐行扫描',
      required: false,
      selected: 'true',
      options: [
        { text: '是', value: 'true', key: 'progressive1' },
        { text: '否', value: 'false', key: 'progressive2' }
      ]
    },
    level: {
      field: 'level',
      type: 'select',
      text: '等级',
      required: false,
      selected: 'null',
      options: [
        { text: 'baseline', value: 'baseline', key: 'baseline' },
        { text: 'main', value: 'main', key: 'main' },
        { text: 'high', value: 'high', key: 'high' },
        { text: 'SQ', value: 'SQ', key: 'SQ' },
        { text: 'HQ', value: 'HQ', key: 'HQ' },
        { text: '3.1', value: '3.1', key: '3.1' },
        { text: '4.0', value: '4.0', key: '4.0' },
        { text: '4.1', value: '4.1', key: '4.1' },
        { text: 'null', value: 'null', key: 'null' }
      ]
    },
    intra: {
      field: 'intra',
      type: 'select',
      text: '是否全是I帧',
      required: false,
      selected: '0',
      options: [
        { text: '是', value: '1', key: 'intra1' },
        { text: '否', value: '0', key: 'intra2' }
      ]
    },
    target: {
      field: 'target',
      type: 'select',
      text: 'Commercial sign',
      required: false,
      selected: 'null',
      options: [
        { text: 'null', value: 'null', key: 'null' },
        { text: 'xdcamhd422', value: 'xdcamhd422', key: 'xdcamhd422' },
        { text: 'imx50', value: 'imx50', key: 'imx50' },
        { text: 'dvcpro50', value: 'dvcpro50', key: 'dvcpro50' }
      ]
    }
  },
  水印参数: {
    watermarkFile: {
      field: 'watermarkFile', type: 'input', text: '水印地址', required: false, value: 'null'
    },
    isUsed: {
      field: 'isUsed',
      type: 'select',
      text: '是否启用',
      required: true,
      selected: '0',
      options: [
        { text: '否', value: '0', key: 'isUsed0' },
        { text: '是', value: '1', key: 'isUsed1' }
      ]
    },
    position: {
      field: 'position',
      type: 'select',
      text: '位置',
      required: true,
      selected: '0',
      options: [
        { text: '左上角', value: '0', key: 'position0' },
        { text: '右上角', value: '1', key: 'position1' },
        { text: '左下角', value: '2', key: 'position2' },
        { text: '右下角', value: '3', key: 'position3' }
      ]
    },
    xmargin: {
      field: 'xmargin', type: 'input', text: 'X边距', required: false, value: 'null'
    },
    ymargin: {
      field: 'ymargin', type: 'input', text: 'Y边距', required: false, value: 'null'
    }
  }
};
config.audioFields = {
  音频参数: {
    enableaudio: {
      field: 'enableaudio',
      type: 'select',
      text: '是否包含音频流',
      required: true,
      selected: 'true',
      options: [
        { text: '是', value: 'true', key: 'enableaudio1' },
        { text: '否', value: 'false', key: 'enableaudio2' }
      ]
    },
    acodec: {
      field: 'acodec',
      type: 'select',
      text: '编码格式',
      required: true,
      selected: 'libfdk_aac',
      show: true,
      options: [
        { text: 'MP2', value: 'mp2', key: 'mp2' },
        { text: 'MP3', value: 'libmp3lame', key: 'libmp3lame' },
        { text: 'AAC', value: 'libfdk_aac', key: 'libfdk_aac' },
        { text: 'PCM16', value: 'pcm_s16le', key: 'pcm_s16le' },
        { text: 'WMA', value: 'wmav2', key: 'wmav2' }
      ]
    },
    samplerate: {
      field: 'samplerate',
      type: 'select',
      text: '采样率',
      required: true,
      selected: '48000',
      show: true,
      unit: 'Hz',
      options: [
        { text: '44100', value: '44100', key: 'samplerate2' },
        { text: '48000', value: '48000', key: 'samplerate1' }
      ]
    },
    abitrate: {
      field: 'abitrate',
      type: 'input',
      text: '比特率',
      required: false,
      value: '128',
      show: true,
      unit: 'MB',
      formatter: function (value) { return value * 1000; }
    },
    audioIndexs: {
      field: 'audioIndexs', type: 'input', text: '音轨数量', required: false, value: '1'
    }
  }
};
config.videoType = 'mp4,avi,mpg,mov,mxf,ts,vob,flv';
config.audioType = 'mp3,wav,wma';

config.getFormData = function getFormData(types = ['basicFields', 'videoFields', 'audioFields']) {
  const form = {};
  let fields = {};
  types.forEach((type) => {
    fields = Object.assign({}, fields, config[type]);
  });
  const keys = Object.keys(fields);
  for (let i = 0, len = keys.length; i < len; i++) {
    const section = fields[keys[i]];
    const sectionKeys = Object.keys(section);
    for (let j = 0; j < sectionKeys.length; j++) {
      const item = section[sectionKeys[j]];
      form[item.field] = item.type === 'select' ? item.selected : item.value;
    }
  }
  return form;
};

config.getFormRules = function getFormRules(types = ['basicFields', 'videoFields', 'audioFields']) {
  const rules = {};
  const fields = Object.assign({}, config.basicFields, config.videoFields, config.audioFields);
  const keys = Object.keys(fields);
  for (let i = 0, len = keys.length; i < len; i++) {
    const section = fields[keys[i]];
    const sectionKeys = Object.keys(section);
    for (let j = 0; j < sectionKeys.length; j++) {
      const item = section[sectionKeys[j]];
      if (item.required) {
        rules[item.field] = [];
        if (item.type === 'select') {
          rules[item.field].push({ required: true, message: `请选择${item.text}` });
        } else {
          rules[item.field].push({ required: true, message: `请输入${item.text}` });
        }
      }
    }
  }
  return rules;
};

config.getFields = function getFields(){
  const fields = {};
  for(let key in config.basicFields['基本信息']) {
    fields[key] = config.basicFields['基本信息'][key];
  }
  for(let key in config.videoFields['视频参数']) {
    fields[key] = config.videoFields['视频参数'][key];
  }
  for(let key in config.videoFields['水印参数']) {
    fields[key] = config.videoFields['水印参数'][key];
  }
  for(let key in config.audioFields['音频参数']) {
    fields[key] = config.audioFields['音频参数'][key];
  }
  return fields;
}
module.exports = config;
