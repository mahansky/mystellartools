<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div class="headline">
                <span class="inline-block">Transaction</span>
                <span v-text="transaction.hash" v-if="transaction" class="txhash inline-block"></span>
                <v-btn :loading="loading" flat small class="blue--text" v-else></v-btn>
            </div>
        </v-flex>
        <v-flex sm12 md7 v-if="transaction">
            <div class="caption grey--text mb-4 mt-4">SIGNATURES</div>

            <div v-for="signature in signatures" class="mb-3 elevation-2 py-2.5 px-4 break-all white">
                <pre v-html="publicKeyHint(signature._attributes.hint)" class="break-all pre-wrap"></pre>
                <span v-text="signature._attributes.signature.toString('base64')" class="grey--text"></span>
            </div>

            <div class="caption grey--text mb-4 mt-5">OPERATIONS</div>

            <v-expansion-panel expand>
                <v-expansion-panel-content v-for="operation in operations" :key="operation.id">
                    <div slot="header">
                        <code v-text="operation.id" class="mr-3"></code>
                        <span v-text="operation.type.toUpperCase()"></span>
                    </div>
                    <v-card>
                        <v-card-text class="grey lighten-3 px-4">
                            <operation :operation="operation" :link="false"></operation>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-flex>
        <v-flex md1></v-flex>
        <v-flex sm12 md4 v-if="transaction" class="break-all">
            <div class="caption grey--text mb-4 mt-4">INFORMATION</div>

            <v-layout row wrap>
                <v-flex xs12>
                    <div class="info-block">
                        <b>Hash</b>
                        <code v-text="transaction.hash"></code>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Ledger</b>
                        <router-link :to="{name: 'explorer.ledger', params: {ledger: transaction.ledger_attr}}"
                                     v-text="transaction.ledger_attr"
                                     class="no-decor"
                        ></router-link>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Created At</b>
                        <date-time :value="transaction.created_at"></date-time>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Source Account</b>
                        <public-key :value="transaction.source_account"></public-key>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Account Sequence</b>
                        <span v-text="transaction.source_account_sequence"></span>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Fee</b>
                        <div v-text="transaction.fee_paid"></div>
                    </div>
                </v-flex>
                <v-flex xs12 md6>
                    <div class="info-block">
                        <b>Memo</b>
                        <span v-text="transaction.memo_type.toUpperCase()"></span>
                        <span v-if="transaction.memo_type !== 'none'" v-text="': ' + transaction.memo"></span>
                    </div>
                </v-flex>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
  // TODO: link to Horizon, verify button
  import { Stellar, StellarServer } from '~/stellar'
  import { flash } from '~/utils'
  import Operation from '~/pages/tools/operations/operation'

  export default {
    layout: 'explorer',

    components: {
      Operation,
    },

    data: () => ({
      loading: true,
      transaction: null,
      signatures: [],
      operations: [],
    }),

    methods: {
      publicKeyHint (hint) {
        let keypair = new Stellar.Keypair({
          type: 'ed25519',
          publicKey: Buffer.concat([Buffer.alloc(28).fill(0), hint])
        })

        let dots = Buffer.alloc(46).fill('-').toString()

        return `G${dots}${keypair.publicKey().substr(47, 5)}----`
      },

      fetch () {
        StellarServer().transactions()
          .transaction(this.$route.params.transaction)
          .call()
          .then(tx => {
            this.transaction = tx
            this.signatures = new Stellar.Transaction(tx.envelope_xdr).signatures

            return tx.operations()
          })
          .then(ops => {
            this.operations = ops._embedded.records
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

<style lang="scss" scoped>
    .py-2\.5 {
        padding-top: 12px;
        padding-bottom: 12px;
    }

    .txhash {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;

        &:hover {
            width: auto;
        }
    }
</style>