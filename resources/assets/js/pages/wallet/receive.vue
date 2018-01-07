<template>
    <main class="receive">
        <v-container grid-list-lg>
            <v-layout row wrap v-if="!loaded">
                <v-flex lg12>
                    <v-btn flat info loading></v-btn>
                </v-flex>
            </v-layout>
            <v-layout row wrap v-if="loaded">
                <v-flex lg6>
                    <federation :stellar-addresses="stellarAddresses"></federation>
                </v-flex>
                <v-flex lg6>
                    <b>Stellar address</b>
                    <p>
                        Stellar addresses provide an easy way to share your payment details.
                        It replaces your public key with easy to remember name/email/text.
                    </p>
                    <p>
                        Your Stellar address can not be changed later!
                    </p>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="qrcode">
                <qrcodes :stellar-addresses="stellarAddresses"></qrcodes>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import Federation from './receive/federation'
  import Qrcodes from './receive/qrcodes'

  import axios from 'axios'
  import { flash } from '~/utils'

  export default {
    components: {
      Federation,
      Qrcodes,
    },

    metaInfo: () => ({
      title: 'Receive',
    }),

    data () {
      return {
        loaded: false,
        stellarAddresses: [],
      }
    },

    methods: {
      fetch () {
        this.loaded = false

        axios.get('/api/federation', {
          params: {
            q: this.$store.getters.keypair.publicKey(),
            type: 'id',
          }
        }).then(response => {
          this.stellarAddresses = response.data.all
        }).catch(error => {
        }).then(() => {
          this.loaded = true
        })
      },
    },

    created () {
      this.fetch()
    },
  }
</script>