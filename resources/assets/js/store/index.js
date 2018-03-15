import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { Keypair } from 'stellar-sdk'

Vue.use(Vuex)

// Load store modules dynamically.
const requireContext = require.context('./modules', false, /.*\.js$/)

const modules = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
  )
  .reduce((modules, [name, module]) => {
    modules[name] = module
    return modules
  }, {})

export default new Vuex.Store({
  modules,
  plugins: [createPersistedState({
    key: 'mystellar.tools',
    paths: [
      'accounts',
      'contacts',
      'keypair',
      'transactions',
    ],
    getState: function (key, storage, value) {
      try {
        if ((value = storage.getItem(key)) && value !== 'undefined') {
          let data = JSON.parse(value)

          if (data['keypair']) {
            let keypair = Keypair.fromPublicKey(data['keypair']['public_key'])

            delete data['keypair']['public_key']

            data['keypair']['keypair'] = keypair
          }

          return data
        }
      } catch (err) {}

      return undefined
    },

    setState: function (key, state, storage) {
      let newState = JSON.parse(JSON.stringify(state))

      if (state.keypair && state.keypair.keypair) {
        let publicKey = state.keypair.keypair.publicKey()

        delete newState['keypair']

        newState['keypair'] = {}
        newState['keypair']['public_key'] = publicKey
      } else {
        delete newState['keypair']
      }

      return storage.setItem(key, JSON.stringify(newState))
    }
  })],
})
