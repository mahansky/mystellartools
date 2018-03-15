<template>
    <v-card>
        <v-tabs dark v-model="active" class="settings-toolbar">
            <v-toolbar style="flex: 0 0 auto;" dark class="blue">
                <v-btn icon @click.native="closeDialog" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Settings</v-toolbar-title>
                <v-tabs-bar class="blue">
                    <v-tabs-item href="#accounts">Accounts</v-tabs-item>
                    <v-tabs-item href="#contacts">Contacts</v-tabs-item>
                    <v-tabs-item href="#options">Transactions</v-tabs-item>
                    <v-tabs-slider class="white"></v-tabs-slider>
                </v-tabs-bar>
            </v-toolbar>
            <v-tabs-items>
                <v-tabs-content id="accounts" key="accounts" lazy>
                    <accounts></accounts>
                </v-tabs-content>
                <v-tabs-content id="contacts" key="contacts">
                    <contacts></contacts>
                </v-tabs-content>
                <v-tabs-content id="options" key="options" lazy>
                    <transactions></transactions>
                </v-tabs-content>
            </v-tabs-items>
        </v-tabs>

        <div style="flex: 1 1 auto;"></div>
    </v-card>
</template>

<script>
  import Accounts from './settings/accounts.vue'
  import Contacts from './settings/contacts.vue'
  import Transactions from './settings/transactions.vue'
  import { events } from '~/utils'

  export default {
    components: {
      Accounts,
      Contacts,
      Transactions,
    },

    data () {
      return {
        active: 'accounts',
      }
    },

    methods: {
      closeDialog () {
        this.$emit('close-dialog')
      },
    },

    created () {
      events.$on('contacts:add-contact', () => {
        this.active = 'contacts'
      })
    }
  }
</script>