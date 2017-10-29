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
                <v-list-tile :to="{name: 'send'}" :disabled="!unlocked">
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
                <v-list-tile :to="{name: 'trustlines'}" :disabled="!unlocked">
                    <v-list-tile-action>
                        <v-icon>settings_ethernet</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage trustlines</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'setoptions'}" :disabled="!unlocked">
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Set options</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'data'}" :disabled="!unlocked">
                    <v-list-tile-action>
                        <v-icon>dns</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage data</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{name: 'merge'}" :disabled="!unlocked">
                    <v-list-tile-action>
                        <v-icon>merge_type</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Merge accounts</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar class="blue" dark fixed>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>MyStellar.Tools</v-toolbar-title>
            <v-spacer></v-spacer>
            <div class="selected-account">
                <span class="key ml-3" v-text="activeAccount"></span>
                <v-btn v-if="unlocked" dark icon v-tooltip:bottom="{ html: 'Unlocked with secret' }">
                    <v-icon>lock_open</v-icon>
                </v-btn>
                <v-btn v-else dark icon v-tooltip:bottom="{ html: 'Click to unlock' }" @click.stop="clickedLock">
                    <v-icon>https</v-icon>
                </v-btn>
            </div>
            <v-btn icon @click.stop="openDialog" v-tooltip:bottom="{ html: 'Settings' }">
                <v-icon>settings</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="logout" v-tooltip:bottom="{ html: 'Logout' }">
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>

        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>

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
                            :loading="passwordForm.isLoading"
                    >
                        Unlock
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
  import Settings from './app/settings.vue'
  import axios from 'axios'
  import { flash } from '../utils'

  export default {
    name: 'app-layout',

    components: {
      Settings,
    },

    data () {
      return {
        drawer: true,
        dialog: false,
        passwordDialog: false,
        passwordForm: {
          valid: false,
          pw: true,
          isLoading: false,
          password: '',
        },
      }
    },

    computed: {
      unlocked () {
        return this.$store.getters.keypairCanSign || this.$store.getters.keypairSssOk
      },

      activeAccount () {
        return this.keypair ? this.$store.getters.keypair.publicKey() : ''
      },

      keypair () {
        return this.$store.getters.keypair
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
        this.$store.dispatch('removeKeypair')
        this.$store.dispatch('logout')
        this.$router.push({name: 'welcome'})
      },

      openDialog () {
        this.dialog = true
      },

      unlockSecret () {
        this.passwordForm.isLoading = true

        axios.post('/api/unlock', {
          public_key: this.activeAccount,
          password: this.passwordForm.password,
        }).then(() => {
          this.passwordDialog = false
          this.passwordForm.password = ''

          this.$store.dispatch('updateSss', {
            sss: true,
            sssOk: true,
          })

          flash(this.$store, 'Account unlocked', 'success')
        }).catch((err) => {
          flash(this.$store, err, 'error')
        }).then(() => {
          this.passwordForm.isLoading = false
        })
      },

      clickedLock () {
        if (this.$store.getters.keypairSss && !this.$store.getters.keypairSssOk) {
          this.passwordDialog = true
        }

        if (!this.$store.getters.keypairSss && !this.$store.getters.keypairCanSign) {
          this.dialog = !this.dialog
        }
      },

      closeDialog () {
        console.log('closing dialog')
        this.dialog = false
      }
    },

    created () {
      if (this.keypair === null || this.keypair === undefined) {
        this.dialog = true
      }
    },
  }
</script>
