import { StrKey } from 'stellar-sdk'

export const Stellar = require('stellar-sdk')

Stellar.Network.usePublicNetwork()

export const HorizonURL = 'https://horizon.stellar.org'
export const StellarServer = new Stellar.Server(HorizonURL)

export const ruleAccountIsValid = (input, allowFederation = true) => {
  let ok = false

  if (allowFederation) {
    let regex = new RegExp('^.+\\*mystellar\\.tools$')

    ok = regex.test(input)
  }

  if (!ok) {
    ok = StrKey.isValidEd25519PublicKey(input)
  }

  return ok ? true : 'Invalid account'
}

export const ruleBip32Path = (path) => {
  if (!path.startsWith("44'/148'")) {
    return 'Not a Stellar BIP32 path'
  }

  path.split('/').forEach(function (element) {
    if (!element.toString().endsWith('\'')) {
      return 'Invalid BIP32 path'
    }
  })

  return true
}