<template>
    <v-card class="white">
        <v-toolbar card color="white" dense>
            <v-toolbar-title class="body-2 grey--text text--darken-2">
                Login using hardware wallet
            </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <img src="/img/ledger_logo.png" alt="Ledger" class="pb-3">

            <ul class="pb-3">
                <li>Supported only on latest browsers</li>
                <li>Install Stellar app using Ledger Manager</li>
                <li>Enable browser support in Stellar app setting</li>
            </ul>

            <v-form v-model="valid" ref="form" @submit.prevent="">
                <v-checkbox
                        label="Use default account"
                        v-model="defaultAccount"
                        color="info"
                        light
                ></v-checkbox>
                <v-text-field
                        v-if="!defaultAccount"
                        label="BIP32 path"
                        v-model="bip32Path"
                        :rules="bip32PathRules"
                ></v-text-field>
                <div
                        class="red--text pt-1"
                        v-html="error"
                        v-if="error"
                ></div>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                    flat
                    :class="{'blue--text': isConnected, 'grey--text': !isConnected}"
                    @click="proceedWithLedger"
                    :loading="loading"
            >Login</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
  import { getAppVersion, getPublicKey } from '~/stellar/ledger'
  import { Stellar, ruleBip32Path } from '~/stellar'
  import { isMobile } from '~/utils'

  export default {
    data: () => ({
      valid: false,
      loading: false,
      isConnected: false,
      defaultAccount: true,
      error: 'Failed to connect',
      bip32Path: "44'/148'/0'",
      bip32PathRules: [(v) => ruleBip32Path(v)],
      ledgerAppVersion: '',
    }),

    methods: {
      connectLedger () {
        this.isConnected = false
        this.error = 'Failed to connect'

        getAppVersion()
          .then(version => {
            this.isConnected = true
            this.error = ''
            this.ledgerAppVersion = version
          })
          .catch(() => {
            this.error = 'Problem with connecting to Ledger'
          })
      },

      proceedWithLedger() {
        if (!this.isConnected || !this.$refs.form.validate()) {
          return
        }

        this.loading = true

          getPublicKey(this.bip32Path).then(publicKey => {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromPublicKey(publicKey)
            })

            this.$store.dispatch('accessWithLedger', {
              bip32Path: this.bip32Path,
              version: this.ledgerAppVersion,
            })

            this.$router.push({name: 'balance'})
          }).catch(() => {
            this.error = 'Failed to connect'
          }).then(() => {
            this.loading = false
          })
      },
    },

    created () {
      if (!isMobile()) {
        this.connectLedger()
      }
    },
  }
</script>