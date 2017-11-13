import Vue from 'vue'
import store from '~/store'
import router from '~/router'
import App from '~/components/App'
import '~/plugins'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  ...App
})

// import { Keypair } from 'stellar-sdk'
// let keypair = Keypair.fromSecret('SDXYE46DX7FB4XXMEKKZ2GYLVYUSTKULAVUFP7BVLNLKVQDJYNRRD7LK')
// store.dispatch('storeKeypair', {keypair})
// router.push({name: 'send'})