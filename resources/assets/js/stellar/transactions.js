import { StellarServer } from './index'
import { TransactionBuilder, Operation } from 'stellar-sdk'

export function manageData (keypair, {name, value}) {
  return StellarServer.loadAccount(keypair.publicKey())
    .then(account => {
      let transaction = new TransactionBuilder(account)
        .addOperation(Operation.manageData({
          name,
          value: '' + value,
        }))
        .build()

      transaction.sign(keypair)

      return StellarServer.submitTransaction(transaction)
    })
}