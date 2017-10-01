import * as types from '../mutation-types'

// state
export const state = {
  keypair: null
}

// mutations
export const mutations = {
  [types.STORE_KEYPAIR] (state, {keypair}) {
    state.keypair = keypair
  },

  [types.REMOVE_KEYPAIR] (state) {
    state.keypair = null
  },
}

// actions
export const actions = {
  storeKeypair ({commit}, payload) {
    commit(types.STORE_KEYPAIR, payload)
  },

  removeKeypair ({commit}) {
    commit(types.REMOVE_KEYPAIR)
  }
}

// getters
export const getters = {
  keypair: state => state.keypair,
  keypairCanSign: state => state.keypair ? state.keypair.canSign() : false,
}
