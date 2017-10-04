import Vue from 'vue'
import store from '~/store'
import router from '~/router'
import App from '~/components/App'
import '~/plugins'

Vue.config.productionTip = false

let vue = new Vue({
  store,
  router,
  ...App
})

// testing
let Stellar = require('stellar-sdk')
// vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromSecret('SCQSS4FGSBORSP2O543GCHECPJGOMVCL7CINLS3YBA4V47AHZ665ZZSG')})
vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey('GBK4DFCUAZRNU7TJ4XUOJEADVQBLGVVVFKRTHHXNAXD7MTYUWR7HKCNY')})
