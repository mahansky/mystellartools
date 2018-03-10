<template>
    <v-card class="white">
        <v-toolbar card color="white" dense>
            <v-toolbar-title class="body-2 grey--text text--darken-2">
                Login using public key
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <ul class="pb-3">
                <li>Transactions won't be executed</li>
                <li>
                    App will generate XDR to sign transactions manually using
                    <router-link :to="{name: 'txsigner'}">Transaction Signer</router-link>
                </li>
                <li>Login using public key, federation address or QR code</li>
            </ul>

            <v-form v-model="valid" ref="form" @submit.prevent="">
                <v-text-field
                        label="Public key or federation address"
                        v-model="input"
                        :rules="inputRules"
                        append-icon="aspect_ratio"
                        :append-icon-cb="openQrReader"
                ></v-text-field>
            </v-form>

            <qr-reader></qr-reader>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                    flat
                    @click="enter"
                    :class="{ 'blue--text': valid, 'grey--text': !valid }"
                    :loading="loading"
            >Login</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import { events, flash } from '~/utils'
  import { Stellar, ruleAccountIsValid, resolveAccountId } from '~/stellar'
  import QrReader from '~/components/QrReader'

  export default {
    components: {
      QrReader,
    },

    data() {
      return {
        valid: false,
        loading: false,
        input: '',
        inputRules: [ruleAccountIsValid]
      }
    },

    methods: {
      enter() {
        if (this.$refs.form.validate()) {
          this.loading = true

          resolveAccountId(this.input)
            .then(({account_id}) => {
              this.$store.dispatch('storeKeypair', {
                keypair: Stellar.Keypair.fromPublicKey(account_id)
              })

              this.$router.push({name: 'balance'})
            })
            .catch(flash)
            .then(() => {
              this.loading = false
            })
        }
      },

      openQrReader () {
        events.$emit('qr-reader:open')
      },
    },
  }
</script>