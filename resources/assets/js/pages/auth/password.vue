<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Forgotten password</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg class="mt-3">
            <v-layout>
                <v-flex md6 v-if="!token">
                    <v-form v-model="emailForm.valid" ref="emailFormRef">
                        <v-text-field
                                label="Email"
                                v-model="emailForm.email"
                                :rules="emailForm.emailRules"
                        ></v-text-field>

                        <v-layout>
                            <v-spacer></v-spacer>
                            <v-btn
                                    dark
                                    @click="send"
                                    :class="{ blue: emailForm.valid, '': !emailForm.valid }"
                                    :loading="emailForm.isLoading"
                            >Reset</v-btn>
                        </v-layout>
                    </v-form>
                </v-flex>
                <v-flex md6 v-if="token">
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

                        <v-layout>
                            <v-spacer></v-spacer>
                            <v-btn
                                    dark
                                    @click="reset"
                                    :class="{ blue: pwForm.valid, '': !pwForm.valid }"
                                    :loading="pwForm.isLoading"
                            >Reset</v-btn>
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
          isLoading: false,
          email: '',
          emailRules: [(v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Invalid email'],
        },

        pwForm: {
          valid: false,
          isLoading: false,
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
        if (this.$refs.emailFormRef.validate()) {
          this.emailForm.isLoading = true

          axios.post('/api/password/send', {
            email: this.emailForm.email,
          }).then(() => {
            flash(this.$store, 'Email with instructions sent', 'success')
          }).catch(err => {
            flash(this.$store, err, 'error')
          }).then(() => {
            this.emailForm.isLoading = false
          })
        }
      },

      reset () {
        if (this.$refs.pwFormRef.validate()) {
          this.pwForm.isLoading = true

          axios.post('/api/password/reset', {
            email: this.pwForm.email,
            password: this.pwForm.password,
            password_confirmation: this.pwForm.passwordAgain,
            token: this.token,
          }).then(() => {
            this.$router.push({name: 'login'})
          }).catch(err => {
            flash(this.$store, err, 'error')
          }).then(() => {
            this.pwForm.isLoading = false
          })
        }
      },
    },
  }
</script>