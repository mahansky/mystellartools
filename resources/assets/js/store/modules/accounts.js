import * as types from '../mutation-types'
import store from '../../store'
import axios from 'axios'
import { Stellar } from '../../stellar'

// state
export const state = {
  accounts: null,
  currentAccount: null,
}

// mutations
export const mutations = {
  [types.STORE_ACCOUNTS] (state, accounts) {
    state.accounts = accounts
  },

  [types.STORE_CURRENT_ACCOUNT] (state, {account}) {
    state.currentAccount = account
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

  storeCurrentAccount ({commit}, payload) {
    commit(types.STORE_CURRENT_ACCOUNT, payload)
  },
}

// getters
export const getters = {
  accounts: state => state.accounts,
  hasAccounts: state => state.accounts ? state.accounts.length > 0 : false,
  currentAccount: state => state.currentAccount,
}
