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
                    <v-btn flat info loading v-if="twoFactorLoading"></v-btn>
                    <template v-if="!twoFactorLoading">
                        <b>Two-factor authentication</b>
                        <template v-if="twoFactorEnabled">
                            <v-btn flat danger @click="disable2FA">Disable</v-btn>
                        </template>

                        <template v-if="!twoFactorEnabled">
                            <p>
                                To improve security of your account, you can enable 2FA.
                                You will be asked to provide auth code on your next login.
                                Code can be obtained from
                                <a
                                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                                        target="_blank" rel="noreferrer nofollow"
                                >Google Authenticator</a> or compatible apps.
                            </p>
                            <v-layout row v-if="!twoFactorShow">
                                <v-spacer></v-spacer>
                                <v-btn flat info @click.stop="twoFactorShow = true">Proceed</v-btn>
                            </v-layout>
                            <v-card class="white" v-if="twoFactorShow">
                                <v-form v-model="twoFactorValid" ref="twoFactorRef">
                                    <v-container fluid grid-list-lg>
                                        <v-layout row>
                                            <v-flex md3>
                                                <v-card-media
                                                        :src="imageUrl"
                                                        height="125px"
                                                        contain
                                                ></v-card-media>
                                            </v-flex>
                                            <v-flex md9>
                                                <div>
                                                    <p>
                                                        Scan this QR code with your Google Authenticator compatible app
                                                        and enter the 6 digit code you will get.
                                                    </p>
                                                    <v-text-field
                                                            label="6 digit code from the app"
                                                            v-model="secret"
                                                            :rules="secretRules"
                                                    ></v-text-field>
                                                </div>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                                flat
                                                info
                                                @click="enable2FA"
                                                :class="{'blue--text': twoFactorValid, 'red--text': !twoFactorValid}"
                                        >
                                            Enable
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </template>
                    </template>
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
        },

        twoFactorLoading: true,
        twoFactorEnabled: false,
        twoFactorShow: false,
        twoFactorValid: false,

        secret: '',
        secretRules: [(v) => (!!v && v.length === 6) || 'Enter 6 digits'],
        imageUrl: '',
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

      enable2FA () {
        if (this.$refs.twoFactorRef.validate()) {
          this.twoFactorLoading = true

          axios.get('/api/2fa/enable', {
            secret: this.secret,
          })
            .catch(err => {
              this.twoFactorEnabled = false

              flash(this.$store, err, 'error')
            })
            .then(() => {
              this.twoFactorLoading = false
            })
        }
      },

      disable2FA () {
        this.twoFactorLoading = true

        axios.get('/api/2fa/disable')
          .catch(err => {
            this.twoFactorEnabled = true

            flash(this.$store, err, 'error')
          })
          .then(() => {
            this.twoFactorLoading = false
          })
      },
    },

    created () {
      axios.get('/api/2fa/check')
        .then(response => {
          this.twoFactorEnabled = response.data.enabled

          if (!this.twoFactorEnabled) {
            this.imageUrl = response.data.image_url
          }
        })
        .catch(err => {
          flash(this.$store, err, 'error')
        })
        .then(() => {
          this.twoFactorLoading = false
        })
    },
  }
</script>