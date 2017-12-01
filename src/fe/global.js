/**
 * Created by steven on 2017/11/12.
 */
const config = {};

config.baseDomain = 'localhost:8080';
// config.baseDomain = '10.0.16.107:8080';

config.baseURL = `http://${config.baseDomain}`;

config.streamURL = 'http://ump-live.phoenixtv.com';
// config.streamURL = 'http://10.0.15.68:8099';

config.socketDomain = 'localhost:9000';

if (window.location.hostname.indexOf('phoenixtv.com') !== -1) {
  config.baseURL = 'http://ump-api.phoenixtv.com';
}

module.exports = config;
