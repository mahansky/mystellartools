import * as types from '../mutation-types'

export const state = {
  message: '',
  type: '',
}

export const mutations = {
  [types.STORE_FLASH] (state, payload) {
    state.message = payload.message

    if (payload.message instanceof Error) {
      state.message = payload.message.message
    }

    // TODO: Replace this tryhard code

    if (payload.message && payload.message.data && payload.message.data.detail) {
      state.message = payload.message.data.detail

      if (payload.message.data.extras) {
        if (payload.message.data.extras.result_codes) {
          state.message += ' :: EXTRAS.RESULT_CODES: ' + JSON.stringify(payload.message.data.extras.result_codes)
        }
      }

      if (payload.message.response) {
        if (payload.message.response.data && payload.message.response.data.message) {
          state.message = payload.message.response.data.message
        }

        if (payload.message.response.data && payload.message.response.data.detail) {
          state.message = payload.message.response.data.detail

          if (payload.message.response.data.extras) {
            if (payload.message.response.data.extras.result_codes) {
              if (payload.message.response.data.extras.result_codes.operations) {
                state.message += ' [' + payload.message.response.data.extras.result_codes.operations.join('; ') + ']'
              }
            }
          }
        }
      }
    }

    state.type = payload.type
  },

  [types.REMOVE_FLASH] (state) {
    state.message = null
  },
}

let timeout

export const actions = {
  storeFlash ({commit}, payload) {
    commit(types.STORE_FLASH, payload)

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      timeout = null
      commit(types.REMOVE_FLASH)
    }, 10000)
  },

  removeFlash ({commit}) {
    commit(types.REMOVE_FLASH)
  }
}

export const getters = {
  flash: state => {
    return {
      message: state.message,
      type: state.type,
    }
  },
}
