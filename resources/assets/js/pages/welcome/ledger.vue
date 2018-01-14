<template>
    <v-dialog v-model="dialog" lazy absolute width="400">
        <a
                slot="activator"
                @mouseover="ledgerActive = true"
                @mouseleave="ledgerActive = false"
                class="grey--text"
        >
            <span>Sign in with</span><br>
            <img
                    src="/img/ledger_logo.png"
                    alt="Ledger"
                    style="opacity: 0.5;"
                    class="pointer"
            >
        </a>

        <v-card>
            <v-card-title>
                <div class="headline">Sign in with Ledger</div>
            </v-card-title>
            <v-card-text>
                <p>
                    Supported on latest browsers.
                    Install the Stellar app from Ledger and enable browser support in the app settings.
                </p>
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
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        class="grey--text"
                        flat
                        @click.native="dialog = false"
                >Close
                </v-btn>
                <v-btn
                        flat
                        :class="{'blue--text': isConnected, 'grey--text': !isConnected}"
                        @click="proceedWithLedger"
                        :loading="loading"
                >Sign in
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
  import StellarLedger from 'stellar-ledger-api'
  import { Stellar, ruleBip32Path } from '~/stellar'
  import { isMobile } from '~/utils'

  export default {
    data: () => ({
      loading: false,
      dialog: false,
      isConnected: false,
      defaultAccount: true,
      error: 'Failed to connect',
      bip32Path: "44'/148'/0'",
      bip32PathRules: [(v) => ruleBip32Path(v)],
    }),

    methods: {
      connectLedger () {
        this.isConnected = false
        this.error = 'Failed to connect'

        new StellarLedger.Api(new StellarLedger.comm(20))
          .connect(() => {
            this.isConnected = true
            this.error = ''
          }, () => {
            setTimeout(this.connectLedger, 2000)
          })
      },

      proceedWithLedger() {
        if (!this.isConnected) {
          return
        }

        this.loading = true

        try {
          new StellarLedger.Api(new StellarLedger.comm(20)).getPublicKey_async(this.bip32Path).then((result) => {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromPublicKey(result['publicKey'])
            })

            this.$store.dispatch('accessWithLedger', {
              bip32Path: this.bip32Path
            })

            this.$router.push({name: 'balance'})
          }).catch(() => {
            this.error = 'Failed to connect'
          }).then(() => {
            this.loading = false
          })
        } catch (err) {
          this.error = 'Failed to connect'
          this.loading = false
        }
      },
    },

    created () {
      if (!isMobile()) {
        this.connectLedger()
      }
    },
  }
</script>