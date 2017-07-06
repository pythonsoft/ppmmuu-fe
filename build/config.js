module.exports = {
  build: {
    port: 8000,
    assetsPublicPath: '/'
  },
  dev: {
    port: 8000,
    autoOpenBrowser: true,
    assetsPublicPath: '/',
    routerPath: 'src/fe/routers',
    outputPath: 'dist'
  }
}
