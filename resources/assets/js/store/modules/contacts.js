import * as types from '../mutation-types'

// state
export const state = {
  contacts: [],
}

// mutations
export const mutations = {
  [types.STORE_CONTACTS] (state, contacts) {
    state.contacts = contacts
  },

  [types.REMOVE_CONTACTS] (state) {
    state.contacts = []
  },
}

// actions
export const actions = {
  storeContacts ({commit}, payload) {
    commit(types.STORE_CONTACTS, payload)
  },

  removeContacts ({commit}) {
    commit(types.REMOVE_CONTACTS)
  },
}

// getters
export const getters = {
  contacts: state => state.contacts,
}
