/**
 * Created by steven on 2017/11/12.
 */
const config = {};

config.baseDomain = 'localhost:8080';

config.baseURL = `http://${baseDomain}`;
// config.baseURL = 'http://10.0.16.125:8080';

// config.streamURL = 'http://localhost:8080';
config.streamURL = 'http://ump-live.phoenixtv.com';

if (window.location.hostname.indexOf('phoenixtv.com') !== -1) {
  config.baseURL = 'http://ump-api.phoenixtv.com';
}

module.exports = config;
