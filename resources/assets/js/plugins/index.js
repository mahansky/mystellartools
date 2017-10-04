import './axios'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

Vue.mixin({
  methods: {
    amountFormat (amount) {
      let parts = amount.toString().split('.')
      let out = parts[0]

      if (parts.length === 2) {
        out += '<small>.' + parts[1] + '</small>'
      }

      return out
    }
  }
})