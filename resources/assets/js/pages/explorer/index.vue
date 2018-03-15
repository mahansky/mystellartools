<template>
    <v-layout row wrap>
        <v-flex lg7 xs12>
            <div class="headline mb-4">Stellar Blockchain Explorer</div>

            <v-btn loading class="blue--text" flat v-if="loading"></v-btn>
            <transition-group name="txlist" tag="div" v-else>
                <div class="caption grey--text mb-4 mt-4" key="title">LATEST OPERATIONS</div>

                <v-card key="transactions">
                    <div v-for="operation in operations" :key="operation.id">
                        <v-card-text>
                            <div class="inline-block">
                                <span v-text="operation.type.toUpperCase()"></span>
                                <span class="grey--text">created by</span>
                            </div>
                            <div class="inline-block">
                                <public-key :value="operation.source_account"></public-key>
                            </div>
                            <code v-text="operation.transaction_hash" class="pointer break-all"
                                  @click="$router.push({name: 'explorer.transaction', params: {transaction: operation.transaction_hash}})"
                            ></code>
                        </v-card-text>
                        <v-divider></v-divider>
                    </div>
                </v-card>
            </transition-group>
        </v-flex>
        <v-flex lg1></v-flex>
        <v-flex lg4 xs12>
            <v-btn large block outline class="blue blue--text tall"
                   @click="$router.push({name: 'explorer.network'})"
            >Network explorer</v-btn>

            <v-card class="mt-3">
                <v-card-text>
                    <b>Ledgers close times</b>
                    <span class="grey--text">(last 100)</span>
                    <ledgers-chart :ledgers="ledgers"></ledgers-chart>
                </v-card-text>
            </v-card>

            <v-card class="mt-3">
                <v-card-text>
                    <b>Transactions and operations</b>
                    <span class="grey--text">(last 100)</span>
                    <transactions-chart :ledgers="ledgers"></transactions-chart>
                </v-card-text>
            </v-card>

            <div class="caption grey--text mb-4 mt-5">XLM STATS</div>

            <v-layout row wrap v-if="ledgers.length">
                <v-flex xs12>
                    <div class="info-block">
                        <b>Total XLM</b>
                        <amount :amount="ledgers[0].total_coins" suffix=" XLM"></amount>
                    </div>
                </v-flex>
                <v-flex xs12>
                    <div class="info-block">
                        <b>Fee Pool Size</b>
                        <amount :amount="ledgers[0].fee_pool" suffix=" XLM"></amount>
                    </div>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
  import { StellarServer } from '~/stellar'
  import { flash } from '~/utils'
  import LedgersChart from './index/ledgers_chart'
  import TransactionsChart from './index/transactions_chart'

  export default {
    layout: 'explorer',

    components: {
      LedgersChart,
      TransactionsChart,
    },

    data: () => ({
      loading: true,
      operations: [],
      ledgers: [],
    }),

    methods: {
      newOperation(operation) {
        this.operations.unshift(operation)
        this.operations.splice(10)
      },

      newLedger (ledger) {
        this.ledgers.unshift(ledger)
        this.ledgers.splice(100)
      },
    },

    mounted () {
      StellarServer().operations()
        .cursor('now')
        .order('desc')
        .limit(10)
        .call()
        .then(response => {
          this.operations = response.records

          this.stream = StellarServer().operations()
            .cursor('now')
            .stream({
              onmessage: this.newOperation,
            })

          return StellarServer().ledgers()
            .order('desc')
            .limit(100)
            .call()
        })
        .then(response => {
          this.ledgers = response.records

          this.stream2 = StellarServer().ledgers()
            .cursor('now')
            .stream({
              onmessage: this.newLedger,
            })
        })
        .catch(flash)
        .then(() => {
          this.loading = false
        })
    },

    destroyed () {
      if (this.stream) {
        this.stream()
      }

      if (this.stream2) {
        this.stream2()
      }
    },
  }
</script>

<style>
    .tall {
        height: 100px;
    }

    .txlist-enter-active, .txlist-leave-active {
        transition: all 1s;
    }
    .txlist-enter, .txlist-leave-to /* .list-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translateY(30px);
    }
</style>