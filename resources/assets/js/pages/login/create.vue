<template>
    <v-card class="white">
        <v-toolbar card color="white" dense>
            <v-toolbar-title class="body-2 grey--text text--darken-2">
                Create a new Stellar account
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <div>Public key</div>
            <code v-text="newKeypair.publicKey()"></code>

            <div class="mt-2">Secret key</div>
            <code v-text="newKeypair.secret()"></code>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="blue--text" flat @click="createNewKeypair">
                Generate
                <v-icon right>autorenew</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import { Stellar } from '~/stellar'

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
  }
</script>