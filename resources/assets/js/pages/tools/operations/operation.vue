<template>
    <div>
        <div class="grey--text mb-3">
            <span v-text="operation.type.toUpperCase() + ' operation'"></span>
            <span v-if="operation.created_at" v-text="'@ ' + operation.created_at"></span>
        </div>

        <component :is="operation.type" :operation="operation"></component>

        <div class="mt-3">
            <a :href="operation._links.self.href" target="_blank" rel="noreferrer nofollow">
                <small>#{{ operation.id }}</small>
            </a>
        </div>
    </div>
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
    props: ['operation'],

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

    created () {
      StellarServer.transactions()
        .transaction(this.operation._links.transaction.href.split('/').pop())
        .call()
        .then((tx) => {
          Vue.set(this.operation, 'created_at', moment(tx.created_at).format('DD.MM.YYYY HH:mm:ss'))
        })
    },
  }
</script>