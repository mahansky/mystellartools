import { Stellar } from './index'
import { transactions } from './transactions'

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