<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex lg12 xl8 offset-xl2>
                        <div class="display-2">Claim your Lumens</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg class="mt-3">
            <v-layout>
                <v-flex lg12 xl8 offset-xl2>
                    <v-layout class="mt-3">
                        <v-flex xs12>
                            <v-btn flat loading info v-if="!secret"></v-btn>

                            <template v-if="secret">
                                <div class="subheading grey--text text--darken-2 mb-2">Public Key</div>
                                <code v-text="keypair.publicKey()"></code>

                                <div class="subheading grey--text text--darken-2 mb-2 mt-4">Secret Key</div>
                                <code v-text="keypair.secret()"></code>

                                <v-alert error value="true" class="my-5">
                                    You have to store your Secret key, because you won't be able to load this page again!
                                </v-alert>

                                <p>
                                    If you need any help, contact us
                                    <a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a>
                                </p>
                            </template>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import { Stellar } from '~/stellar'
  import { mapGetters } from 'vuex'
  import { flash, getQueryParameter } from '~/utils'
  import axios from 'axios'

  export default {
    metaInfo: () => ({
      title: 'Claim your Lumens',
    }),

    layout: 'default',

    data: () => ({
      secret: '',
    }),

    computed: {
      keypair () {
        return Stellar.Keypair.fromSecret(this.secret)
      },
    },

    created () {
      let token = getQueryParameter('token')

      if (!token) {
        this.$router.push({name: 'welcome'})
      }

      axios.get('/api/claim', {
        params: {
          token,
        },
      }).then(response => {
        this.secret = response.data.secret

        flash('Success!', 'success')
      }).catch(() => {
        this.$router.push({name: 'welcome'})
      })
    },
  }
</script>
