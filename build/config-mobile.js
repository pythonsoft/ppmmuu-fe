var path = require('path');
module.exports = {
  build: {
    port: 8000,
    assetsPublicPath: '/',
    assetsRoot: path.resolve(__dirname, '../dist/mobile', 'public'),
    assetsSubDirectory: 'static',
    index: path.resolve(__dirname, '../dist/mobile', 'public', 'index.html')
  },
  dev: {
    port: 8001,
    autoOpenBrowser: true,
    assetsPublicPath: '/',
    assetsSubDirectory: 'static',
    assetsRoot: path.resolve(__dirname, '../dist'),
    routerPath: 'src/fe-mobile/routers',
    outputPath: 'dist'
  }
}
