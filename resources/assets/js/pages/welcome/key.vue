<template>
    <v-form v-model="valid" ref="form" class="mt-4 pt-4">
        <v-text-field
                label="Stellar Public or Private Key"
                v-model="key"
                :rules="keyRules"
        ></v-text-field>

        <v-layout class="text-xs-center">
            <v-flex>
                <v-btn dark @click="enter" :class="{ 'blue': valid, '': !valid }">enter</v-btn>
                or
                <a href="#" @click.prevent.stop="createAccount">create new Stellar account</a>
            </v-flex>
        </v-layout>
    </v-form>
</template>

<script>
  import { events } from '~/utils'
  import { Stellar } from '~/stellar'

  export default {
    data: () => ({
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
          let keypair = null

          if (this.key[0] === 'S') {
            keypair = Stellar.Keypair.fromSecret(this.key)
          } else {
            keypair = Stellar.Keypair.fromPublicKey(this.key)
          }

          this.$store.dispatch('storeKeypair', {keypair})
          this.$router.push('balance')
        }
      },

      createAccount () {
        events.$emit('welcome.key:create-account')
      },
    },
  }
</script>