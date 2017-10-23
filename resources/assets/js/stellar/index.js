import { StrKey } from 'stellar-sdk'

export const Stellar = require('stellar-sdk')

Stellar.Network.usePublicNetwork()
export const HorizonURL = 'https://horizon.stellar.org'
export const StellarServer = new Stellar.Server(HorizonURL)

// Stellar.Network.useTestNetwork()
// export const StellarServer = new Stellar.Server('https://horizon-testnet.stellar.org')

export const ruleAccountIsValid = (input, allowFederation = true) => {
  let ok = false

  if (allowFederation) {
    let domain = window.config.domain.replace('.', '\\.')
    let regex = new RegExp('^.+\\*' + domain + '$')

    ok = regex.test(input)
  }

  if (!ok) {
    ok = StrKey.isValidEd25519PublicKey(input)
  }

  return ok ? true : 'Invalid account'
}