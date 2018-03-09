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

// import { Stellar } from '~/stellar'
// store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromSecret('SB3FTRQAWACETCN25GD2ND5BLCNLR2666H5OYFPSL46GVM65SWKM4LKU')})
// router.push({name:'explorer'})