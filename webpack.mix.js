const path = require('path')
const webpack = require('webpack')
const mix = require('laravel-mix')

// STELLAR NODEJS MIX

if (process.argv.indexOf('--config=stellar.webpack.mix.js') !== -1) {
  console.log('Building Stellar');

  mix.js('resources/assets/js/stellar/external.js', 'stellar.js')

  mix.options({
    uglify: {
      compress: {
        drop_console: false,
      },
    },
  })

  mix.webpackConfig({
    target: 'node',
    plugins: [
      new webpack.IgnorePlugin(/vertx/),
    ],
  })

  return
}

// DEFAULT MIX

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
    'vuex-router-sync'
  ])
}

mix.webpackConfig({
  resolve: {
    alias: {
      '~': path.join(__dirname, './resources/assets/js')
    }
  }
})
