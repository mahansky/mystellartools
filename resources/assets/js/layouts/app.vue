<template>
    <v-app id="example-1" toolbar>
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
                <v-divider></v-divider>

                <v-subheader>ASSETS</v-subheader>
                <v-list-tile disabled>
                    <v-list-tile-action>
                        <v-icon>add_circle_outline</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Issue assets</v-list-tile-title>
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
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="blue" dark fixed>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Interstellar.Tools</v-toolbar-title>
            <v-spacer class="spacer__smaller"></v-spacer>
            <v-select
                    class="account-selector"
                    :items="accounts"
                    v-model="activeAccount"
                    solo
                    autocomplete
            ></v-select>
            <v-spacer class="spacer__smaller"></v-spacer>
            <v-btn icon>
                <v-icon>account_box</v-icon>
            </v-btn>
            <v-btn icon @click="logout">
                <v-icon>exit_to_app</v-icon>
            </v-btn>
        </v-toolbar>
        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>
    </v-app>
</template>

<script>
  export default {
    name: 'app-layout',

    data () {
      return {
        drawer: true,
        accounts: [],
        activeAccount: ''
      }
    },

    created () {
      let pubKey = this.$store.getters.keypair.publicKey()

      this.accounts = [pubKey, {text: 'Become a member to add another accounts', disabled: true}]
      this.activeAccount = pubKey
    },

    methods: {
      logout () {
        this.$store.dispatch('removeKeypair')
        this.$router.push({name: 'welcome'})
      }
    }
  }
</script>
