import * as types from '../mutation-types'

export const state = {
  network: {
    type: 'main',
    horizonUrl: null,
    passphrase: null,
  },
  timeBounds: null,
  memo: null,
}

export const mutations = {
  [types.STORE_TRANSACTIONS_NETWORK] (state, {type, horizonUrl, passphrase}) {
    state.network = {
      type,
      horizonUrl: type === 'custom' ? horizonUrl : null,
      passphrase: type === 'custom' ? passphrase : null,
    }
  },

  [types.REMOVE_TRANSACTIONS_NETWORK] (state) {
    state.network = {
      type: 'main',
      horizonUrl: null,
      passphrase: null,
    }
  },

  [types.STORE_TRANSACTIONS_TIMEBOUNDS] (state, {from, to}) {
    state.timeBounds = {
      from,
      to,
    }
  },

  [types.REMOVE_TRANSACTIONS_TIMEBOUNDS] (state) {
    state.timeBounds = null
  },

  [types.STORE_TRANSACTIONS_MEMO] (state, {type, value}) {
    state.memo = {
      type,
      value,
    }
  },

  [types.REMOVE_TRANSACTIONS_MEMO] (state) {
    state.memo = null
  },
}

export const getters = {
  transactionsNetwork: state => state.network,
  transactionsTimeBounds: state => state.timeBounds,
  transactionsMemo: state => state.memo,
}
