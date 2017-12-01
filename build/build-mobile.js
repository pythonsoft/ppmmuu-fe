const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.conf.mobile');
const config = require('./config-mobile');
const rm = require('rimraf');
const path = require('path');

console.log('building for production...');
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');
    if (stats.hasErrors()) {
      console.log('Build failed with errors.\n');
      process.exit(1);
    }
    console.log('Build complete.\n');
  });
})
