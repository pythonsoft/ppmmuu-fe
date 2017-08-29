var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('./config');
var path = require('path');

var DEBUG = process.env.NODE_ENV === 'development';
var assetsSubDirectory = DEBUG ? config.dev.assetsSubDirectory : config.build.assetsSubDirectory;

module.exports = {
  entry: {
    fjUI: './src/fe/component/fjUI',
    app: './src/fe/app.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: [
              'vue-style-loader',
              { loader: 'css-loader', options: { minimize: true } }
            ],
            postcss: [
              'vue-style-loader',
              { loader: 'css-loader', options: { minimize: true } }
            ]
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime', 'transform-vue-jsx']
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
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
        })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'url-loader',
        options: {
          name: path.join(assetsSubDirectory, '/fonts/[name].[ext]?[hash]'),
          limit: 100000
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: path.join(assetsSubDirectory, '/img/[name].[ext]?[hash]')
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // 只接受node_modules目录里的库
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new ExtractTextPlugin(path.join(assetsSubDirectory, '/css/[name].[contenthash].css'))
  ]
};
