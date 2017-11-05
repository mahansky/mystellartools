<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex lg6>
                <v-card-text>
                    <b>Logged in as</b>
                    <p v-text="user.email"></p>
                </v-card-text>

                <v-card-text>
                    <b>Change password</b>
                    <v-form v-model="changePw.valid" ref="changePwRef">
                        <v-text-field
                                label="Current password"
                                v-model="changePw.currentPassword"
                                :rules="changePw.passwordRules"
                                type="password"
                        ></v-text-field>
                        <v-text-field
                                label="New password"
                                v-model="changePw.newPassword"
                                :rules="changePw.passwordRules"
                                type="password"
                        ></v-text-field>
                        <v-text-field
                                label="New password again"
                                v-model="changePw.newPasswordAgain"
                                :rules="changePw.samePasswordRules"
                                type="password"
                        ></v-text-field>

                        <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': changePw.valid, 'red--text': !changePw.valid}"
                                    @click="changePassword"
                                    :loading="changePw.isLoading"
                            >
                                Change
                            </v-btn>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-flex>
            <v-flex lg6>
                <v-card-text>
                    <b>Enable Two-factor authentication</b>
                    <p>
                        To improve security of your account, you can enable 2FA.
                        You will be asked to provide auth code on your next login.
                        Code can be obtained from
                        <a
                                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                                target="_blank" rel="noreferrer nofollow"
                        >Google Authenticator</a>.
                    </p>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import { flash } from '../../../utils'

  export default {
    data () {
      return {
        changePw: {
          valid: false,
          isLoading: false,
          currentPassword: '',
          newPassword: '',
          newPasswordAgain: '',
          passwordRules: [(v) => (!!v && v.length > 5) || 'Password must have at least 6 characters'],
          samePasswordRules: [(v) => (v === this.changePw.newPassword) || 'Passwords must be the same'],
        }
      }
    },

    computed: {
      user () {
        return this.$store.getters.authUser
      },
    },

    methods: {
      changePassword () {
        if (this.$refs.changePwRef.validate()) {
          this.changePw.isLoading = true

          axios.post('/api/change-password', {
            current_password: this.changePw.currentPassword,
            new_password: this.changePw.newPassword,
          }).then((response) => {
            this.$store.dispatch('storeTokens', {
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
            })
            
            flash(this.$store, 'Password changed', 'success')
          }).catch((err) => {
            flash(this.$store, err, 'error')
          })
        }
      },
    },
  }
</script>