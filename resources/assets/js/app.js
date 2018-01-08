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

// DEBUG
import { Stellar } from '~/stellar'

store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromSecret('SCQSS4FGSBORSP2O543GCHECPJGOMVCL7CINLS3YBA4V47AHZ665ZZSG')})
router.push({name: 'receive'})