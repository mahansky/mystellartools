<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex xs12>
                    <div><b>Account ID</b></div>
                    <div>GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R</div>

                    <v-data-table
                            v-bind:headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1 mt-3"
                    >
                        <template slot="items" scope="props">
                            <td>{{ props.item.account }}</td>
                            <td class="text-xs-right">{{ props.item.amount }} {{ props.item.asset }}</td>
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
          }
        ]
      }
    }
  }
</script>