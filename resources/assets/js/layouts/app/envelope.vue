<template>
    <v-dialog v-model="dialog" width="600">
        <v-card class="white">
            <v-toolbar card color="white" dense>
                <v-toolbar-title class="body-2 grey--text text--darken-2">
                    Transaction details
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <p>
                  <b>You are using the application without your secret key, 
                  so we can not sign your transaction and submit it to the network.</b>
                  <br>
                  You can sign it on your own using the following details with 
                  <router-link :to="{name: 'txsigner'}">Transaction Signer</router-link>.
              </p>

              <v-text-field
                      label="Transaction hash"
                      v-model="hash"
                      readonly
              ></v-text-field>
              <v-text-field
                      label="Transaction envelope XDR"
                      v-model="envelope"
                      readonly
                      multi-line
              ></v-text-field>

              <p>
                  After signing your transaction, you can <router-link :to="{name: 'transactions'}">submit it</router-link> to the network.
              </p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click.stop="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import { events } from '~/utils'

  export default {
    data: () => ({
      dialog: false,
      envelope: '',
      hash: '',
    }),

    created () {
      events.$on('transactions:manual-signing', data => {
        this.envelope = data.envelope
        this.hash = data.hash
        this.dialog = true
      })
    },
  }
</script>

