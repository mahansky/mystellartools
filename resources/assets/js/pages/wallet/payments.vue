<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs12>
                    <div>All the payments associated with this account. Data will automatically refresh as soon as there is a new payment made.</div>

                    <v-data-table
                            v-bind:headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1 mt-3"
                    >
                        <template slot="items" scope="props">
                            <td>
                                <template v-if="props.item.name">
                                    {{ props.item.name }}
                                    <small class="grey--text">{{ props.item.account }}</small>
                                </template>
                                <template v-else>
                                    {{ props.item.account }}
                                </template>
                            </td>
                            <td class="text-xs-right">
                                <span :class="props.item.amount > 0 ? 'green--text' : 'red--text'">
                                    <template v-if="props.item.amount > 0">+</template>
                                    <template v-if="props.item.amount < 0">-</template>
                                    {{ Math.abs(props.item.amount) }}
                                </span>
                                {{ props.item.asset }}
                            </td>
                            <td>{{ props.item.memo }}</td>
                            <td>{{ props.item.timestamp }}</td>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          { text: 'Account', value: 'account', sortable: false, align: 'left' },
          { text: 'Amount', value: 'amount', sortable: false, align: 'right' },
          { text: 'Memo', value: 'memo', sortable: false, align: 'left' },
          { text: 'Date', value: 'timestamp', sortable: false, align: 'left' },
        ],
        items: [
          {
            account: 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD',
            name: 'John Smith',
            amount: 23.566,
            asset: 'XLM',
            memo: '',
            timestamp: '29.05.2016 11:24'
          },
          {
            account: 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD',
            amount: 23.566,
            asset: 'XLM',
            memo: 'kraken.com',
            timestamp: '29.05.2016 11:24'
          },
          {
            account: 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD',
            amount: -3.26,
            asset: 'XLM',
            memo: 'bitstamp.com',
            timestamp: '29.05.2016 11:24'
          }
        ]
      }
    }
  }
</script>