<template>
    <main class="operations">
        <v-btn info loading flat v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-if="loaded">
            <v-layout row>
                <v-flex xs12>
                    <v-expansion-panel expand v-if="operations.length > 0">
                        <v-expansion-panel-content v-for="operation in operations" :key="operation.id">
                            <div slot="header">
                                <v-layout row>
                                    <v-flex lg4>
                                        <code v-text="operation.id" class="mr-3"></code>
                                    </v-flex>
                                    <v-flex lg8>
                                        <span v-text="operation.type.toUpperCase()"></span>
                                    </v-flex>
                                </v-layout>
                            </div>
                            <v-card>
                                <v-card-text class="grey lighten-4">
                                    <keep-alive>
                                        <component :is="operation.type" :operation="operation"></component>
                                    </keep-alive>

                                    <div class="mt-3">
                                        <a :href="operation._links.self.href" target="_blank" rel="noreferrer nofollow">
                                            <small>#{{ operation.id }}</small>
                                        </a>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <p v-else class="grey--text">No results.</p>
                </v-flex>
            </v-layout>
            <v-layout row class="mt-3">
                <v-flex md2>
                    <v-btn flat class="grey grey--text text--darken-3" :disabled="prevDisabled" @click="prev">
                        <v-icon>chevron_left</v-icon>
                        Prev
                    </v-btn>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex md2 class="text-xs-right">
                    <v-btn flat class="grey grey--text text--darken-3" :disabled="nextDisabled" @click="next">
                        Next
                        <v-icon>chevron_right</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer } from '../../stellar'
  import axios from 'axios'

  import account_merge from './operations/account_merge.vue'
  import allow_trust from './operations/allow_trust.vue'
  import change_trust from './operations/change_trust.vue'
  import create_account from './operations/create_account.vue'
  import create_passive_offer from './operations/create_passive_offer.vue'
  import inflation from './operations/inflation.vue'
  import manage_data from './operations/manage_data.vue'
  import manage_offer from './operations/manage_offer.vue'
  import path_payment from './operations/path_payment.vue'
  import payment from './operations/payment.vue'
  import set_options from './operations/set_options.vue'
  import { first, last, orderBy } from 'lodash'

  export default {
    components: {
      account_merge,
      allow_trust,
      change_trust,
      create_account,
      create_passive_offer,
      inflation,
      manage_data,
      manage_offer,
      path_payment,
      payment,
      set_options,
    },

    data () {
      return {
        loaded: false,
        nextDisabled: false,
        prevDisabled: true,
        pressedNext: true,
        nextId: null,
        prevId: null,
        parameters: {
          order: 'desc',
          limit: 15,
          cursor: '',
        },
        lastWorkingParameters: {
          order: 'desc',
          limit: 15,
          cursor: '',
        },
        rawOperations: [],
      }
    },

    computed: {
      operations () {
        return orderBy(this.rawOperations, ['id'], ['desc'])
      }
    },

    created () {
      this.fetch()
    },

    methods: {
      fetch (goNext = true) {
        let vm = this

        vm.loaded = false

        if (goNext) {
          if (this.nextId) {
            this.parameters.order = 'desc'
            this.parameters.cursor = this.nextId
          }
        } else {
          if (this.prevId) {
            this.parameters.order = 'asc'
            this.parameters.cursor = this.prevId
          }
        }

        axios.get('https://horizon.stellar.org/accounts/GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R/operations', {
          params: this.parameters
        })
          .then(response => {
            vm.processResponse(response.data)
            vm.loaded = true
          })
      },

      processResponse (operations) {
        this.rawOperations = operations._embedded.records

        this.parseNextAndPrevId(this.operations)

        this.nextDisabled = false
        this.prevDisabled = false

        if (this.operations.length < 15) {
          if (this.pressedNext) {
            this.nextDisabled = true
          } else {
            this.prevDisabled = true
          }
        }
      },

      parseNextAndPrevId (operations) {
        if (operations.length === 0) {
          this.prevId = null
          this.nextId = null

          this.parameters = JSON.parse(JSON.stringify(this.lastWorkingParameters))

          return
        }

        this.lastWorkingParameters = JSON.parse(JSON.stringify(this.parameters))

        let prev = first(operations)

        if (prev) {
          this.prevId = prev.id
        }

        let next = last(operations)

        if (next) {
          this.nextId = next.id
        }
      },

      prev () {
        this.pressedNext = false
        this.fetch(false)
      },

      next () {
        this.pressedNext = true
        this.fetch(true)
      }
    }
  }
</script>