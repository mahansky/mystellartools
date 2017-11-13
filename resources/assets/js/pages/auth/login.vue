<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Login</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg>
            <v-layout>
                <v-flex md6>
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
                        <v-text-field
                                label="2FA Secret"
                                v-model="secret"
                                :rules="secretRules"
                                hint="Only if you have enabled the feature"
                                permanent-hint
                        ></v-text-field>

                        <v-layout>
                            <v-spacer></v-spacer>
                            <div>
                                <router-link :to="{name: 'password'}">Forgotten password</router-link>
                                <v-btn
                                        dark
                                        @click="login"
                                        :class="{ blue: valid, '': !valid }"
                                        :loading="isLoading"
                                >Login</v-btn>
                            </div>
                        </v-layout>
                    </v-form>
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
      title: 'Login',
    }),

    layout: 'default',

    data () {
      return {
        valid: false,
        isLoading: false,
        email: '',
        emailRules: [(v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Invalid email'],
        password: '',
        passwordRules: [(v) => !!v || 'Password is required'],
        secret: '',
        secretRules: [(v) => (!v || (!!v && v.length === 6)) || '6 digits or nothing if 2FA is disabled'],
      }
    },

    methods: {
      login () {
        if (this.$refs.form.validate()) {
          this.isLoading = true

          axios.post('/api/login', {
            email: this.email,
            password: this.password,
            secret: this.secret ? this.secret : null,
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