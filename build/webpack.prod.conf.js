var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var config = require('./config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseWebpackConfig, {
  output: {
    publicPath: config.build.assetsPublicPath,
    path: config.build.assetsRoot,
    filename: path.join(config.build.assetsSubDirectory, '/js/[name].[chunkhash].js'),
    chunkFilename: path.join(config.build.assetsSubDirectory, '/js/[name].[chunkhash].js')
  },
  devtool: '#source-map',
  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 8889 }),
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
      template: 'index.html',
      inject: true,
      chunksSortMode: 'dependency',
      minify: {
        collapseWhitespace: true
      }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../pm2.json'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/server'),
        to: path.resolve(__dirname, '../dist'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/fe/static'),
        to: path.resolve(__dirname, '../dist/pc/public/static'),
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/fe/public'),
        to: path.resolve(__dirname, '../dist/pc/public'),
        ignore: ['.*']
      }
    ])
  ]
});

