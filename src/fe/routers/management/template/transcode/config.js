const config = {};

config.fields = [
  {
    field: 'templateName', type: 'input', text: '模板名称', required: true, value: '', show: true
  },
  {
    field: 'templateCode', type: 'input', text: '模板编码', required: true, value: '', show: true
  },
  {
    field: 'fileformat',
    type: 'select',
    text: '容器格式',
    required: true,
    selected: 'mp4',
    show: true,
    options: [
      { text: 'mp4', value: 'mp4', key: 'mp4' },
      { text: 'mxf', value: 'mxf', key: 'mxf' },
      { text: 'mxf', value: 'mxf', key: 'mxf' }
    ]
  },
  {
    field: 'enablevideo',
    type: 'select',
    text: '是否包含视频流',
    required: true,
    selected: 'true',
    options: [
      { text: 'true', value: 'true', key: 'enablevideo1' },
      { text: 'false', value: 'false', key: 'enablevideo1' }
    ]
  },
  {
    field: 'vcodec',
    type: 'select',
    text: '视频流编码格式',
    required: true,
    selected: 'libx264',
    show: true,
    options: [
      { text: 'libx264', value: 'libx264', key: 'libx264' },
      { text: 'mpeg2video', value: 'mpeg2video', key: 'mpeg2video' },
      { text: 'prores', value: 'prores', key: 'prores' }
    ]
  },
  {
    field: 'pixfmt',
    type: 'select',
    text: '视频采样格式',
    required: false,
    selected: 'yuv420p',
    options: [
      { text: 'yuv420p', value: 'yuv420p', key: 'yuv420p' },
      { text: 'yuv422p', value: 'yuv422p', key: 'yuv422p' },
      { text: 'yuyv422', value: 'yuyv422', key: 'yuyv422' },
      { text: 'yuv422p10le', value: 'yuv422p10le', key: 'yuv422p10le' }]
  },
  {
    field: 'gop', type: 'input', text: '图像组数量', required: false, value: 'null'
  },
  {
    field: 'ref', type: 'input', text: 'reframes参考帧', required: false, value: 'null'
  },
  {
    field: 'wh',
    type: 'select',
    text: '视频宽*高',
    required: true,
    selected: '1920x1080',
    show: true,
    options: [
      { text: '1920x1080', value: '1920x1080', key: '1920x1080' },
      { text: '1280x720', value: '1280x720', key: '1280x720' },
      { text: '640x360', value: '640x360', key: '640x360' }
    ]
  },
  {
    field: 'vbitrate', type: 'input', text: '视频比特率', required: false, value: '150000000', show: true
  },
  {
    field: 'framerate', type: 'input', text: '视频帧率', required: false, value: '25', show: true
  },
  {
    field: 'progressive',
    type: 'select',
    text: '逐行扫描',
    required: false,
    selected: 'true',
    options: [
      { text: 'true', value: 'true', key: 'progressive1' },
      { text: 'false', value: 'false', key: 'progressive2' }
    ]
  },
  {
    field: 'scaletype',
    type: 'select',
    text: '比例类型',
    required: false,
    selected: 'null',
    options: [
      { text: 'zoom:缩放', value: 'zoom', key: 'zoom' },
      { text: 'box:黑边', value: 'box', key: 'box' },
      { text: 'cut:剪切', value: 'cut', key: 'cut' }
    ]
  },
  {
    field: 'bframes', type: 'input', text: 'b帧数量', required: false, value: 'null'
  },
  {
    field: 'level',
    type: 'select',
    text: '等级',
    required: false,
    selected: 'high',
    options: [
      { text: 'baseline', value: 'baseline', key: 'baseline' },
      { text: 'main', value: 'main', key: 'main' },
      { text: 'high', value: 'high', key: 'high' },
      { text: 'SQ', value: 'SQ', key: 'SQ' },
      { text: 'HQ', value: 'HQ', key: 'HQ' },
      { text: '3.1', value: '3.1', key: '3.1' },
      { text: '4.0', value: '4.0', key: '4.0' },
      { text: '4.1', value: '4.1', key: '4.1' }
    ]
  },
  {
    field: 'tsbitrate', type: 'input', text: 'ts流比特率', required: false, value: 'null'
  },
  {
    field: 'watermarkFile', type: 'input', text: '水印', required: false, value: 'null'
  },
  {
    field: 'leftmargin', type: 'input', text: '水印left边距', required: false, value: 'null'
  },
  {
    field: 'topmargin', type: 'input', text: '水印top边距', required: false, value: 'null'
  },
  {
    field: 'enableaudio',
    type: 'select',
    text: '是否包含音频流',
    required: true,
    selected: 'true',
    options: [
      { text: 'true', value: 'true', key: 'enableaudio1' },
      { text: 'false', value: 'false', key: 'enableaudio2' }
    ]
  },
  {
    field: 'acodec',
    type: 'select',
    text: '音频编码格式',
    required: true,
    selected: 'libfdk_aac',
    show: true,
    options: [
      { text: 'libfdk_aac', value: 'libfdk_aac', key: 'libfdk_aac' },
      { text: 'pcm_s16le', value: 'pcm_s16le', key: 'pcm_s16le' },
      { text: 'mp2', value: 'mp2', key: 'mp2' }
    ]
  },
  {
    field: 'channels', type: 'input', text: '音频通道数量', required: false, value: '2'
  },
  {
    field: 'samplerate',
    type: 'select',
    text: '音频采样率',
    required: true,
    selected: '48000',
    show: true,
    options: [
      { text: '48000', value: '48000', key: 'samplerate1' },
      { text: '44100', value: '44100', key: 'samplerate2' }
    ]
  },
  {
    field: 'abitrate', type: 'input', text: '音频比特率', required: false, value: '128000', show: true
  },
  {
    field: 'enableAudioMap',
    type: 'select',
    text: '是否支持多音轨',
    required: false,
    selected: 'null',
    options: [
      { text: 'true', value: 'true', key: 'enableaudio1' },
      { text: 'false', value: 'false', key: 'enableaudio2' }
    ]
  },
  {
    field: 'audioIndexs', type: 'input', text: '音轨index', required: false, value: 'null'
  }
];

config.getFormData = function getFormData() {
  const form = {};
  for (let i = 0, len = config.fields.length; i < len; i++) {
    const item = config.fields[i];
    form[item.field] = item.type === 'select' ? item.selected : item.value;
  }
  return form;
};

config.getFormRules = function getFormRules() {
  const rules = {};
  for (let i = 0, len = config.fields.length; i < len; i++) {
    const item = config.fields[i];
    if (item.required) {
      rules[item.field] = [];
      if (item.type === 'select') {
        rules[item.field].push({ required: true, message: `请选择${item.text}` });
      } else {
        rules[item.field].push({ required: true, message: `请输入${item.text}` });
      }
    }
  }
  return rules;
};

module.exports = config;
