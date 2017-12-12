import * as types from '../mutation-types'
import { remove } from 'lodash'

// state
export const state = {
  accounts: null,
}

// mutations
export const mutations = {
  [types.STORE_ACCOUNT] (state, account) {
    state.accounts.push(account)
  },

  [types.REMOVE_ACCOUNT] (state, publicKey) {
    remove(state.accounts, function (account) {
      return account.public_key === publicKey
    })
  },
}

// actions
export const actions = {
  storeAccount ({commit}, account) {
    commit(types.STORE_ACCOUNT, account)
  },

  removeAccount ({commit}, publicKey) {
    commit(types.REMOVE_ACCOUNT, publicKey)
  },
}

// getters
export const getters = {
  accounts: state => state.accounts,
}
