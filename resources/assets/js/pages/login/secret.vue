<template>
    <div>
        <v-alert error value="true" class="mb-3">
            This is not the safest way to access MyStellar.Tools! Use at your own risk!
        </v-alert>
        <v-card class="white">
            <v-toolbar card color="white" dense>
                <v-toolbar-title class="body-2 grey--text text--darken-2">
                    Login using secret key
                </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <ul class="pb-3">
                    <li>Full access</li>
                    <li>Ability to store the secret key in browser (encrypted by password)</li>
                </ul>

                <v-form v-model="valid" ref="form" @submit.prevent="">
                    <v-text-field
                            label="Secret key"
                            v-model="input"
                            :rules="inputRules"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        flat
                        @click="enter"
                        :class="{ 'blue--text': valid, 'grey--text': !valid }"
                >Login</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
  import { flash } from '~/utils'
  import { Stellar } from '~/stellar'

  export default {
    data() {
      return {
        valid: false,
        input: '',
        inputRules: [
          (v) => !!v || 'Key is required',
          (v) => {
            try {
              Stellar.Keypair.fromSecret(v)
            } catch (e) {
              return 'Invalid key'
            }

            return true
          }
        ],
      }
    },

    methods: {
      enter () {
        if (this.$refs.form.validate()) {
          this.loading = true

          new Promise((r) => {
            r(Stellar.Keypair.fromSecret(this.input))
          })
            .then(keypair => {
              this.$store.dispatch('storeKeypair', {keypair})
              this.$router.push({name: 'balance'})
            })
            .catch(flash)
            .then(() => {
              this.loading = false
            })
        }
      },
    },
  }
</script>