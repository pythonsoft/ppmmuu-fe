const utils = require('../../common/utils');

const config = {};
const method = {};

config.FIELD_NAME = {
  ACCESSCOUNT: { cn: '' },
  ARCHIVETYPE: { cn: '' },
  CAPCHANNEL: { cn: '' },
  CHANNEL: { cn: '' },
  CHECKFILE: { cn: '' },
  CREATETIME: { cn: '' },
  DELAFTERARCHIVE: { cn: '' },
  DESCRIPTION: { cn: '' },
  EXPIRETIME: { cn: '' },
  FILECLASS: { cn: '' },
  FILENAME: { cn: '文件名' },
  FILESIZE: { cn: '文件大小' },
  FILETYPE: { cn: '文件类型' },
  FILETYPEID: { cn: '文件类型ID' },
  FILETYPENAME: { cn: '文件类型名称' },
  INPOINT: { cn: '入点' },
  ISOK: { cn: '' },
  LANGUAGEID: { cn: '' },
  LASTACCESS: { cn: '' },
  MD5CODE: { cn: '' },
  MEDIAINFOFLAG: { cn: '' },
  NAME: { cn: '名称' },
  OBJECTID: { cn: '' },
  OUTPOINT: { cn: '出点' },
  PATHID: { cn: '' },
  PROCESSSTATUS: { cn: '' },
  PURGETIME: { cn: '' },
  RESERVED1: { cn: '' },
  RESERVED2: { cn: '' },
  SAID: { cn: '' },
  SANAME: { cn: '' },
  SASTATUS: { cn: '' },
  SATYPE: { cn: '' },
  SOURCE: { cn: '' },
  SPSTATUS: { cn: '' },
  STATUS: { cn: '' },
  STREAMMEDIAID: { cn: '' },
  STREAMMEDIAINFO: { cn: '' },
  STREAMMEDIAINFOID: { cn: '' },
  STREAMTYPE: { cn: '' },
  TAPECODE: { cn: '' },
  UNCPATH: { cn: '' },
  VIDEOSTANDARD: { cn: '' }
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(config, v, st) || {};
};

method.getConfig = function (configName, key) {
  const cfg = config[configName];

  if (cfg && key) {
    return cfg[key] || {};
  }

  return cfg || {};
};

method.searchSelectConfigs = [
  {
    key: 'program_type',
    label: '節目類型',
    items: [
      { value: '', label: '全部'},
      { value: '宣傳', label: '宣傳'},
      { value: '廣告', label: '廣告'},
      { value: '採購', label: '採購'},
      { value: '包裝', label: '包裝'},
      { value: '自製', label: '自製'},
      { value: '墊播', label: '墊播'},
      { value: '素材', label: '素材'}
    ],
    selected: ''
  },
  {
    key: 'ccid',
    label: '編目類',
    items: [
      { value: '', label: '全部'},
      { value: '視音頻類', label: '視音頻類'},
      { value: '片段子類', label: '片段子類'},
      { value: '場景子類', label: '場景子類'},
      { value: '片頭子類', label: '片頭子類'},
      { value: 'segment', label: 'segment'}
    ],
    selected: ''
  },
  {
    key: 'f_str_145',
    label: '新聞類型',
    items: [
      { value: '', label: '全部'},
      { value: '鳳凰新聞', label: '鳳凰新聞'},
      { value: '美聯社外電', label: '美聯社外電'},
      { value: '路透社外電', label: '路透社外電'},
      { value: '香港台新聞', label: '香港台新聞'},
      { value: 'ATV', label: 'ATV'},
      { value: '自拍新聞', label: '自拍新聞'},
      { value: 'CCTV', label: 'CCTV'},
      { value: 'CNN', label: 'CNN'},
      { value: 'OCF', label: 'OCF'},
      { value: '特別節目Feed', label: '特別節目Feed'},
      { value: '台灣新聞', label: '台灣新聞'},
      { value: '墊底片', label: '墊底片'},
      { value: '香港新聞', label: '香港新聞'},
      { value: '大陸新聞', label: '大陸新聞'},
      { value: '咨詢台新聞', label: '咨詢台新聞'},
      { value: '全球', label: '全球'},
      { value: '咨詢台十週年節目素材', label: '咨詢台十週年節目素材'},
      { value: 'NowTV', label: 'NowTV'}
    ],
    selected: ''
  },
  {
    key: 'f_str_324',
    label: '事發國家',
    items: [
      { value: '', label: '全部'},
      { value: '中國', label: 'China CN中國'},
      { value: '中國香港', label: 'Hong Kong CN 中國香港'},
      { value: '斐濟', label: 'Fiji FJ 斐濟'},
      { value: '芬蘭', label: 'Finland FI 芬蘭'},
      { value: '法屬圭亞那', label: 'French Guiana GF 法屬圭亞那'},
      { value: '法屬波利尼西亞', label: 'French Polynesia PF'},
      { value: '法屬南部領土', label: 'French Southern Territories TF'}
    ],
    selected: ''
  },
  {
    key: 'f_str_323',
    label: '版本',
    items: [
      { value: '', label: '全部'},
      { value: '播出版', label: '播出版'},
      { value: '素材版', label: '素材版'},
      { value: '配音字幕版', label: '配音字幕版'},
      { value: '字幕分離播出版', label: '字幕分離播出版'},
      { value: '字幕分離母版', label: '字幕分離母版'},
      { value: '字幕版', label: '字幕版'},
      { value: '母版', label: '母版'},
      { value: '剪輯版', label: '剪輯版'},
      { value: '國際版', label: '國際版'},
      { value: '拷貝板', label: '拷貝板'},
      { value: '播放前版', label: '播放前版'},
      { value: '參展版', label: '參展版'}
    ],
    selected: ''
  },
  {
    key: 'f_str_223',
    label: '製作地點',
    items: [
      { value: '', label: '全部'},
      { value: '北京', label: '北京'},
      { value: '深圳', label: '深圳'},
      { value: '香港', label: '香港'},
      { value: '台北', label: '台北'},
      { value: '上海', label: '上海'},
      { value: 'NIL', label: 'NIL'}
    ],
    selected: ''
  },
  {
    key: 'f_str_314',
    label: '資源所屬部門',
    items: [
      { value: '', label: '全部'},
      { value: '節目資料管理部', label: '節目資料管理部'},
      { value: '鏡面宣傳部', label: '鏡面宣傳部'},
      { value: '頻道編輯部', label: '頻道編輯部'},
      { value: '共享資源', label: '共享資源'},
      { value: '中文台專題主編組', label: '中文台專題主編組'},
      { value: '中文台專題製作組', label: '中文台專題製作組'},
      { value: '中文台娛樂製作組', label: '中文台娛樂製作組'},
      { value: '中文台時尚製作組', label: '中文台時尚製作組'},
      { value: '中文台時尚主編組', label: '中文台時尚主編組'},
      { value: '節目購銷部', label: '節目購銷部'},
      { value: '影帶管理部', label: '影帶管理部'},
    ],
    selected: ''
  },
];

method.searchRadioboxConfigs = [
  {
    key: 'hd_flag',
    label: '高標清',
    items:[
      { value: 1, label: '高清'},
      { value: 0, label: '標清'}
    ],
    selected: ''
  },
  {
    key: 'f_str_067',
    label: '是否歸檔',
    items:[
      { value: '是', label: '是'},
      { value: '否', label: '否'},
    ],
    selected: ''
  }
]

method.getTimeRange = function getTimeRange(datetimerange){
  let result = '';
  if(datetimerange.length) {
    let startTime = datetimerange[0];
    let endTime = datetimerange[1];
    startTime = startTime ? new Date(startTime).toISOString() : '';
    endTime = endTime ? new Date(endTime).toISOString() : '';
    if (startTime && !endTime) {
      result = `[${startTime} TO *]`;
    } else if (!startTime && endTime) {
      result = `[0 TO ${endTime}]`;
    } else if (startTime && endTime) {
      result = `[${startTime} TO ${endTime}]`;
    }
  }
  return result;
}

method.getQuery = function getQuery(configs){
  let q = '';
  for(let i = 0, len = configs.length; i < len; i++){
    const config = configs[i];
    const key = config.key;
    if( config.selected !== undefined && config.selected !== '' ){
      if(q){
        q += ` AND ${key}:${config.selected}`;
      }else{
        q += `${key}:${config.selected}`;
      }
    }
  }

  return q;
}

module.exports = method;
