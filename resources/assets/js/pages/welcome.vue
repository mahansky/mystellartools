<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <h1 class="text-xs-center">Interstellar.Tools</h1>

                <v-form v-model="valid" ref="form">
                    <v-text-field
                            label="Public or private key of your Stellar account"
                            v-model="key"
                            :rules="keyRules"
                            required
                    ></v-text-field>

                    <v-btn dark @click="enter" :class="{ blue: valid, red: !valid }">enter the interstellar</v-btn>
                </v-form>

                <router-link :to="{name: 'login'}">Login</router-link>
                <router-link :to="{name: 'register'}">Register</router-link>

                <router-link :to="{name: 'balance'}" v-if="hasKeypair">GO TO THE APP</router-link>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  let Stellar = require('stellar-sdk')

  export default {
    layout: 'default',

    computed: {
      hasKeypair () {
        return !! this.$store.keypair
      }
    },

    data: () => ({
      title: window.config.appName,
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
