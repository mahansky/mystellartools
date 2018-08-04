import { StellarServer, Stellar } from './index'
import { Asset, Operation, StrKey, TransactionBuilder, Keypair } from 'stellar-sdk'
import { flash, events } from '~/utils'
import { signTransaction } from './ledger'
import store from '~/store'
import StellarGuardSdk from '@stellarguard/sdk'

const xdr = require('stellar-base').xdr

function _buildTx (keypair, operation, memo) {
  return transactions.loadAccount(keypair)
    .then(account => {
      let transaction

      if (typeof operation === 'string') {
        transaction = new Stellar.Transaction(operation)
      } else {
        const opts = {}

        if (store.getters.transactionsTimeBounds) {
          opts.timebounds = {
            minTime: store.getters.transactionsTimeBounds.from,
            maxTime: store.getters.transactionsTimeBounds.to,
          }
        }

        transaction = new TransactionBuilder(account, opts).addOperation(operation)

        if (!memo && store.getters.transactionsMemo) {
          memo = new Stellar.Memo(store.getters.transactionsMemo.type.split('_')[1].toLowerCase(), store.getters.transactionsMemo.value)
        }

        if (memo) {
          transaction.addMemo(memo)
        }

        transaction = transaction.build()
      }

      if (!store.getters.keypairLedger && !store.getters.keypairCanSign) {
        events.$emit('transactions:manual-signing', {
          envelope: transaction.toEnvelope().toXDR('base64'),
          hash: transaction.hash().toString('hex'),
        })

        throw new Error('No secret key entered. Can not sign the transaction.')
      }

      if (store.getters.keypairLedger) {
        flash('Sign the transaction using your Ledger', 'info')

        return signTransaction(transaction, store.getters.keypairBip32Path, keypair)
          .catch(err => {
            throw new Error('Problem with signing the transaction with Ledger: ' + err)
          })
      } else {
        transaction.sign(keypair)

        return transaction
      }
    })
}

function _submitTx (keypair, operation, memo) {
  return _buildTx(keypair, operation, memo)
    .then(async transaction => {
      if (store.getters.keypairStellarGuard === null && ['main', 'testnet'].indexOf(store.getters.transactionsNetwork.type) !== -1) {
        try {
          await StellarGuardSdk.getAccount(keypair.publicKey())
          store.dispatch('setStellarGuard', true)
        } catch (e) {
          store.dispatch('setStellarGuard', false)
        }
      }

      return store.getters.keypairStellarGuard
        ? StellarGuardSdk.submitTransaction(transaction)
        : StellarServer().submitTransaction(transaction)
    })
    .then(response => {
      if (store.getters.keypairStellarGuard === true) {
        setTimeout(() => flash('Transaction submitted to StellarGuard', 'info'), 10)
      }

      return response
    })
}

// Transactions
export const transactions = {
  loadAccount: (keypair) => {
    return StellarServer().loadAccount(keypair.publicKey())
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

  raw: (keypair, transaction) => {
    return _submitTx(keypair, transaction)
  }
}