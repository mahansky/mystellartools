<template>
    <main>
        <v-container grid-list-lg>
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
                                    <span class="grey--text text--darken-2">{{ props.item.from }}</span>
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
                            <td>
                                <!--{{ props.item.memo }}-->
                            </td>
                            <td>
                                <span class="grey--text text--darken-2">
                                    <!--{{ props.item.timestamp }}-->
                                </span>
                            </td>
                            <td>
                                <span class="table-row-detail">
                                    <a :href="props.item._links.self.href" target="_blank" rel="noreferrer nofollow">#</a>
                                </span>
                            </td>
                        </template>
                    </v-data-table>

                    <p class="mb-1">
                        Showing last 50 payments. If you want to see more, go to the
                        <router-link to="/">All operations</router-link>
                        .
                    </p>
                    <p class="mb-1">New payments will be shown at the top of the table automatically.</p>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { StellarServer } from '../../stellar'

  export default {
    data () {
      return {
        headers: [
          {text: 'Account', value: 'account', sortable: false, align: 'left'},
          {text: 'Amount', value: 'amount', sortable: false, align: 'right'},
          {text: 'Memo', value: 'memo', sortable: false, align: 'left'},
          {text: 'Date', value: 'timestamp', sortable: false, align: 'left'},
          {text: '', value: 'link', sortable: false, align: 'right'},
        ],
        payments: [
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/30231480227598337"
              },
            },
            "id": "30231480227598337",
            "paging_token": "30231480227598337",
            "source_account": "GAKC3P3LQKBRCPOQ3ACI6NHKDNHKTIPGTX7EPOC3SGCMLQK4K3WYICWK",
            "type": "payment",
            "type_i": 1,
            "asset_type": "native",
            "from": "GAKC3P3LQKBRCPOQ3ACI6NHKDNHKTIPGTX7EPOC3SGCMLQK4K3WYICWK",
            "to": "GBK4DFCUAZRNU7TJ4XUOJEADVQBLGVVVFKRTHHXNAXD7MTYUWR7HKCNY",
            "amount": "1.1000000"
          },
          {
            "_links": {
              "self": {
                "href": "https://horizon.stellar.org/operations/27709668704915457"
              },
            },
            "id": "27709668704915457",
            "paging_token": "27709668704915457",
            "source_account": "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX",
            "type": "payment",
            "type_i": 1,
            "asset_type": "credit_alphanum4",
            "asset_code": "CNY",
            "asset_issuer": "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX",
            "from": "GAREELUB43IRHWEASCFBLKHURCGMHE5IF6XSE7EXDLACYHGRHM43RFOX",
            "to": "GBK4DFCUAZRNU7TJ4XUOJEADVQBLGVVVFKRTHHXNAXD7MTYUWR7HKCNY",
            "amount": "100000.0000000"
          },
        ]
      }
    },

    created () {
      let vm = this
//
//      StellarServer.payments()
//        .forAccount(this.$store.getters.keypair.publicKey())
//        .limit(50)
//        .order('desc')
//        .call()
//        .then(payments => {
//          vm.payments = _.filter(payments._embedded.records, function (record) {
//            return record.type === 'payment'
//          })
//        })
//      // load additional info for the first 10 payments (/transactions)
    }
  }
</script>