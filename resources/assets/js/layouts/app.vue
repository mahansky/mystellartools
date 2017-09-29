<template>
    <v-app id="example-1" toolbar>
        <v-navigation-drawer
                persistent
                clipped
                v-model="drawer"
                light
                absolute
                floating
        >
            <v-list>
                <v-list-tile @click="$router.push('balance')">
                    <v-list-tile-action>
                        <v-icon>account_balance_wallet</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Balance</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('payments')">
                    <v-list-tile-action>
                        <v-icon>format_align_left</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Payments</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('send')">
                    <v-list-tile-action>
                        <v-icon>call_made</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Send</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>call_received</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Receive</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>

                <v-subheader>TOKENS</v-subheader>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>add_circle_outline</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Issue tokens</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>settings_ethernet</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage trustlines</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>

                <v-subheader>TOOLS</v-subheader>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>transform</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>All operations</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>settings</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Set options</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('receive')">
                    <v-list-tile-action>
                        <v-icon>dns</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Manage data</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile @click="$router.push('receive')">
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
                v-bind:items="['GD4KEL2QMSDIHEGIT2SOZSRG55GLWIXUFTD5FVNDUX4WPMONWROJLP5R', 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD']"
                solo
                autocomplete
            ></v-select>
            <v-spacer class="spacer__smaller"></v-spacer>
            <v-btn icon>
                <v-icon>account_box</v-icon>
            </v-btn>
            <v-btn icon>
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
      }
    }
  }
</script>
