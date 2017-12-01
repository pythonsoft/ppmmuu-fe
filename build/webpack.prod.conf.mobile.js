var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf.mobile');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var config = require('./config-mobile');

module.exports = merge(baseWebpackConfig, {
  output: {
    publicPath: config.build.assetsPublicPath,
    path: config.build.assetsRoot,
    filename: path.join(config.build.assetsSubDirectory, '/js/[name].[chunkhash].js'),
    chunkFilename: path.join(config.build.assetsSubDirectory, '/js/[name].[chunkhash].js')
  },
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new OptimizeCSSPlugin({}),
    new UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index-mobile.html',
      inject: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/server'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/fe/static'),
        to: path.resolve(__dirname, '../dist/mobile/public/static'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/fe/public'),
        to: path.resolve(__dirname, '../dist/mobile/public'),
        ignore: ['.*']
      }
    ])
  ]
});

