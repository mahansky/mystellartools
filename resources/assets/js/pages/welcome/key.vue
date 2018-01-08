<template>
    <v-form v-model="valid" ref="form" class="mt-4 pt-4">
        <v-text-field
                label="Stellar public/private key or federation address"
                v-model="key"
                :rules="keyRules"
                autofocus
        ></v-text-field>

        <v-layout class="text-xs-center">
            <v-flex>
                <v-btn
                        dark
                        @click="enter"
                        :class="{ 'blue': valid, '': !valid }"
                        :loading="loading"
                >enter</v-btn>
                or
                <a href="#" @click.prevent.stop="createAccount">create new Stellar account</a>
            </v-flex>
        </v-layout>
    </v-form>
</template>

<script>
  import { events, flash } from '~/utils'
  import { Stellar, resolveAccountId } from '~/stellar'

  export default {
    data: () => ({
      loading: false,
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
            let regex = new RegExp('^.+\\*.+$')

            if (!regex.test(v)) {
              return 'Invalid key'
            }
          }

          return true
        }
      ],
    }),

    methods: {
      enter () {
        if (this.$refs.form.validate()) {
          this.loading = true

          new Promise((r) => {
            if (this.key[0] === 'S') {
              r(Stellar.Keypair.fromSecret(this.key))
            } else {
              resolveAccountId(this.key).then(({account_id}) => {
                r(Stellar.Keypair.fromPublicKey(account_id))
              })
            }
          })
            .then(keypair => {
              this.$store.dispatch('storeKeypair', {keypair})
              this.$router.push('balance')
            })
            .catch(flash)
            .then(() => {
              this.loading = false
            })
        }
      },

      createAccount () {
        events.$emit('welcome.key:create-account')
      },
    },
  }
</script>