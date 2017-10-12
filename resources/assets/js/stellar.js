export const Stellar = require('stellar-sdk')

// Stellar.Network.usePublicNetwork()
// export const HorizonURL = 'https://horizon.stellar.org'
// export const StellarServer = new Stellar.Server(HorizonURL)

Stellar.Network.useTestNetwork()
export const StellarServer = new Stellar.Server('https://horizon-testnet.stellar.org')

export const ruleAccountIsValid = (input) => {
  let domain = window.config.domain.replace('.', '\\.')
  let regex = new RegExp('^.+\\*' + domain + '$')
  let ok = true

  if (!regex.test(input)) {
    ok = false
  }

  if (!ok) {
    try {
      Stellar.Keypair.fromPublicKey(input)
      ok = true
    } catch (e) {
      ok = false
    }
  }

  return ok ? true : 'Invalid account'
}