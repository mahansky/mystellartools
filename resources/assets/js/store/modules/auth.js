import axios from 'axios'
import * as types from '../mutation-types'

// state
export const state = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
}

// mutations
export const mutations = {
  [types.STORE_AUTH] (state, {user, accessToken, refreshToken}) {
    state.user = user
    state.accessToken = accessToken
    state.refreshToken = refreshToken

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  [types.STORE_TOKENS] (state, {accessToken, refreshToken}) {
    state.accessToken = accessToken
    state.refreshToken = refreshToken

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  [types.FETCH_USER_SUCCESS] (state, {user}) {
    state.user = user
  },

  [types.FETCH_USER_FAILURE] (state) {
    state.accessToken = null
    state.refreshToken = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  [types.LOGOUT] (state) {
    state.user = null
    state.accessToken = null
    state.refreshToken = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  [types.UPDATE_USER] (state, {user}) {
    state.user = user
  }
}

// actions
export const actions = {
  storeAuth ({commit}, payload) {
    commit(types.STORE_AUTH, payload)
  },

  storeTokens ({commit}, payload) {
    commit(types.STORE_TOKENS, payload)
  },

  async fetchUser ({commit}) {
    try {
      const {data} = await axios.get('/api/user')

      commit(types.FETCH_USER_SUCCESS, {user: data})
    } catch (e) {
      commit(types.FETCH_USER_FAILURE)
    }
  },

  async refreshTokens ({commit, state}, payload) {
    try {
      const {data} = await axios.post('/api/refresh', {
        token: state.refreshToken
      })

      commit(types.STORE_TOKENS, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })
    } catch (e) {
      commit(types.FETCH_USER_FAILURE)
    }
  },

  updateUser ({commit}, payload) {
    commit(types.UPDATE_USER, payload)
  },

  logout ({commit}) {
    commit(types.LOGOUT)
  }
}

// getters
export const getters = {
  authUser: state => state.user,
  authAccessToken: state => state.accessToken,
  authCheck: state => state.accessToken !== null,
}
