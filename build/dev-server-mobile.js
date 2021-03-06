const path = require('path');
const express = require('express');
const del = require('del');
const opn = require('opn');
const fs = require('fs');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./webpack.dev.conf.mobile');
const config = require('./config-mobile');
const app = express();

app.use('/img', express.static(path.join(__dirname, '../src/fe-mobile/img')));
app.use('/static', express.static(path.join(__dirname, '../src/fe/static')));

const autoOpenBrowser = !!config.dev.autoOpenBrowser;
const port = process.env.PORT || config.dev.port;
const uri = 'http://localhost:' + port;

let compiler = webpack(webpackConfig);
const devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: false,
  stats: {
    colors: true,
    chunks: false
  },
  publicPath: webpackConfig.output.publicPath
});
const hotMiddleware = webpackHotMiddleware(compiler);

compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' });
    cb();
  });
});

app.use(require('connect-history-api-fallback')());

app.use(hotMiddleware);
app.use(devMiddleware);

devMiddleware.waitUntilValid(function () {
  if (autoOpenBrowser) {
    opn(uri);
  }
})

const server = app.listen(port, function() {
  console.log('Listening on 1 port ' + port + '...');
});
