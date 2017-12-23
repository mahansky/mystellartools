import './components'
import './axios'
import './analytics'
import Vue from 'vue'
import Vuetify from 'vuetify'
import BigNumber from 'bignumber.js'

Vue.use(Vuetify)

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
  }
})