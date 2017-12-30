<template>
    <v-dialog v-model="dialog" lazy absolute width="400">
        <v-card>
            <v-card-title>
                <div class="headline">Create new Stellar account</div>
            </v-card-title>
            <v-card-text>
                <div>Public key</div>
                <code v-text="newKeypair.publicKey()"></code>

                <div class="mt-2">Secret key</div>
                <code v-text="newKeypair.secret()"></code>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon flat @click="createNewKeypair">
                    <v-icon>autorenew</v-icon>
                </v-btn>
                <v-btn class="blue--text" flat @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import { Stellar } from '~/stellar'
  import { events } from '~/utils'

  export default {
    data: () => ({
      dialog: false,
      newKeypair: Stellar.Keypair.random(),
    }),

    methods: {
      createNewKeypair () {
        this.newKeypair = Stellar.Keypair.random()
      },
    },

    created () {
      events.$on('welcome.key:create-account', () => {
        this.dialog = true
      })
    },
  }
</script>