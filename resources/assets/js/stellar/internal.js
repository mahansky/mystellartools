import axios from 'axios'
import store from '../store'
import { transactions } from './transactions'

export const submitTransaction = (action, data, keypair, sss) => {
  if (keypair === undefined) {
    keypair = store.getters.keypair
  }

  if (sss === undefined) {
    sss = store.getters.keypairSss
  }

  if (sss) {
    return axios.post('/api/transactions', {
      action,
      data,
      public_key: keypair.publicKey(),
    })
  }

  return transactions[action](keypair, data)
}