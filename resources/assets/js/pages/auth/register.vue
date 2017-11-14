<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Register</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg>
            <v-layout wrap row>
                <v-flex md6>
                    <v-form v-model="valid" ref="form">
                        <v-text-field
                                label="Email"
                                v-model="email"
                                :rules="emailRules"
                        ></v-text-field>
                        <v-text-field
                                label="Password"
                                password
                                v-model="password"
                                :rules="passwordRules"
                                type="password"
                        ></v-text-field>
                        <v-text-field
                                label="Password again"
                                password
                                v-model="password2"
                                :rules="password2Rules"
                                type="password"
                        ></v-text-field>

                        <v-layout>
                            <v-spacer></v-spacer>
                            <v-btn
                                    dark
                                    @click="register"
                                    :class="{ blue: valid, '': !valid }"
                                    :loading="isLoading"
                            >Register</v-btn>
                        </v-layout>
                    </v-form>
                </v-flex>
                <v-flex md6>
                    <b>You'll get access to following features:</b>
                    <ul>
                        <li>Multiple accounts</li>
                        <li>Contact list</li>
                        <li>Simpler transaction signing - replace secret key with any password</li>
                        <li>2FA Auth</li>
                        <li>and others...</li>
                    </ul>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../utils'

  export default {
    metaInfo: () => ({
      title: 'Register',
    }),

    layout: 'default',

    data () {
      return {
        valid: false,
        isLoading: false,
        email: '',
        emailRules: [(v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Invalid email'],
        password: '',
        passwordRules: [(v) => (!!v && v.length > 5) || 'At least 6 characters'],
        password2: '',
        password2Rules: [(v) => (!!v && v === this.password) || 'Passwords must be the same'],
      }
    },

    methods: {
      register () {
        if (this.$refs.form.validate()) {
          this.isLoading = true

          axios.post('/api/register', {
            email: this.email,
            password: this.password,
            password_confirmation: this.password,
          }).then((response) => {
            this.$store.dispatch('storeAuth', {
              user: response.data.user,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            })

            this.$router.push({name: 'balance'})
          }).catch(err => {
            flash(this.$store, err, 'error')
          }).then(() => {
            this.isLoading = false
          })
        }
      }
    },
  }
</script>