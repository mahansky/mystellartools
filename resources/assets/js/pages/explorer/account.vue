<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div class="headline">
                Account <span v-text="$route.params.account"></span>
                <v-btn v-if="loading" loading flat small class="blue--text my-0 mx-0"></v-btn>
            </div>
        </v-flex>
        <v-flex sm12 md7 v-if="account">
            <div class="caption grey--text mb-4 mt-4">BALANCES</div>
            <v-layout row wrap>
                <v-flex xs12 lg4 v-for="asset in balances" :key="asset.asset_issuer">
                    <asset :asset="asset"></asset>
                </v-flex>
            </v-layout>
            <v-layout row wrap>
                <v-flex md12 lg6>
                    <div class="caption grey--text mb-4 mt-4">SIGNERS</div>

                    <v-card>
                        <signer v-for="signer in account.signers" :key="signer.key" :signer="signer"></signer>
                    </v-card>
                </v-flex>
                <v-flex md12 lg6 v-if="Object.keys(account.data_attr).length">
                    <div class="caption grey--text mb-4 mt-4">DATA</div>

                    <v-card>
                        <v-card-text>
                            <div v-for="(value, key) in account.data_attr">
                                <b v-text="key"></b>
                                <span v-text="convert(value)"></span>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 v-if="operations">
                    <div class="caption grey--text mb-4 mt-4">OPERATIONS</div>

                    <v-expansion-panel expand>
                        <v-expansion-panel-content v-for="operation in operations" :key="operation.id">
                            <div slot="header">
                                <code v-text="operation.id" class="mr-3"></code>
                                <span v-text="operation.type.toUpperCase()"></span>
                            </div>
                            <v-card>
                                <v-card-text class="grey lighten-3 px-4">
                                    <operation :operation="operation"></operation>
                                </v-card-text>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-btn flat @click="prev" :disabled="operationsPaginator.prevDisabled" class="ml-0">
                                <v-icon>chevron_left</v-icon> Newer
                            </v-btn>
                        </v-flex>
                        <v-flex xs6 class="text-xs-right">
                            <v-btn flat @click="next" :disabled="operationsPaginator.nextDisabled" class="mr-0">
                                Older <v-icon>chevron_right</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex md1></v-flex>
        <v-flex sm12 md4 v-if="account" class="break-all">
            <div class="caption grey--text mb-4 mt-4">INFORMATION</div>

            <info :account="account"></info>
        </v-flex>
    </v-layout>
</template>

<script>
  import { StellarServer, HorizonURL } from '~/stellar'
  import { flash } from '~/utils'
  import { HorizonPaginator } from '~/stellar/paginator'
  import Info from './account/info'
  import Asset from './account/asset'
  import Signer from './account/signer'
  import Operation from '~/pages/tools/operations/operation'

  export default {
    layout: 'explorer',

    components: {
      Info,
      Asset,
      Signer,
      Operation,
    },

    data: () => ({
      loading: true,
      account: null,
      operations: null,
    }),

    computed: {
      balances () {
        return this.account.balances.sort((a, b) => {
          return a.asset_type === 'native' ? -1 : 1;
        })
      },
    },

    methods: {
      convert (val) {
        return window.atob(val)
      },

      next () {
        this.operationsPaginator.next()
          .then(operations => this.operations = operations)
      },

      prev () {
        this.operationsPaginator.prev()
          .then(operations => this.operations = operations)
      },

      fetch () {
        this.operationsPaginator = new HorizonPaginator(
          HorizonURL() + '/accounts/' + this.$route.params.account + '/operations',
          10
        )

        StellarServer().accounts()
          .accountId(this.$route.params.account)
          .call()
          .then(account => {
            console.log(account)
            this.account = account

            return this.operationsPaginator.fetch()
          })
          .then(operations => {
            this.operations = operations
          })
          .catch(flash)
          .then(() => {
            this.loading = false
          })
      },
    },

    beforeRouteUpdate (to, from, next) {
      next()
      this.fetch()
    },

    created () {
      this.fetch()
    },
  }
</script>