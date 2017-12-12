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
                    <v-tabs-slider class="white"></v-tabs-slider>
                </v-tabs-bar>
            </v-toolbar>
            <v-tabs-items>
                <v-tabs-content id="accounts" key="accounts" lazy>
                    <accounts></accounts>
                </v-tabs-content>
                <v-tabs-content id="contacts" key="contacts" lazy>
                    <contacts></contacts>
                </v-tabs-content>
            </v-tabs-items>
        </v-tabs>

        <div style="flex: 1 1 auto;"></div>
    </v-card>
</template>

<script>
  import Accounts from './settings/accounts.vue'
  import Contacts from './settings/contacts.vue'

  export default {
    components: {
      Accounts,
      Contacts,
    },

    data () {
      return {
        active: '',
      }
    },

    methods: {
      closeDialog () {
        this.$emit('close-dialog')
      },
    },
  }
</script>