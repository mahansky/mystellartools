<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex md6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Revoke payment
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="valid" ref="form">
                                <v-text-field
                                        label="Email address"
                                        v-model="email"
                                        :rules="emailRules"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :loading="checkLoading"
                                    @click="check"
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                            >Revoke</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <b>Revoke payment</b>
                    <p>
                        If you sent some Lumens to an email address and the recipient
                        didn't claim them, you can get them back.
                    </p>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { StellarServer, Stellar } from '~/stellar'
  import { forEach } from 'lodash'
  import { flash } from '~/utils'
  import { submitTransaction } from '~/stellar/internal'
  import axios from 'axios'

  export default {
    data () {
      return {
        valid: false,
        checkLoading: false,
        email: '',
        emailRules: [],
      }
    },

    methods: {
      check () {
        this.checkLoading = true

        let publicKey

        Stellar.FederationServer.resolve(this.email + '*mystellar.tools')
          .then(({account_id}) => {
            publicKey = account_id

            return StellarServer.loadAccount(account_id)
          })
          .then(account => {
            let isSigner = false

            forEach(account.signers, (signer) => {
              if (signer.public_key === this.$store.getters.keypair.publicKey()) {
                isSigner = true
              }
            })

            if (! isSigner) {
              throw new Error('You are not a signer of requested account')
            }
          })
          .then(() => {
            return submitTransaction('payment', {
              destination: publicKey,
              code: 'XLM',
              amount: '0.00001',
            })
          })
          .then(() => {
            return axios.post('/api/revoke', {
              public_key: publicKey,
            })
          })
          .then((response) => {
            flash(response.data, 'success')
          })
          .catch(err => {
            flash(err, 'error')
          })
          .then(() => {
            this.checkLoading = false
          })
      },
    },
  }
</script>