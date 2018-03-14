<template>
    <v-layout row wrap>
        <v-flex xs12 sm10>
            <div class="grey--text mb-3">
                <span v-text="operation.type.toUpperCase() + ' operation'"></span>
                <span v-if="operation.created_at" v-text="'@ ' + operation.created_at"></span>
            </div>

            <component :is="operation.type" :operation="operation"></component>

            <div class="grey--text mt-3">
                <b>Source Account</b>
                <public-key :value="operation.source_account"></public-key>
            </div>
        </v-flex>
        <v-flex xs12 sm2 class="text-sm-right">
            <v-btn icon
                   @click="$router.push({name: 'explorer.transaction', params: {transaction: txHash}})"
                   class="my-0 mx-0"
            ><v-icon class="blue--text">search</v-icon></v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
  import { StellarServer } from '~/stellar'
  import moment from 'moment'
  import Vue from 'vue'

  import account_merge from './account_merge'
  import allow_trust from './allow_trust'
  import change_trust from './change_trust'
  import create_account from './create_account'
  import create_passive_offer from './create_passive_offer'
  import manage_data from './manage_data'
  import manage_offer from './manage_offer'
  import path_payment from './path_payment'
  import payment from './payment'
  import set_options from './set_options'

  export default {
    props: {
      operation: {
        type: Object,
      },
      link: {
        default: true,
      },
    },

    components: {
      account_merge,
      allow_trust,
      change_trust,
      create_account,
      create_passive_offer,
      manage_data,
      manage_offer,
      path_payment,
      payment,
      set_options,
    },

    computed: {
      txHash () {
        return this.operation._links.transaction.href.split('/').pop()
      },
    },

    created () {
      StellarServer().transactions()
        .transaction(this.txHash)
        .call()
        .then((tx) => {
          Vue.set(this.operation, 'created_at', moment(tx.created_at).format('DD.MM.YYYY HH:mm:ss'))
        })
    },
  }
</script>