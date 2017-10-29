<template>
    <main>
        <v-container>
            <v-layout>
                <v-flex xs12>
                    <h1 class="display-3">MyStellar.Tools</h1>
                    <h2 class="display-1 grey--text text--darken-2">Stellar Wallet and Tools to operate with Stellar network</h2>
                </v-flex>
            </v-layout>
            <v-layout class="mt-5">
                <v-flex lg6>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                                label="Public or private key of your Stellar account"
                                v-model="key"
                                :rules="keyRules"
                                required
                        ></v-text-field>

                        <v-btn dark @click="enter" :class="{ blue: valid, '': !valid }">enter</v-btn>
                    </v-form>
                </v-flex>
                <v-flex lg6 class="text-xs-center">
                    <v-btn info dark @click="$router.push({name: 'login'})">LOGIN</v-btn>

                    <span>
                    or create
                    <router-link :to="{name: 'register'}">new account</router-link>
                </span>
                </v-flex>
            </v-layout>
            <v-layout class="mt-5">
                <v-flex xs12 class="grey--text">
                    <div>
                        This is just a temporary frontpage. We are working on a proper one with a clean, simple design and some documentation.
                        <br>
                        Use the form above to enter the application or create an account to log in.
                    </div>
                    <div>
                        Don't forget to respond to the original thread and leave some suggestions on how to improve the application.
                    </div>
                    <div><a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a></div>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { mapGetters } from 'vuex'

  let Stellar = require('stellar-sdk')

  export default {
    metaInfo: () => ({
      title: 'Stellar Wallet and Tools to operate with Stellar network',
    }),

    layout: 'default',

    computed: {
      hasKeypair () {
        return !!this.$store.keypair
      }
    },

    data: () => ({
      title: 'MyStellar.Tools',
      valid: false,
      key: '',
      keyRules: [
        (v) => !!v || 'Key is required',
        (v) => {
          let secret = v[0] === 'S'

          try {
            if (secret) {
              Stellar.Keypair.fromSecret(v)
            } else {
              Stellar.Keypair.fromPublicKey(v)
            }
          } catch (e) {
            return 'Invalid key'
          }

          return true
        }
      ],
    }),

    methods: {
      enter () {
        if (this.$refs.form.validate()) {
          let secret = this.key[0] === 'S'
          let keypair = null

          if (secret) {
            keypair = Stellar.Keypair.fromSecret(this.key)
          } else {
            keypair = Stellar.Keypair.fromPublicKey(this.key)
          }

          this.$store.dispatch('storeKeypair', {keypair})
          this.$router.push('balance')
        }
      }
    }
  }
</script>
