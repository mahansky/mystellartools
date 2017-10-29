import { Stellar } from './index'
import { transactions } from './transactions'

const util = require('util')

switch (process.argv[2]) {
  case 'generate':
    const newKeypair = Stellar.Keypair.random()

    console.log(window.JSON.stringify({
      public_key: newKeypair.publicKey(),
      secret_key: newKeypair.secret(),
    }))

    break

  default:
    const data = window.JSON.parse(process.argv[2])
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
        console.log(window.JSON.stringify(JSON.decycle(output)))
      })
}

if (typeof window.JSON.decycle !== 'function') {
  window.JSON.decycle = function decycle (object) {
    'use strict'

    var objects = [],
      paths = []

    return (function derez (value, path) {

      var i,
        name,
        nu

      switch (typeof value) {
        case 'object':

          if (!value) {
            return null
          }

          for (i = 0; i < objects.length; i += 1) {
            if (objects[i] === value) {
              return {$ref: paths[i]}
            }
          }

          objects.push(value)
          paths.push(path)

          if (Object.prototype.toString.apply(value) === '[object Array]') {
            nu = []
            for (i = 0; i < value.length; i += 1) {
              nu[i] = derez(value[i], path + '[' + i + ']')
            }
          } else {

            nu = {}
            for (name in value) {
              if (Object.prototype.hasOwnProperty.call(value, name)) {
                nu[name] = derez(value[name],
                  path + '[' + window.JSON.stringify(name) + ']')
              }
            }
          }
          return nu
        case 'number':
        case 'string':
        case 'boolean':
          return value
      }
    }(object, '$'))
  }
}