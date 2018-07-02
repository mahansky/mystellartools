import * as types from '../mutation-types'

export const state = {
  keypair: null,
  ledger: false,
  ledgerAppVersion: '',
  bip32Path: '',
  stellarGuard: false,
}

export const mutations = {
  [types.STORE_KEYPAIR] (state, {keypair}) {
    state.keypair = keypair
  },

  [types.REMOVE_KEYPAIR] (state) {
    state.keypair = null
    state.ledger = false
  },

  [types.ACCESS_WITH_LEDGER] (state, {bip32Path, version}) {
    state.ledger = true
    state.bip32Path = bip32Path
    state.ledgerAppVersion = version
  },

  [types.STELLAR_GUARD] (state, enabled) {
    state.stellarGuard = enabled
  }
}

export const actions = {
  storeKeypair ({commit}, payload) {
    commit(types.STORE_KEYPAIR, payload)
  },

  removeKeypair ({commit}) {
    commit(types.REMOVE_KEYPAIR)
  },

  accessWithLedger({commit}, payload) {
    commit(types.ACCESS_WITH_LEDGER, payload)
  },
}

export const getters = {
  keypair: state => state.keypair,
  keypairCanSign: state => state.keypair ? state.keypair.canSign() : false,
  keypairLedger: state => state.ledger,
  keypairLedgerAppVersion: state => state.ledgerAppVersion,
  keypairBip32Path: state => state.bip32Path,
}
