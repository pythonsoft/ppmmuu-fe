var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var config = require('./config-mobile');
var AssetsPlugin = require('assets-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var baseWebpackConfig = require('./webpack.base.conf.mobile');

// ......
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  output: {
    path: config.dev.assetsRoot,
    publicPath: config.dev.assetsPublicPath,
    filename: path.join(config.dev.assetsSubDirectory, '/js/[name].js'),
    chunkFilename: path.join(config.dev.assetsSubDirectory, '/js/[name].[id].js')
  },
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('postcss-import'),
                  require('autoprefixer'),
                  require('postcss-custom-properties')
                ]
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new BrowserSyncPlugin({
    //   port: 8001
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index-mobile.html',
      inject: true,
      chunksSortMode: 'manual',
      chunks: ['vendor', 'fjUI', 'app']
    }),
    new FriendlyErrorsPlugin(),
    new AssetsPlugin({
      path: path.join(__dirname, '../dist'),
      filename: 'assets.json',
      processOutput: function(x) {
        let doc = {};
        for(let k in x) {
          doc[k] = (function(key) {
            let rs = null;
            for(let _k in key) {
              if(_k == 'js') {
                rs = key[_k];
              }else if(_k == 'css') {
                doc['css'] = key[_k];
              }
              // break;
            }
            return rs
          })(x[k]);
        }
        // return `module.exports = ${JSON.stringify(x, null, 2)};`
        return `${JSON.stringify(doc, null, 2)}`
      },
    })
  ]
});
