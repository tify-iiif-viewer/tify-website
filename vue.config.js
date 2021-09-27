const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')

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
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/',
          '/examples/basic',
          '/examples/multiple',
          '/examples/api',
        ],
      }),
    ] : [],
  },
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
