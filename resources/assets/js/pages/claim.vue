<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <h1>Claim your lumens</h1>

                <v-btn flat loading info v-if="!secret"></v-btn>

                <template v-if="secret">

                    <p>
                        <span>Public Key</span>
                        <span v-text="keypair.publicKey()"></span>

                        <br>

                        <span>Secret Key</span>
                        <span v-text="keypair.secret()"></span>
                    </p>

                    <v-alert danger>
                        You have to store Secret key, because you won't be able to load this page again!
                    </v-alert>

                    <p>
                        If you need any help, contact us
                        <a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a>
                    </p>
                </template>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import { Stellar } from '../stellar'
  import { mapGetters } from 'vuex'
  import * as utils from '../utils'
  import axios from 'axios'
  import { flash } from '../utils'

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
      let token = utils.getQueryParameter('token')

      if (!token) {
        this.$router.push({name: 'welcome'})
      }

      axios.get('/api/claim', {
        params: {
          token,
        },
      }).then(response => {
        this.secret = response.data.secret

        flash(this.$store, 'Success!', 'success')
      }).catch(err => {
        this.$router.push({name: 'welcome'})
      })
    },
  }
</script>
