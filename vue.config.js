function getGzippedSize(file) {
  const { execSync } = require('child_process')
  return parseInt(execSync(`gzip-size --raw ${file}`), 10)
}

process.env.VUE_APP_TIFY_SIZE = getGzippedSize('node_modules/tify/dist/tify.js')
  + getGzippedSize('node_modules/tify/dist/tify.css')
process.env.VUE_APP_TIFY_VERSION = require('tify/package.json').version

module.exports = {
  chainWebpack: (config) => {
    config.module.rule('eslint')
      .use('eslint-loader')
      .options({ fix: true })

    // Prevent linting of local node modules used for testing
    config.resolve.symlinks(false)
  },
  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        loader: 'raw-loader',
      }],
    },
    plugins: process.env.NODE_ENV === 'production' ? [
      new (require('prerender-spa-plugin'))({
        staticDir: require('path').join(__dirname, 'dist'),
        routes: [
          '/',
          '/examples/basic/',
          '/examples/multiple/',
          '/examples/api/',
        ],
      }),
    ] : [],
  },
  transpileDependencies: ['tify'],
  productionSourceMap: false,
  pwa: {
    iconPaths: {
      favicon16: null,
      favicon32: null,
    },
    manifestOptions: {
      background_color: '#fff',
    },
    msTileColor: '#fff',
    themeColor: '#06b',
  },
}
