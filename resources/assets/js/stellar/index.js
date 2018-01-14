// STELLAR SDK, HORIZON

export const Stellar = require('stellar-sdk')
export const HorizonURL = process.env.MIX_HORIZON_URL
export const StellarServer = new Stellar.Server(HorizonURL)
export const BASE_RESERVE = 0.5
export const STARTING_BALANCE = 2 * BASE_RESERVE

Stellar.Network.usePublicNetwork()

// HELPERS

import { flash } from '~/utils'

export function resolveAccountId (recipient) {
  if (Stellar.StrKey.isValidEd25519PublicKey(recipient)) {
    return Promise.resolve({account_id: recipient})
  }

  if (recipient.indexOf('*') === -1) {
    recipient = recipient + '*mystellar.tools'
  }

  return Stellar.FederationServer.resolve(recipient)
}

export function ruleAccountIsValid (input, allowFederation = true, allowEmail = false) {
  let ok = false

  if (allowEmail) {
    ok = new RegExp('^[\\w.]+@[\\w.]+$').test(input)
  }

  if (!ok && allowFederation) {
    ok = new RegExp('^.+\\*.+$').test(input)
  }

  if (!ok) {
    ok = Stellar.StrKey.isValidEd25519PublicKey(input)
  }

  return ok ? true : 'Invalid account'
}

export function ruleBip32Path (path) {
  if (!path.startsWith('44\'/148\'')) {
    return 'Not a Stellar BIP32 path'
  }

  path.split('/').forEach(function (element) {
    if (!element.toString().endsWith('\'')) {
      return 'Invalid BIP32 path'
    }
  })

  return true
}