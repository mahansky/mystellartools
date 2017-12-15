import store from '../store'
import { transactions } from './transactions'

export const submitTransaction = (action, data, keypair) => {
  if (keypair === undefined) {
    keypair = store.getters.keypair
  }

  return transactions[action](keypair, data)
}