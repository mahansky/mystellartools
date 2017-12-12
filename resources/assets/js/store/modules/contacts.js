import * as types from '../mutation-types'
import { remove } from 'lodash'

// state
export const state = {
  contacts: [],
}

// mutations
export const mutations = {
  [types.STORE_CONTACT] (state, contact) {
    state.contacts.push(contact)
  },

  [types.REMOVE_CONTACT] (state, publicKey) {
    remove(state.contacts, function (contact) {
      return contact.public_key === publicKey
    })
  },
}

// actions
export const actions = {
  storeContact ({commit}, contact) {
    commit(types.STORE_CONTACT, contact)
  },

  removeContact ({commit}, publicKey) {
    commit(types.REMOVE_CONTACT, publicKey)
  },
}

// getters
export const getters = {
  contacts: state => state.contacts,
}
