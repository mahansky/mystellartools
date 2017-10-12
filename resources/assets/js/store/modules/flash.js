import * as types from '../mutation-types'

// state
export const state = {
  message: '',
  type: '',
}

// mutations
export const mutations = {
  [types.STORE_FLASH] (state, {message, type}) {
    state.message = message

    if (message.message) {
      state.message = message.message

      if (message.message.detail) {
        state.message = message.message.detail
      }
    }

    state.type = type
  },

  [types.REMOVE_FLASH] (state) {
    state.message = null
  },
}

// actions
export const actions = {
  storeFlash ({commit}, payload) {
    commit(types.STORE_FLASH, payload)

    // setTimeout(() => {
    //   commit(types.REMOVE_FLASH)
    // }, 5000)
  },

  removeFlash ({commit}) {
    commit(types.REMOVE_FLASH)
  }
}

// getters
export const getters = {
  flash: state => {
    return {
      message: state.message,
      type: state.type,
    }
  },
}
