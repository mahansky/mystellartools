<template>
    <v-app id="app" toolbar>
        <v-navigation-drawer
                persistent
                clipped
                v-model="drawer"
                light
                floating
        >
            <v-list>
                <div class="hidden-lg-and-up">
                    <v-list-tile :to="{name: 'balance'}">
                        <span v-text="activeAccount" class="break-all"></span>
                    </v-list-tile>
                    <v-list-tile @click.stop="() => {if(!unlocked) { drawer = !drawer; clickedLock();}}">
                        <v-list-tile-action>
                            <v-icon v-if="unlocked">lock_open</v-icon>
                            <v-icon v-else>https</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <span v-if="unlocked">Unlocked</span>
                                <span v-else>Click to unlock</span>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click.stop="() => {drawer = !drawer; openDialog();}">
                        <v-list-tile-action>
                            <v-icon>settings</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Settings</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-subheader>ACCOUNT</v-subheader>
                </div>

                <v-list-tile :to="{name: 'balance'}">
                    <v-list-tile-action>
                        <v-icon>account_balance_wallet</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Balance</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'payments'}">
                    <v-list-tile-action>
                        <v-icon>format_align_left</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Payments</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'send'}">
                    <v-list-tile-action>
                        <v-icon>call_made</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Send</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'receive'}">
                    <v-list-tile-action>
                        <v-icon>call_received</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Receive</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'account'}">
                    <v-list-tile-action>
                        <v-icon>language</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Account</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>

                <v-subheader>TOOLS</v-subheader>
                <v-list-tile :to="{name: 'operations'}">
                    <v-list-tile-action>
                        <v-icon>transform</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>All operations</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'trustlines'}">
                    <v-list-tile-action>
                        <v-icon>settings_ethernet</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage trustlines</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'setoptions'}">
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Set options</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'data'}">
                    <v-list-tile-action>
                        <v-icon>dns</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage data</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'merge'}">
                    <v-list-tile-action>
                        <v-icon>merge_type</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Merge accounts</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'transactions'}">
                    <v-list-tile-action>
                        <v-icon>reply_all</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Submit transaction</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar class="blue" dark fixed>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>MyStellar.Tools</v-toolbar-title>
            <v-spacer></v-spacer>
            <div class="selected-account hidden-md-and-down">
                <span class="key ml-3" v-text="activeAccount"></span>
                <v-btn
                        v-if="unlocked"
                        dark icon
                        v-tooltip:left="{ html: 'Unlocked' }"
                       :class="{ 'mr-0': canVerifyPublicKey }"
                >
                    <v-icon>lock_open</v-icon>
                </v-btn>
                <v-btn
                        v-else
                        dark icon
                        v-tooltip:left="{ html: 'Click to unlock' }"
                        @click.stop="clickedLock">
                    <v-icon>https</v-icon>
                </v-btn>
                <v-btn
                        v-if="canVerifyPublicKey"
                        @click="verifyPublicKey"
                        :loading="isVerifyingPublicKey"
                        v-tooltip:left="{ html: 'Verify public key on Ledger' }"
                        class="ml-0"
                        dark icon
                >
                    <v-icon>desktop_windows</v-icon>
                </v-btn>
            </div>
            <v-btn icon @click.stop="openDialog" v-tooltip:left="{ html: 'Settings' }" class="hidden-md-and-down">
                <v-icon>settings</v-icon>
            </v-btn>
            <v-spacer class="hidden-md-and-down"></v-spacer>
            <v-btn icon @click="logout" v-tooltip:left="{ html: 'Exit' }">
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>

        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>

        <envelope></envelope>

        <v-dialog
                v-model="dialog"
                fullscreen
                transition="dialog-bottom-transition"
                hide-overlay
        >
            <settings @close-dialog="closeDialog"></settings>
        </v-dialog>

        <v-dialog v-model="passwordDialog">
            <v-card class="white">
                <v-card-text>
                    <b>Unlock your account</b>
                    <p>Enter the password you used to encrypt the Secret key.</p>
                    <v-text-field
                            label="Password"
                            :append-icon="passwordForm.pw ? 'visibility' : 'visibility_off'"
                            :append-icon-cb="() => (passwordForm.pw = !passwordForm.pw)"
                            :type="passwordForm.pw ? 'password' : 'text'"
                            v-model="passwordForm.password"
                    ></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            flat
                            class="blue--text"
                            @click="unlockSecret"
                    >
                        Unlock
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog width="500" v-model="switchDialog">
            <v-card class="white">
                <accountswitch @done="switchedAccount"></accountswitch>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
  import Settings from './app/settings.vue'
  import Envelope from './app/envelope.vue'
  import Accountswitch from './app/settings/accounts/accountswitch.vue'
  import axios from 'axios'
  import { flash, logout, events } from '~/utils'
  import { Stellar } from '~/stellar'
  import { find } from 'lodash'
  import { getPublicKey } from '~/stellar/ledger'

  const CryptoJS = require('crypto-js')

  export default {
    name: 'app-layout',

    components: {
      Settings,
      Envelope,
      Accountswitch,
    },

    data () {
      return {
        drawer: true,
        dialog: true,
        passwordDialog: false,
        passwordForm: {
          valid: false,
          pw: true,
          password: '',
        },
        isVerifyingPublicKey: false,
        switchDialog: false,
      }
    },

    computed: {
      unlocked () {
        return this.$store.getters.keypairCanSign || this.$store.getters.keypairLedger
      },

      activeAccount () {
        return this.keypair ? this.$store.getters.keypair.publicKey() : ''
      },

      keypair () {
        return this.$store.getters.keypair
      },

      canVerifyPublicKey () {
        return this.$store.getters.keypairLedger
          && this.$store.getters.keypairLedgerAppVersion.split('.')[0] > 1
      },
    },

    watch: {
      keypair (val) {
        if (val === null || val === undefined) {
          this.dialog = true
        }
      },
    },

    methods: {
      logout () {
        logout()
      },

      openDialog () {
        this.dialog = true
      },

      unlockSecret () {
        let publicKey = this.activeAccount

        try {
          let account = find(this.$store.getters.accounts, function (account) {
            return account.public_key === publicKey
          })

          let secret = CryptoJS.AES.decrypt(account.secret_key, this.passwordForm.password).toString(CryptoJS.enc.Utf8);

          this.$store.dispatch('storeKeypair', {
            keypair: Stellar.Keypair.fromSecret(secret)
          })

          this.passwordDialog = false

          flash('Account unlocked', 'success')
        } catch (e) {
          flash('Incorrect password', 'error')
        }
      },

      clickedLock () {
        let publicKey = this.activeAccount

        let account = find(this.$store.getters.accounts, function (account) {
          return account.public_key === publicKey
        })

        if (account && account.secret_key) {
          this.passwordDialog = true
        } else {
          this.switchDialog = true
        }
      },

      switchedAccount () {
        this.switchDialog = false

        this.$router.push({name: 'balance'})
      },

      closeDialog () {
        this.dialog = false
      },

      verifyPublicKey () {
        this.isVerifyingPublicKey = true

        flash('Check your Ledger', 'info')

        getPublicKey(this.$store.getters.keypairBip32Path, false, true)
          .catch(flash)
          .then(() => { this.isVerifyingPublicKey = false })
      },
    },

    created () {
      if (this.keypair === null || this.keypair === undefined) {
        this.dialog = true
      }

      events.$on('contacts:add-contact', () => {
        this.openDialog()
      })
    },
  }
</script>
