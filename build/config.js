var path = require('path');

module.exports = {
  build: {
    port: 8000,
    assetsPublicPath: '/',
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'public/static',
    index: path.resolve(__dirname, '../dist/index.html')
  },
  dev: {
    port: 8000,
    autoOpenBrowser: true,
    assetsPublicPath: '/',
    routerPath: 'src/fe/routers',
    outputPath: 'dist'
  }
}
