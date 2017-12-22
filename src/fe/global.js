/**
 * Created by steven on 2017/11/12.
 */
const config = {};

config.baseDomain = '10.0.15.152:8080';
//config.baseDomain = '10.0.16.100:8080';

config.streamURL = 'http://ump-live.phoenixtv.com';
// config.streamURL = 'http://10.0.15.68:8099';

config.socketDomain = 'localhost:9000';

if (window.location.hostname.indexOf('phoenixtv.com') !== -1) {
  config.baseDomain = 'ump-api.phoenixtv.com';
}

config.baseURL = `http://${config.baseDomain}`;


// im地址
config.imHost = '10.0.15.152';
config.imPort = 9000;
config.umpAssistQueueName = 'ump-assist-queue';

module.exports = config;
