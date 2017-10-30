import * as types from '../mutation-types'
import store from '../../store'
import axios from 'axios'
import { Stellar } from '../../stellar'

// state
export const state = {
  accounts: null,
}

// mutations
export const mutations = {
  [types.STORE_ACCOUNTS] (state, accounts) {
    state.accounts = accounts
  },

  [types.REMOVE_ACCOUNTS] (state) {
    state.accounts = null
  },
}

// actions
export const actions = {
  async fetchAccounts ({commit}) {
    try {
      const {data} = await axios.get('/api/accounts')

      commit(types.STORE_ACCOUNTS, data.data)

      if (data.data.length > 0) {
        store.dispatch('storeKeypair', {
          keypair: Stellar.Keypair.fromPublicKey(data.data[0].public_key),
          sss: data.data[0].sss,
        })
      }
    } catch (e) {}
  },

  storeAccounts ({commit}, payload) {
    commit(types.STORE_ACCOUNTS, payload)
  },

  removeAccounts ({commit}) {
    commit(types.REMOVE_ACCOUNTS)
  },
}

// getters
export const getters = {
  accounts: state => state.accounts,
}
