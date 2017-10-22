<template>
    <v-container>
        <v-layout>
            <v-flex xs12>
                <v-text-field
                        label="Email"
                        v-model="email"
                ></v-text-field>
                <v-text-field
                        label="Password"
                        password
                        v-model="password"
                ></v-text-field>
                <v-btn @click="login">Login</v-btn>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../utils'

  export default {
    layout: 'default',

    data () {
      return {
        email: '',
        password: '',
      }
    },

    methods: {
      login () {
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
    },
  }
</script>