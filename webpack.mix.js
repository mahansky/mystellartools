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
  .disableNotifications()

if (mix.inProduction()) {
  mix.version()

  mix.extract([
    'vue',
    'vform',
    'axios',
    'vuex',
    'jquery',
    'popper.js',
    'vue-meta',
    'bootstrap',
    'vue-router',
    'vuex-router-sync'
  ])
}

mix.webpackConfig({
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ],
  resolve: {
    alias: {
      '~': path.join(__dirname, './resources/assets/js')
    }
  }
})
