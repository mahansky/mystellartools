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
            <v-flex xs12>
                <v-form v-model="valid" ref="form">
                    <v-text-field
                            label="Email"
                            v-model="email"
                            :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                            label="Password"
                            type="password"
                            v-model="password"
                            :rules="passwordRules"
                    ></v-text-field>
                    <v-btn @click="login">Login</v-btn>
                </v-form>
                <router-link :to="{name: 'welcome'}">Back to homepage</router-link>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../utils'

  export default {
    metaInfo: () => ({
      title: 'Login',
    }),

    layout: 'default',

    data () {
      return {
        valid: false,
        email: '',
        emailRules: [(v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Invalid email'],
        password: '',
        passwordRules: [(v) => !!v || 'Password is required'],
      }
    },

    methods: {
      login () {
        if (this.$refs.form.validate()) {
          axios.post('/api/login', {
            email: this.email,
            password: this.password,
          }).then((response) => {
            this.$store.dispatch('storeAuth', {
              user: response.data.user,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            })

            this.$router.push({name: 'balance'})
          }).catch(err => {
            flash(this.$store, err, 'error')
          })
        }
      }
    },
  }
</script>