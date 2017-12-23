<template>
  <div id="app">
    <transition name="page" mode="out-in">
      <component v-if="layout" :is="layout"></component>
    </transition>

    <flash ref="flash"></flash>
  </div>
</template>

<script>
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
    Flash,
  },

  metaInfo () {
    const appName = 'MyStellar.Tools'

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
