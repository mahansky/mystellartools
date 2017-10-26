<template>
  <div id="app">
    <loading ref="loading"></loading>

    <transition name="page" mode="out-in">
      <component v-if="layout" :is="layout"></component>
    </transition>

    <flash ref="flash"></flash>
  </div>
</template>

<script>
import Loading from './Loading'
import Flash from './Flash'

// Load layout components dynamically.
const requireContext = require.context('../layouts', false, /.*\.vue$/)

const layouts = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
  )
  .reduce((components, [name, component]) => {
    components[name] = component
    return components
  }, {})

export default {
  el: '#app',

  components: {
    Loading,
    Flash,
  },

  metaInfo () {
    const { appName } = window.config

    return {
      title: appName,
      titleTemplate: `%s - ${appName}`
    }
  },

  data: () => ({
    layout: null,
    defaultLayout: 'app'
  }),

  mounted () {
    this.$loading = this.$refs.loading
    this.$flash = this.$refs.flash
  },

  methods: {
    /**
     * Set the application layout.
     *
     * @param {String} layout
     */
    setLayout (layout) {
      if (!layout || !layouts[layout]) {
        layout = this.defaultLayout
      }

      this.layout = layouts[layout]
    }
  }
}
</script>
