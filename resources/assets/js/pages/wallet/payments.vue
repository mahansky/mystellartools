<template>
    <main class="payments">
        <v-btn flat info loading v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-if="loaded">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-data-table
                            :headers="headers"
                            :items="payments"
                            hide-actions
                            class="elevation-1 mt-3 mb-4"
                    >
                        <template slot="items" scope="props">
                            <td>
                                <template v-if="props.item.name">
                                    {{ props.item.name }}
                                    <small class="grey--text">{{ props.item.from }}</small>
                                </template>
                                <template v-else>
                                    <span>{{ props.item.from }}</span>
                                </template>
                            </td>
                            <td class="text-xs-right">
                                <span :class="props.item.amount > 0 ? 'green--text' : 'red--text'">
                                    <template v-if="props.item.amount > 0">+</template>
                                    <template v-if="props.item.amount < 0">-</template>
                                    {{ Math.abs(props.item.amount) }}
                                </span>
                                <span v-if="props.item.asset_code" v-text="props.item.asset_code"></span>
                                <span v-else v-text="'XLM'"></span>
                            </td>
                            <template v-if="props.item.datetime">
                                <td>
                                    <span v-if="props.item.memo" v-text="props.item.memo"></span>
                                </td>
                                <td>
                                    <span class="grey--text text--darken-2" v-if="props.item.datetime"
                                          v-text="props.item.datetime"></span>
                                </td>
                            </template>
                            <template v-else>
                                <td colspan="2">
                                    <span class="table-row-detail">
                                        <a href="#" @click.prevent="loadInfo(props.item)">Load details</a>
                                    </span>
                                </td>
                            </template>
                            <td>
                                <span class="table-row-detail">
                                    <a :href="props.item._links.self.href" target="_blank"
                                       rel="noreferrer nofollow">#</a>
                                </span>
                            </td>
                        </template>
                    </v-data-table>

                    <p class="mb-1">
                        Showing last 50 payments. If you want to see more, go to
                        <router-link to="/">All operations</router-link>
                    </p>
                    <p class="mb-1">New payments will be shown at the top of the table automatically.</p>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { StellarServer } from '../../stellar'
  import moment from 'moment'

  export default {
    metaInfo: () => ({
      title: 'Payments',
    }),

    data () {
      return {
        headers: [
          {text: 'Account', value: 'account', sortable: false, align: 'left'},
          {text: 'Amount', value: 'amount', sortable: false, align: 'right'},
          {text: 'Memo', value: 'memo', sortable: false, align: 'left'},
          {text: 'Date', value: 'timestamp', sortable: false, align: 'left'},
          {text: '', value: 'link', sortable: false, align: 'right'},
        ],
        payments: [],
        eventSource: null,
        loaded: false,
      }
    },

    created () {
      let vm = this

      StellarServer.payments()
        .forAccount(this.$store.getters.keypair.publicKey())
        .limit(50)
        .order('desc')
        .call()
        .then(payments => {
          vm.loaded = true

          _.forEach(payments.records, function (payment) {
            if (payment.type === 'create_account') {
              payment.from = payment.funder
              payment.amount = payment.starting_balance
              payment.asset_type = 'native'
            }
          })

          vm.payments = _.filter(payments.records, function (payment) {
            return payment.type !== 'account_merge'
          })

          vm.startListening()

          let promises = []

          for (let i = 0; i < Math.min(vm.payments.length, 10); i++) {
            promises.push(vm.fetchAdditionalInfo(vm.payments[i]))
          }

          Promise.all(promises)
            .then(() => {
              vm.$forceUpdate()
            })
        })
    },

    methods: {
      startListening() {
        let vm = this

        vm.eventSource = StellarServer.payments()
          .forAccount(this.$store.getters.keypair.publicKey())
          .cursor('now')
          .stream({
            onmessage: (payment) => {
              if (payment.type !== 'account_merge') {
                vm.payments.unshift(payment)
              }
            }
          })
      },

      fetchAdditionalInfo(payment) {
        return StellarServer.transactions()
          .transaction(this.parseTransactionHash(payment))
          .call()
          .then(tx => this.processAdditionalInfo(payment, tx))
      },

      processAdditionalInfo(payment, tx) {
        payment.datetime = moment(tx.created_at).format('DD.MM.YYYY HH:mm:ss')

        if (tx.memo_type !== 'none') {
          payment.memo = tx.memo
        }
      },

      parseTransactionHash(payment) {
        let parts = payment._links.transaction.href.split('/')

        return parts[parts.length - 1]
      },

      loadInfo(payment) {
        let vm = this

        Promise.resolve(this.fetchAdditionalInfo(payment))
          .then(() => {
            vm.$forceUpdate()
          })
      }
    },

    beforeDestroy () {
      this.eventSource()
    },
  }
</script>