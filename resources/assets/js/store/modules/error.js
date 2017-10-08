import * as types from '../mutation-types'

// state
export const state = {
  error: '',
}

// mutations
export const mutations = {
  [types.STORE_ERROR] (state, error) {
    state.error = error
  },

  [types.REMOVE_ERROR] (state) {
    state.error = null
  },
}

// actions
export const actions = {
  storeError ({commit}, payload) {
    commit(types.STORE_ERROR, payload)

    setTimeout(() => {
      commit(types.REMOVE_ERROR)
    }, 5000)
  },

  removeError ({commit}) {
    commit(types.REMOVE_ERROR)
  }
}

// getters
export const getters = {
  error: state => state.error,
}
