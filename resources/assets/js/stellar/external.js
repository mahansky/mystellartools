import { Stellar } from './index'
import { manageData } from './transactions'

const methods = {
  manageData: (keypair, data) => manageData(keypair, data),
}

const data = JSON.parse(process.argv[2])
const keypair = Stellar.Keypair.fromSecret(data.secret)

let output

methods[data.action](keypair, data.data)
  .then((response) => {
    output = response
  })
  .catch((err) => {
    output = err
  })
  .then(() => {
    console.log(JSON.stringify(output))
  })