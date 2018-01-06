import { StellarServer } from './index'
import { Asset, Operation, StrKey, TransactionBuilder, Keypair } from 'stellar-sdk'
import store from '../store'
import StellarLedger from 'stellar-ledger-api'

const xdr = require('stellar-base').xdr

// Submit Transaction
function _submitTx (keypair, operation, memo) {
  return transactions.loadAccount(keypair)
    .then(account => {
      let transaction = new TransactionBuilder(account)
        .addOperation(operation)

      if (memo) {
        transaction.addMemo(memo)
      }

      transaction = transaction.build()

      if (store.getters.keypairLedger) {
        return new StellarLedger.Api(new StellarLedger.comm(120)).signTx_async(store.getters.keypairBip32Path, transaction).then(result => {
          let signature = result['signature']
          let keyPair = Keypair.fromPublicKey(keypair.publicKey())
          let hint = keyPair.signatureHint()
          let decorated = new xdr.DecoratedSignature({hint, signature})

          transaction.signatures.push(decorated)

          return StellarServer.submitTransaction(transaction)
        }).catch(err => {
          throw new Error('Problem with signing the transaction with Ledger: ' + err)
        })
      } else {
        transaction.sign(keypair)

        return StellarServer.submitTransaction(transaction)
      }
    })
}

// Transactions
export const transactions = {
  loadAccount: (keypair) => {
    return StellarServer.loadAccount(keypair.publicKey())
  },

  payment: (keypair, {destination, code, issuer, amount, memo}) => {
    let asset

    if (code === 'XLM') {
      asset = Asset.native()
    } else {
      asset = new Asset(code, issuer)
    }

    return _submitTx(keypair, Operation.payment({
      destination,
      asset,
      amount,
    }), memo)
  },

  createAccount: (keypair, {destination, startingBalance, memo}) => {
    return _submitTx(keypair, Operation.createAccount({
      destination,
      startingBalance,
    }), memo)
  },

  manageData: (keypair, {name, value}) => {
    return _submitTx(keypair, Operation.manageData({
      name,
      value,
    }))
  },

  mergeAccounts: (keypair, {destination}) => {
    return _submitTx(keypair, Operation.accountMerge({
      destination,
    }))
  },

  updateTrustline: (keypair, {code, issuer, limit}) => {
    let attr = {
      asset: new Asset(code, issuer)
    }

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