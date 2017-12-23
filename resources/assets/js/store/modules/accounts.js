import * as types from '../mutation-types'

const AES = require('crypto-js/aes')

export const state = {
  accounts: [],
}

export const mutations = {
  [types.STORE_ACCOUNT] (state, account) {
    if (account.secret_key) {
      account.secret_key = AES.encrypt(account.secret_key, account.password).toString()

      delete account['password']
    }

    state.accounts.push(account)
  },

  [types.REMOVE_ACCOUNT] (state, publicKey) {
    for (let i = state.accounts.length - 1; i >= 0; --i) {
      if (state.accounts[i].public_key === publicKey) {
        state.accounts.splice(i, 1);
      }
    }
  },

  [types.REMOVE_ACCOUNTS] (state) {
    state.accounts = []
  },
}

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

export const getters = {
  accounts: state => state.accounts,
}
