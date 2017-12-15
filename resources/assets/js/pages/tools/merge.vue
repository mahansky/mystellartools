<template>
    <main class="merge">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Merge accounts
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="valid" ref="form" @submit.prevent="">
                                <v-text-field
                                        label="Destination account"
                                        v-model="destination"
                                        :rules="destinationRules"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                                    flat
                                    @click="merge"
                                    :loading="isLoading"
                            >
                                Merge accounts
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Account Merge</b>
                    <p>
                        Transfers the native balance (the amount of XLM an account holds) to destination account and removes the source account from the ledger.</p>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { ruleAccountIsValid, Stellar, StellarServer } from '../../stellar'
  import { TransactionBuilder, Operation, Keypair } from 'stellar-sdk'
  import { flash } from '../../utils'
  import { submitTransaction } from '../../stellar/internal'
  import * as utils from '../../utils'

  export default {
    metaInfo: () => ({
      title: 'Merge account',
    }),

    data () {
      return {
        valid: false,
        destination: '',
        destinationRules: [(v) => ruleAccountIsValid(v)],
        isLoading: false,
      }
    },

    methods: {
      merge () {
        if (this.$refs.form.validate()) {
          this.isLoading = true

          submitTransaction('mergeAccounts', {destination: this.destination})
            .then(() => {
              utils.logout()
            })
            .catch((err) => {
              flash(this.$store, err, 'error')
            })
            .then(() => {
              this.isLoading = false
            })
        }
      }
    }
  }
</script>