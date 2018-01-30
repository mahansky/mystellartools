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
                        Transfers the native balance (the amount of XLM an account holds)
                        to destination account and removes the source account from the ledger.
                    </p>
                    <p>
                        Account can not have any subentries. You can check the count of your
                        subentries on the <router-link :to="{name: 'account'}">Account</router-link> page.
                    </p>
                    <p>
                        Following are considered a subentry:
                    </p>
                    <ul>
                        <li>Trustline</li>
                        <li>Offer</li>
                        <li>Data</li>
                    </ul>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { ruleAccountIsValid, resolveAccountId, Stellar, StellarServer } from '~/stellar'
  import { flash, logout } from '~/utils'
  import { submitTransaction } from '~/stellar/internal'
  import knownAccounts from '~/stellar/known_accounts'

  export default {
    metaInfo: () => ({
      title: 'Merge account',
    }),

    data () {
      return {
        valid: false,
        destination: '',
        destinationRules: [ruleAccountIsValid, v => {
          if (v === this.$store.getters.keypair.publicKey()) {
            return 'Must be different from current account'
          }

          return true
        }],
        isLoading: false,
      }
    },

    methods: {
      merge () {
        if (this.$refs.form.validate()) {
          this.isLoading = true

          resolveAccountId(this.destination).then(({account_id}) => {
            if (account_id in knownAccounts && knownAccounts[account_id].mergeOpAccepted === false) {
              throw new Error(knownAccounts[account_id].name + ' does not support this operation', 'error')
            }

            return submitTransaction('mergeAccounts', {destination: account_id})
              .then(() => {
                logout()
              })
          })
          .catch(err => {
            this.isLoading = false

            flash(err, 'error')
          })
        }
      }
    }
  }
</script>