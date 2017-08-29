var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEBUG = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    fjUI: './src/fe/component/fjUI',
    app: './src/fe/app.js'
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: DEBUG ? 'static/js/[name].js' : 'static/js/[name].[chunkhash].js',
    chunkFilename: DEBUG ? 'static/js/[name].[id].js' : 'static/js/[id].[chunkhash].js'
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
        loader: 'vue-loader'
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
          limit: 100000
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
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
    new ExtractTextPlugin('static/css/[name].[contenthash].css'),
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
};
