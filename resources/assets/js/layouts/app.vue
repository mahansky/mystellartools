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
            <v-toolbar-title>Interstellar.Tools</v-toolbar-title>
            <v-spacer></v-spacer>
            <div class="selected-account">
                <span class="key ml-3" v-text="activeAccount"></span>
                <v-btn v-if="unlocked" dark icon v-tooltip:bottom="{ html: 'Unlocked with secret' }">
                    <v-icon>lock_open</v-icon>
                </v-btn>
                <v-btn v-else dark icon v-tooltip:bottom="{ html: 'Click to unlock' }" @click.stop="dialog = !dialog">
                    <v-icon>lock_outline</v-icon>
                </v-btn>
            </div>
            <v-btn icon @click.stop="openDialog">
                <v-icon>settings</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="logout">
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
                :overlay=false
                scrollable
        >
            <settings @close-dialog="dialog = !dialog"></settings>
        </v-dialog>
    </v-app>
</template>

<script>
  import Settings from './app/settings.vue'

  export default {
    name: 'app-layout',

    components: {
      Settings,
    },

    data () {
      return {
        drawer: true,
        dialog: false,
      }
    },

    computed: {
      unlocked () {
        return this.$store.getters.keypairCanSign
      },

      activeAccount () {
        return this.$store.getters.keypair.publicKey()
      },
    },

    methods: {
      logout () {
        this.$store.dispatch('removeKeypair')
        this.$router.push({name: 'welcome'})
      },

      openDialog () {
        this.dialog = true
      },
    }
  }
</script>
