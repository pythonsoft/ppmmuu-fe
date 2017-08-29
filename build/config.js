var path = require('path');
module.exports = {
  build: {
    port: 8000,
    assetsPublicPath: '/',
    assetsRoot: path.resolve(__dirname, '../dist', 'public'),
    assetsSubDirectory: 'static',
    index: path.resolve(__dirname, '../dist', 'public', 'index.html')
  },
  dev: {
    port: 8000,
    autoOpenBrowser: true,
    assetsPublicPath: '/',
    assetsSubDirectory: 'static',
    assetsRoot: path.resolve(__dirname, '../dist'),
    routerPath: 'src/fe/routers',
    outputPath: 'dist'
  }
}
