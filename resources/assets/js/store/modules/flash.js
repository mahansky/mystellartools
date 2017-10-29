import * as types from '../mutation-types'

// state
export const state = {
  message: '',
  type: '',
}

// mutations
export const mutations = {
  [types.STORE_FLASH] (state, payload) {
    state.message = payload.message

    if (payload.message.message) {
      state.message = payload.message.message

      if (payload.message.message.detail) {
        state.message = payload.message.message.detail
      }

      if (payload.message.response) {
        if (payload.message.response.data && payload.message.response.data.message) {
          state.message = payload.message.response.data.message
        }

        if (payload.message.response.data && payload.message.response.data.detail) {
          state.message = payload.message.response.data.detail
        }
      }
    }

    state.type = payload.type
  },

  [types.REMOVE_FLASH] (state) {
    state.message = null
  },
}

// actions
export const actions = {
  storeFlash ({commit}, payload) {
    console.log('Incoming flash:', payload)
    commit(types.STORE_FLASH, payload)

    setTimeout(() => {
      commit(types.REMOVE_FLASH)
    }, 10000)
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
