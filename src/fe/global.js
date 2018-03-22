/**
 * Created by steven on 2017/11/12.
 */
const config = {};

// im地址
config.imHost = 'localhost';
config.imPort = 9000;

config.socketDomain = `${config.imHost}:${config.imPort}`;

config.baseDomain = 'localhost:8080';

config.streamURL = 'http://ump-live.phoenixtv.com';

if (window.location.hostname.indexOf('phoenixtv.com') !== -1) {
  config.baseDomain = 'ump-api.phoenixtv.com';
  config.socketDomain = 'ump-im.phoenixtv.com';
} else if(window.location.hostname.indexOf('szdev.cn') !== -1) {
  config.baseDomain = 'api.szdev.cn';
  // config.socketDomain = 'ump-im.phoenixtv.com';
}

config.baseURL = `http://${config.baseDomain}`;

module.exports = config;
