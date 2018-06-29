const path = require('path')
const mix = require('laravel-mix')

mix
  .js('resources/assets/js/app.js', 'public/js')
  .sass('resources/assets/sass/app.scss', 'public/css')

if (mix.inProduction()) {
  mix.version()

  mix.extract([
    'vue',
    'vform',
    'axios',
    'vuex',
    'vue-meta',
    'vue-router',
    'vuex-router-sync',
    'crypto-js',
    '@ledgerhq/hw-app-str',
    'stellar-sdk',
    'vuex-persistedstate',
    'moment',
    'lodash',
    'bignumber.js',
    'vue-analytics',
    'qrious',
    'vis',
    'google-charts',
  ])
}

mix.webpackConfig({
  resolve: {
    alias: {
      '~': path.join(__dirname, './resources/assets/js')
    },
  },
  node: {
    fs: 'empty',
  },
})
