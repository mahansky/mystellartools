import * as types from '../mutation-types'
import { remove } from 'lodash'
const AES = require('crypto-js/aes')

// state
export const state = {
  accounts: [],
}

// mutations
export const mutations = {
  [types.STORE_ACCOUNT] (state, account) {
    if (account.secret_key) {
      account.secret_key = AES.encrypt(account.secret_key, account.password).toString()

      delete account['password']
    }

    state.accounts.push(account)
  },

  [types.REMOVE_ACCOUNT] (state, publicKey) {
    remove(state.accounts, function (account) {
      return account.public_key === publicKey
    })
  },

  [types.REMOVE_ACCOUNTS] (state) {
    state.accounts = []
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

  removeAccounts ({commit}) {
    commit(types.REMOVE_ACCOUNT)
  },
}

// getters
export const getters = {
  accounts: state => state.accounts,
}
