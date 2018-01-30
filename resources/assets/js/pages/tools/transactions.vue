<template>
    <main class="merge">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Submit transaction to the Stellar network
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="valid" ref="form" @submit.prevent="">
                                <v-text-field
                                        label="Transaction envelope XDR"
                                        v-model="tx"
                                        :rules="txRules"
                                        multi-line
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                                    flat
                                    @click="submit"
                                    :loading="isLoading"
                            >
                                Submit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <v-card class="white" v-if="result">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Result
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn
                                    small
                                    flat
                                    :success="resultOk"
                                    :error="!resultOk"
                                    v-text="resultOk ? 'OK' : 'FAIL'"
                            ></v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <pre class="break-all pre-wrap syntax-highlight" v-html="result"></pre>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { StellarServer, Stellar } from '~/stellar'
  import { flash, syntaxHighlight } from '~/utils'

  export default {
    data: () => ({
      valid: false,
      isLoading: false,
      tx: '',
      txRules: [v => {
        try {
          new Stellar.Transaction(v)
          return true
        } catch (e) {
          return 'Invalid transaction'
        }
      }],
      result: null,
      resultOk: true,
    }),

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          this.isLoading = true
          this.result = null

          StellarServer.submitTransaction(new Stellar.Transaction(this.tx))
            .then(response => {
              return response
            })
            .catch(err => {
              return err.data
            })
            .then(response => {
              this.isLoading = false

              if (response.hash) {
                flash('Transaction submitted to the network', 'success')
                this.resultOk = true
              } else {
                flash('Transaction submission failed', 'error')
                this.resultOk = false
              }

              this.result = syntaxHighlight(JSON.stringify(response, null, 2))
            })
        }
      }
    },
  }
</script>