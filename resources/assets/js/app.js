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
vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromSecret('SDXYE46DX7FB4XXMEKKZ2GYLVYUSTKULAVUFP7BVLNLKVQDJYNRRD7LK')})
// vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey('GBK4DFCUAZRNU7TJ4XUOJEADVQBLGVVVFKRTHHXNAXD7MTYUWR7HKCNY')})
// vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey('GCMISAYBG7LNKRJ5W2I7JO66VVQWUJAUSJ4UONBQFV67NTISHU6HJW4T')})
// vue.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromSecret('SAPM5U5MAVGIOSONFTPI24GVD7HODZXMGOBA2MOYN5M5N3IJRWRLJHGX')})
