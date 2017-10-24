import { StellarServer } from './index'
import { TransactionBuilder, Operation } from 'stellar-sdk'

export const transactions = {
  loadAccount: (keypair) => {
    return StellarServer.loadAccount(keypair.publicKey())
  },

  manageData: (keypair, {name, value}) => {
    return transactions.loadAccount(keypair)
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
  },

  mergeAccounts: (keypair, {destination}) => {
    return transactions.loadAccount(keypair)
      .then(() => {
        let transaction = new TransactionBuilder(keypair)
          .addOperation(Operation.accountMerge({
            destination,
          }))
          .build()

        transaction.sign(keypair)

        return StellarServer.submitTransaction(transaction)
      })
  },

  updateTrustline: (keypair, {asset, limit}) => {
    return transactions.loadAccount(keypair)
      .then(account => {
        let attr = { asset }

        if (limit !== undefined) {
          attr.limit = limit
        }

        let transaction = new TransactionBuilder(account)
          .addOperation(Operation.changeTrust(attr))
          .build()

        transaction.sign(keypair)

        return StellarServer.submitTransaction(transaction)
      })
  },

  allowTrustline: (keypair, {trustor, assetCode, authorize}) => {
    return transactions.loadAccount(keypair)
      .then(account => {
        let transaction = new TransactionBuilder(account)
          .addOperation(Operation.allowTrust({
            trustor,
            assetCode,
            authorize,
          }))
          .build()

        transaction.sign(keypair)

        return StellarServer.submitTransaction(transaction)
      })
  },

  setOptions: (keypair, attributes) => {
    return transactions.loadAccount(keypair)
      .then((account) => {
        let transaction = new TransactionBuilder(account)
          .addOperation(Operation.setOptions(attributes))
          .build()

        transaction.sign(keypair)

        return StellarServer.submitTransaction(transaction)
      })
  },
}