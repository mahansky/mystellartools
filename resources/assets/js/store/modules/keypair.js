import * as types from '../mutation-types'

// state
export const state = {
  keypair: null, // keypair
  sss: false, // server side signed
  sssOk: false, // server side signed unlocked
  ledger: false, // accessed through Ledger (device)
  bip32Path: '',
}

// mutations
export const mutations = {
  [types.STORE_KEYPAIR] (state, {keypair, sss}) {
    state.keypair = keypair
    state.sss = !! sss
  },

  [types.REMOVE_KEYPAIR] (state) {
    state.keypair = null
    state.sss = false
    state.ledger = false
  },

  [types.UPDATE_SSS] (state, {sss, sssOk}) {
    state.sss = sss
    state.sssOk = sssOk
  },

  [types.ACCESS_WITH_LEDGER] (state, {bip32Path}) {
    state.ledger = true
    state.bip32Path = bip32Path
  },
}

// actions
export const actions = {
  storeKeypair ({commit}, payload) {
    commit(types.STORE_KEYPAIR, payload)
  },

  removeKeypair ({commit}) {
    commit(types.REMOVE_KEYPAIR)
  },

  updateSss ({commit}, payload) {
    commit(types.UPDATE_SSS, payload)
  },

  accessWithLedger({commit}, payload) {
    commit(types.ACCESS_WITH_LEDGER, payload)
  },
}

// getters
export const getters = {
  keypair: state => state.keypair,
  keypairCanSign: state => state.keypair ? state.keypair.canSign() : false,
  keypairSss: state => state.keypair ? state.sss : false,
  keypairSssOk: state => state.keypair ? state.sssOk : false,
  keypairLedger: state => state.ledger,
  keypairBip32Path: state => state.bip32Path,
}
