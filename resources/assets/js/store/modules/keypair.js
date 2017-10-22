import * as types from '../mutation-types'

// state
export const state = {
  keypair: null, // keypair
  sss: false, // server side signed
  sssOk: false, // server side signed unlocked
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
  },

  [types.UPDATE_SSS] (state, {sss, sssOk}) {
    state.sss = sss
    state.sssOk = sssOk
  }
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
  }
}

// getters
export const getters = {
  keypair: state => state.keypair,
  keypairCanSign: state => state.keypair ? state.keypair.canSign() : false,
  keypairSss: state => state.keypair ? state.sss : false,
  keypairSssOk: state => state.keypair ? state.sssOk : false,
}
