import { Stellar } from './index'
import { transactions } from './transactions'

switch (process.argv[2]) {
  case 'generate':
    const newKeypair = Stellar.Keypair.random()

    console.log(JSON.stringify({
      public_key: newKeypair.publicKey(),
      secret_key: newKeypair.secret(),
    }))

    break

  default:
    const data = JSON.parse(process.argv[2])
    const keypair = Stellar.Keypair.fromSecret(data.secret)

    let output

    transactions[data.action](keypair, data.data)
      .then((response) => {
        output = response
        output.tx_success = 1
      })
      .catch((err) => {
        output = err
        output.tx_success = 0
      })
      .then(() => {
        console.log(JSON.stringify(output, censor(output)))
      })
}

function censor (censor) {
  let i = 0

  return function (key, value) {
    if (i !== 0 && typeof(censor) === 'object' && typeof(value) === 'object' && censor === value)
      return '[Circular]'

    if (i >= 10)
      return '[Unknown]'

    ++i

    return value
  }
}