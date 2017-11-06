<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <h1 class="display-3">MyStellar.Tools</h1>
                <h2 class="display-1 grey--text text--darken-2">
                    Stellar Wallet and Tools to operate with Stellar network</h2>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 v-if="!token">
                <v-form v-model="emailForm.valid" ref="emailFormRef">
                    <v-text-field
                            label="Email"
                            v-model="emailForm.email"
                            :rules="emailForm.emailRules"
                    ></v-text-field>
                    <v-btn @click="send">Reset</v-btn>
                </v-form>
                <router-link :to="{name: 'welcome'}">Back to homepage</router-link>
            </v-flex>
            <v-flex xs12 v-if="token">
                <v-form v-model="pwForm.valid" ref="pwFormRef">
                    <v-text-field
                            label="Email"
                            v-model="pwForm.email"
                            :rules="pwForm.emailRules"
                    ></v-text-field>
                    <v-text-field
                            label="Password"
                            v-model="pwForm.password"
                            :rules="pwForm.passwordRules"
                            type="password"
                    ></v-text-field>
                    <v-text-field
                            label="Password again"
                            v-model="pwForm.passwordAgain"
                            :rules="pwForm.passwordAgainRules"
                            type="password"
                    ></v-text-field>
                    <v-btn @click="reset">Reset</v-btn>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../utils'
  import * as utils from '../../utils'

  export default {
    metaInfo: () => ({
      title: 'Password reset',
    }),

    layout: 'default',

    data () {
      return {
        emailForm: {
          valid: false,
          email: '',
          emailRules: [(v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Invalid email'],
        },

        pwForm: {
          valid: false,
          email: '',
          emailRules: [],
          password: '',
          passwordRules: [(v) => (!!v && v.length > 5) || 'Password must have at least 6 characters'],
          passwordAgain: '',
          passwordAgainRules: [(v) => (v === this.pwForm.password) || 'Passwords must be the same'],
        }
      }
    },

    computed: {
      token () {
        return utils.getQueryParameter('token')
      },
    },

    methods: {
      send () {
        if (this.$refs.emailForm.validate()) {
          axios.post('/api/password/send', {
            email: this.emailForm.email,
          }).then(() => {
            flash(this.$store, 'Email with instructions sent', 'success')
          }).catch(err => {
            flash(this.$store, err, 'error')
          })
        }
      },

      reset () {
        if (this.$refs.pwForm.validate()) {
          axios.post('/api/password/reset', {
            email: this.pwForm.email,
            password: this.pwForm.password,
            password_confirmation: this.pwForm.passwordAgain,
            token: this.token,
          }).then(() => {
            this.$router.push({name: 'login'})
          }).catch(err => {
            flash(this.$store, err, 'error')
          })
        }
      },
    },
  }
</script>