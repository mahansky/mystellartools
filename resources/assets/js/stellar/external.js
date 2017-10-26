import { Stellar } from './index'
import { transactions } from './transactions'

switch (process.argv[2]) {
  case 'generate':
    const newKeypair = Stellar.Keypair.random()

    console.log(JSON.stringify({
      public_key: newKeypair.publicKey(),
      secret_key: newKeypair.secret(),
    }))

    break;

  default:
    const data = JSON.parse(process.argv[2])
    const keypair = Stellar.Keypair.fromSecret(data.secret)

    let output

    transactions[data.action](keypair, data.data)
      .then((response) => {
        output = response
      })
      .catch((err) => {
        output = err
      })
      .then(() => {
        console.log(JSON.stringify(output))
      })
}