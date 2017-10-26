import { StellarServer } from './index'
import { TransactionBuilder, Operation, StrKey } from 'stellar-sdk'
import axios from 'axios'
import store from '../store'

const xdr = require('stellar-base').xdr;

// Submit Transaction
function _submitTx(keypair, operation) {
  return transactions.loadAccount(keypair)
    .then(account => {
      let transaction = new TransactionBuilder(account)
        .addOperation(operation)
        .build()

      transaction.sign(keypair)

      return StellarServer.submitTransaction(transaction)
    })
}

// Transactions
export const transactions = {
  loadAccount: (keypair) => {
    return StellarServer.loadAccount(keypair.publicKey())
  },

  addSigner: (keypair, {publicKey, weight}) => {
    return _submitTx(keypair, Operation.setOptions({
      signer: new xdr.Signer({
        key: new xdr.SignerKey.signerKeyTypeEd25519(StrKey.decodeEd25519PublicKey(publicKey)),
        weight,
      })
    }))
  },

  manageData: (keypair, {name, value}) => {
    return _submitTx(keypair, Operation.manageData({
      name,
      value: '' + value,
    }))
  },

  mergeAccounts: (keypair, {destination}) => {
    return _submitTx(keypair, Operation.accountMerge({
      destination,
    }))
  },

  updateTrustline: (keypair, {asset, limit}) => {
    let attr = { asset }

    if (limit !== undefined) {
      attr.limit = limit
    }

    return _submitTx(keypair, Operation.changeTrust(attr))
  },

  allowTrustline: (keypair, {trustor, assetCode, authorize}) => {
    return _submitTx(keypair, Operation.allowTrust({
      trustor,
      assetCode,
      authorize,
    }))
  },

  setOptions: (keypair, attributes) => {
    return _submitTx(keypair, Operation.setOptions(attributes))
  },
}

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