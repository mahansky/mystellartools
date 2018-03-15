<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div class="headline">
                Ledger #<span v-text="$route.params.ledger"></span>
                <v-btn :loading="loading" flat class="blue--text my-0 mx-0" small></v-btn>
            </div>
        </v-flex>
        <v-flex sm12 md7 v-if="ledger">
            <div class="caption grey--text mb-4 mt-4">TRANSACTIONS</div>

            <v-expansion-panel expand>
                <v-expansion-panel-content v-for="transaction in transactions" :key="transaction.id">
                    <div slot="header">
                        <code v-text="transaction.hash" class="break-all"></code>
                    </div>
                    <v-card>
                        <v-card-text class="grey lighten-3 px-4">
                            <v-layout row wrap>
                                <v-flex xs12 sm10>
                                    <table class="first-padding">
                                        <tr>
                                            <td><b>Source account</b></td>
                                            <td>
                                                <public-key :value="transaction.source_account"></public-key>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Created at</b></td>
                                            <td>
                                                <date-time :value="transaction.created_at"></date-time>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Operations</b></td>
                                            <td v-text="transaction.operation_count"></td>
                                        </tr>
                                    </table>
                                </v-flex>
                                <v-flex xs12 sm2 class="text-sm-right">
                                    <v-btn icon
                                           @click="$router.push({name: 'explorer.transaction', params: {transaction: transaction.hash}})"
                                           class="my-0 mx-0"
                                    >
                                        <v-icon class="blue--text">search</v-icon>
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
        <v-flex md1></v-flex>
        <v-flex sm12 md4 v-if="ledger" class="break-all">
            <div class="caption grey--text mb-4 mt-4">INFORMATION</div>

            <v-layout row wrap>
                <v-flex xs12>
                    <div class="info-block">
                        <b>Hash</b>
                        <code v-text="ledger.hash"></code>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Sequence</b>
                        <span v-text="ledger.sequence"></span>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Closed At</b>
                        <date-time :value="ledger.closed_at"></date-time>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Transaction Count</b>
                        <span v-text="ledger.transaction_count"></span>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Operation Count</b>
                        <span v-text="ledger.operation_count"></span>
                    </div>
                </v-flex>
                <v-flex xs12 class="mb-3">
                    <v-divider></v-divider>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Base Fee</b>
                        <span v-text="ledger.base_fee"></span>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Base Reserve</b>
                        <span v-text="ledger.base_reserve"></span>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Max Tx Set Size</b>
                        <div v-text="ledger.max_tx_set_size"></div>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Protocol Version</b>
                        <span v-text="ledger.protocol_version"></span>
                    </div>
                </v-flex>
                <v-flex xs12 class="mb-3">
                    <v-divider></v-divider>
                </v-flex>
                <v-flex xs12>
                    <div class="info-block">
                        <b>Total XLM</b>
                        <amount :amount="ledger.total_coins" suffix=" XLM"></amount>
                    </div>
                </v-flex>
                <v-flex xs12>
                    <div class="info-block">
                        <b>Fee Pool Size</b>
                        <amount :amount="ledger.fee_pool" suffix=" XLM"></amount>
                    </div>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
  import {StellarServer} from '~/stellar'
  import {flash} from '~/utils'

  export default {
    layout: 'explorer',

    data: () => ({
      loading: true,
      ledger: null,
      transactions: [],
    }),

    methods: {
      fetch () {
        StellarServer().ledgers()
          .ledger(this.$route.params.ledger)
          .call()
          .then(ledger => {
            this.ledger = ledger

            return ledger.transactions()
          })
          .then(response => {
            this.transactions = response._embedded.records
          })
          .catch(flash)
          .then(() => {
            this.loading = false
          })
      },
    },

    beforeRouteUpdate(to, from, next) {
      next()
      this.fetch()
    },

    created () {
      this.fetch()
    },
  }
</script>