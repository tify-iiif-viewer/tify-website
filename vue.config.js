function getGzippedSize(file) {
  const { execSync } = require('child_process')
  return parseInt(execSync(`gzip-size --raw ${file}`), 10)
}

process.env.VUE_APP_TIFY_SIZE = getGzippedSize('node_modules/tify/dist/tify.js')
  + getGzippedSize('node_modules/tify/dist/tify.css')
process.env.VUE_APP_TIFY_VERSION = require('tify/package.json').version

module.exports = {
  chainWebpack: (config) => {
    config.plugin('eslint').use(require('eslint-webpack-plugin'), [{
      fix: true,
      extensions: ['js', 'vue'],
    }]);

    // Ugly workaround to make tify.css work with WebPack 4
    // Also see main.js and rules below
    config.module.rule('css').exclude.add(/tify\.css$/)
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          loader: 'raw-loader',
        },
        {
          test: /tify\.css$/,
          loader: 'raw-loader',
        }
      ],
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
