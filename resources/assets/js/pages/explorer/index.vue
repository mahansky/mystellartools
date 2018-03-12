<template>
    <v-layout row wrap>
        <v-flex lg8 xs12>
            <div class="headline mb-4">Latest transactions</div>

            <v-btn loading class="blue--text" flat v-if="loading"></v-btn>
            <transition-group name="txlist" tag="div" v-else>
                <div v-for="tx in transactions" :key="tx.hash" class="mb-4">
                    <div style="display: inline-block;">
                        <router-link
                                :to="{name: 'explorer.transaction', params: {transaction: tx.hash}}"
                                v-text="tx.hash"
                                class="pointer blue--text"
                                tag="pre"
                        ></router-link>
                        <v-layout class="mt-1">
                            <v-flex md8 xs12>
                                <table class="first-padding">
                                    <tr>
                                        <td class="grey--text">Source account</td>
                                        <td><public-key :value="tx.source_account" explorer></public-key></td>
                                    </tr>
                                    <tr>
                                        <td class="grey--text">Created at</td>
                                        <td><date-time :value="tx.created_at"></date-time></td>
                                    </tr>
                                    <tr>
                                        <td class="grey--text">Operations</td>
                                        <td v-text="tx.operation_count"></td>
                                    </tr>
                                </table>
                            </v-flex>
                            <v-flex md4 xs12 class="text-xs-right">
                                <v-btn flat icon><v-icon>search</v-icon></v-btn>
                                <v-btn flat icon class="mx-0"><v-icon>code</v-icon></v-btn>
                            </v-flex>
                        </v-layout>
                    </div>
                </div>
            </transition-group>
        </v-flex>
        <v-flex lg4 xs12>
            <v-btn large block outline class="blue blue--text tall"
                   @click="$router.push({name: 'explorer.network'})"
            >Network explorer</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
  import { StellarServer } from '~/stellar'
  import { flash } from '~/utils'

  export default {
    layout: 'explorer',

    data: () => ({
      loading: true,
      transactions: [],
    }),

    methods: {
      newTransaction(transaction) {
        console.log(transaction)
        this.transactions.unshift(transaction)
        this.transactions.splice(10)
      },
    },

    created() {
      StellarServer().transactions()
        .cursor('now')
        .order('desc')
        .limit(10)
        .call()
        .then(response => {
          this.transactions = response.records
          console.log(response.records[0])

          // this.stream = StellarServer().transactions()
          //   .cursor('now')
          //   .stream({
          //     onmessage: this.newTransaction,
          //   })
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