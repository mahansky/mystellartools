<template>
    <v-card class="white">
        <v-toolbar card color="white" dense>
            <v-toolbar-title class="body-2 grey--text text--darken-2">
                Setup Stellar address
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <div class="mb-2">
                <b>Stellar addresses:</b>
                <ul>
                    <li v-for="addr in stellarAddresses">
                        <span v-text="addr"></span>
                    </li>
                    <li v-if="stellarAddresses.length === 0"><i>None set</i></li>
                </ul>
            </div>

            <v-form v-model="valid" ref="form">
                <v-text-field
                        v-model="newStellarAddress"
                        :rules="addressRules"
                        label="Stellar address"
                        suffix="*mystellar.tools"
                ></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat :class="{'blue--text': valid, 'red--text': !valid}" @click="setAddress">
                Set
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import axios from 'axios'
  import { flash } from '~/utils'

  export default {
    props: ['stellarAddresses'],

    data: () => ({
      valid: false,
      newStellarAddress: '',
      addressRules: [
        (v) => !!v || 'Stellar address is required',
        (v) => {
          if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v)) {
            if (!/^[\w]+$/.test(v)) {
              return 'Only emails or alphanumeric names are allowed'
            }
          }

          return true
        }
      ],
    }),

    methods: {
      setAddress () {
        if (this.$refs.form.validate()) {
          axios.post('/api/federation', {
            account_id: this.$store.getters.keypair.publicKey(),
            stellar_address: this.newStellarAddress,
          }).then(() => {
            this.$parent.fetch()
          }).catch(error => {
            flash(error.response.data.detail, 'error')
          })
        }
      },
    },
  }
</script>