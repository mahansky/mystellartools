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
                            <code v-text="operation.transaction_hash" class="pointer"
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
                    <div ref="lct" class="mt-2"></div>
                </v-card-text>
            </v-card>

            <v-card class="mt-3">
                <v-card-text>
                    <b>Transactions and operations</b>
                    <span class="grey--text">(last 100)</span>
                    <div ref="tao" class="mt-2"></div>
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
  import { GoogleCharts } from 'google-charts'
  import moment from 'moment'

  export default {
    layout: 'explorer',

    data: () => ({
      loading: true,
      operations: [],
      ledgers: [],
      lastClose: null,
      lctChartOptions: {
        legend: {
          position: 'none',
        },
        enableInteractivity: false,
        vAxis: {
          format: '#',
          gridlines: {
            count: 11,
            color: 'transparent'
          },
          viewWindow:{
            max:10,
            min:0
          },
          textStyle : {
            fontSize: 9,
          },
          baselineColor: '#555',
        },
        hAxis: {
          gridlines: {
            color: 'transparent'
          },
          textColor: '#ffffff',
        },
        height: 100,
        chartArea: {
          width: '100%',
          height: '100%',
          left: 20,
          top: 10,
          bottom: 10,
        },
        colors: ['#2196f3'],
      },
      taoChartOptions: {
        legend: {
          position: 'none',
        },
        enableInteractivity: false,
        vAxis: {
          format: '#',
          gridlines: {
            color: 'transparent'
          },
          textStyle : {
            fontSize: 9,
          },
          baselineColor: '#555',
        },
        hAxis: {
          gridlines: {
            color: 'transparent'
          },
          textColor: '#ffffff',
        },
        height: 100,
        chartArea: {
          width: '100%',
          height: '100%',
          left: 20,
          top: 10,
          bottom: 10,
        },
        colors: ['#f44336', '#ff9800'],
        isStacked: true
      },
    }),

    methods: {
      newOperation(operation) {
        this.operations.unshift(operation)
        this.operations.splice(10)
      },

      drawCharts () {
        this.drawLctChart()
        this.drawTaoChart()
      },

      drawLctChart () {
        this.lctData = new GoogleCharts.api.visualization.DataTable()

        this.lctData.addColumn('number', 'Ledger Sequence')
        this.lctData.addColumn('number', 'Close Time')

        this.lastClose = moment(this.ledgers[0].closed_at)

        _(this.ledgers).each(ledger => {
          this.lctData.addRow([
            ledger.sequence,
            -moment(ledger.closed_at).diff(this.lastClose, 'seconds')
          ])

          this.lastClose = moment(ledger.closed_at)
        })

        this.lctChart = new GoogleCharts.api.visualization.ColumnChart(this.$refs.lct)
        this.lctChart.draw(this.lctData, this.lctChartOptions);
      },

      drawTaoChart () {
        this.taoData = new GoogleCharts.api.visualization.DataTable()

        this.taoData.addColumn('number', 'Ledger Sequence')
        this.taoData.addColumn('number', 'Transactions')
        this.taoData.addColumn('number', 'Operations')

        _(this.ledgers).each(ledger => {
          this.taoData.addRow([
            ledger.sequence,
            ledger.transaction_count,
            ledger.operation_count,
          ])
        })

        this.lctChart = new GoogleCharts.api.visualization.ColumnChart(this.$refs.tao)
        this.lctChart.draw(this.taoData, this.taoChartOptions);
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
        })
        .then(() => {
          GoogleCharts.load(this.drawCharts, ['corechart', 'bar'])
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