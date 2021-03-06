import * as types from '../mutation-types'
import knownAccounts from '~/stellar/known_accounts'
import store from '../index'

export const state = {
  contacts: [],
}

export const mutations = {
  [types.STORE_CONTACT] (state, contact) {
    state.contacts.push(contact)
  },

  [types.REMOVE_CONTACT] (state, publicKey) {
    for (let i = state.contacts.length - 1; i >= 0; --i) {
      if (state.contacts[i].public_key === publicKey) {
        state.contacts.splice(i, 1);
      }
    }
  },

  [types.REMOVE_CONTACTS] (state) {
    state.contacts = []
  },
}

export const actions = {
  storeContact ({commit}, contact) {
    commit(types.STORE_CONTACT, contact)
  },

  removeContact ({commit}, publicKey) {
    commit(types.REMOVE_CONTACT, publicKey)
  },

  removeContacts ({commit}) {
    commit(types.REMOVE_CONTACTS)
  },
}

export const getters = {
  contacts: state => state.contacts,
}
