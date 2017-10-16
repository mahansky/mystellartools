<template>
    <main class="balance">
        <v-btn info loading flat v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-if="loaded">
            <template v-if="exists">
                <v-layout row wrap>
                    <v-flex xs12>
                        <div class="subheader">Lumens</div>
                        <v-card class="white">
                            <v-card-title primary-title>
                                <div class="text-xs-center" style="width: 100%;">
                                    <h2 class="text-xs-center blue--text" v-html="amountFormat(native) + ' XLM'"></h2>
                                    <price :lumens="native"></price>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout row wrap class="mt-5" v-if="tokens.length > 0">
                    <v-flex xs12>
                        <div class="subheader">Other assets</div>
                        <token v-for="token in tokens" :token="token" :key="token.asset_code"></token>
                    </v-flex>
                </v-layout>
            </template>
            <v-layout row wrap v-else>
                <v-flex xs12>
                    <v-alert info value="true">
                        This account doesn't exist on the Stellar network.
                        <br>
                        If you want to create it, send 20 XLM to its address.
                    </v-alert>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer } from '../../stellar'
  import Price from './balance/price'
  import Token from './balance/token'
  import { flash } from '../../utils'

  export default {
    components: {
      Price,
      Token,
    },

    data () {
      return {
        loaded: false,
        balances: [],
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
      },

      exists () {
        return !! this.balances.length
      }
    },

    created () {
      let vm = this

      StellarServer.accounts()
        .accountId(this.$store.getters.keypair.publicKey())
        .call()
        .then(function (account) {
          vm.balances = account.balances
        })
        .catch(function (error) {
          flash(vm.$store, error, 'error')
        })
        .then(() => {
            this.loaded = true
        })
    }
  }
</script>