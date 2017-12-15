import { StrKey } from 'stellar-sdk'

export const Stellar = require('stellar-sdk')

Stellar.Network.usePublicNetwork()

export const HorizonURL = 'https://mystellar.tools:8000'
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