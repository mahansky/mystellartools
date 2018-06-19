<template>
    <main class="balance">
        <v-btn info loading flat v-if="!loaded"></v-btn>
        <v-container v-if="loaded">
            <template v-if="exists">
                <v-layout row wrap>
                    <v-flex xs12>
                        <div class="subheader">Lumens</div>
                        <v-card class="white">
                            <v-card-title primary-title>
                                <div class="text-xs-center" style="width: 100%;">
                                    <amount tag="h2" :amount="native" suffix=" XLM" class="text-xs-center blue--text"></amount>
                                    <price :lumens="native"></price>
                                </div>
                            </v-card-title>
                        </v-card>
                    </v-flex>
                </v-layout>
                <v-layout>
                    <v-spacer></v-spacer>
                    <small class="grey--text mr-2 mt-1">prices provided by coinmarketcap.com</small>
                </v-layout>
                <v-layout row wrap class="mt-5" v-if="tokens.length > 0">
                    <v-flex xs12>
                        <div class="subheader">Other assets</div>
                        <token v-for="token in tokens" :token="token" :key="token.asset_code"></token>
                    </v-flex>
                </v-layout>
            </template>
            <div v-else id="noaccount">
                <v-container>
                    <v-layout>
                        <v-flex>
                            <v-alert error value="true" class="mt-5">
                                This account doesn't exist on the Stellar network.
                                <br>
                                If you want to create it, send 1 XLM to its address:
                                <b v-text="publicKey"></b>
                            </v-alert>
                        </v-flex>
                    </v-layout>
                </v-container>
            </div>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer } from '~/stellar'
  import { flash } from '~/utils'
  import Price from './balance/price'
  import Token from './balance/token'

  export default {
    metaInfo: () => ({
        title: 'Balance',
    }),

    components: {
      Price,
      Token,
    },

    data () {
      return {
        loaded: false,
        balances: [],
        eventSource: null,
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
      },

      publicKey () {
        return this.$store.getters.keypair ? this.$store.getters.keypair.publicKey() : null
      },
    },

    watch: {
      publicKey (val) {
        if (val) {
          this.fetchData()
        }
      },
    },

    methods: {
      fetchData () {
        let vm = this

        StellarServer().accounts()
          .accountId(this.$store.getters.keypair.publicKey())
          .call()
          .then(function (account) {
            vm.balances = account.balances
          })
          .catch(function (error) {
            if (error.name !== 'NotFoundError') {
              flash(error, 'error')
            }
          })
          .then(() => {
            this.loaded = true
          })
      },

      startListening() {
        let vm = this

        vm.eventSource = StellarServer().payments()
          .forAccount(this.$store.getters.keypair.publicKey())
          .cursor((new Date).getTime())
          .stream({
            onmessage: () => {
              vm.fetchData()
            }
          })
      },
    },

    created () {
      if (this.publicKey) {
        this.fetchData()
        this.startListening()
      }
    },

    beforeDestroy () {
      if (this.eventSource) {
        this.eventSource()
      }
    },
  }
</script>

<style>
    #noaccount {
        width: 100%;
        height: calc(100% - 64px);
        background: #fafafa;
        position: absolute;
        top: 64px;
        left: 0;
        z-index: 3;
    }
</style>