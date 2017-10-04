<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs12>
                    <div class="subheader">Lumens (XLM)</div>
                    <v-card class="white">
                        <v-card-title primary-title>
                            <div class="text-xs-center" style="width: 100%;">
                                <h2 class="text-xs-center blue--text" v-html="amountFormat(native)"></h2>
                                <div class="subheading grey--text">$ 4567.64</div>
                            </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row wrap class="mt-5">
                <v-flex xs12>
                    <div class="subheader">Other tokens</div>
                    <div v-for="token in tokens">
                        <h4 class="mb-1 mt-3">
                            <span v-html="amountFormat(token.balance)"></span>
                            <small>{{ token.asset_code }}</small>
                        </h4>
                        <div class="grey--text text--darken-2">Issuer <span class="grey--text" v-text="token.asset_issuer"></span></div>
                        <div class="grey--text text--darken-2" v-if="token.limit">Limit <span class="grey--text" v-html="amountFormat(token.limit)"></span></div>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer } from '../../stellar'

  export default {
    data () {
      return {
        balances: [
          {
            "balance": "857557.0000000",
            "limit": "1000000000.0000000",
            "asset_type": "credit_alphanum4",
            "asset_code": "CNY",
            "asset_issuer": "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX"
          },
          {
            "balance": "98798.23",
            "asset_type": "credit_alphanum4",
            "asset_code": "ABC",
            "asset_issuer": "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RPOP"
          },
          {
            "balance": "120.8993300",
            "asset_type": "native"
          }
        ]
      }
    },

    computed: {
      native () {
        let vm = this
        let native = _.head(
          _.filter(vm.balances, function (b) {
            return b.asset_type === 'native'
          })
        )

        if (native)
          return native.balance

        return 0
      },

      tokens () {
        return _.filter(this.balances, function (b) {
          return b.asset_type !== 'native'
        })
      }
    },

    created () {
      let vm = this

//      StellarServer.accounts()
//        .accountId(this.$store.getters.keypair.publicKey())
//        .call()
//        .then(function (account) {
//          vm.balances = account.balances
//        })
//        .catch(function (err) {
//          console.log('error', err)
//        })
    }
  }
</script>