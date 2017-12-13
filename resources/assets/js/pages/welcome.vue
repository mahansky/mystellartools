<template>
    <main>
        <div class="pattern">
            <v-container class="rocket">
                <v-layout row wrap>
                    <v-flex xs12 md6 offset-md3>
                        <v-form v-model="valid" ref="form" class="mt-4 pt-4" lazy-validation>
                            <v-text-field
                                    label="Stellar Public or Private Key"
                                    v-model="key"
                                    :rules="keyRules"
                                    required
                            ></v-text-field>

                            <v-layout class="text-xs-center">
                                <v-flex>
                                    <v-btn dark @click="enter" :class="{ blue: valid, '': !valid }">enter</v-btn>
                                    or
                                    <a href="#" @click.prevent.stop="createDialog = true">create new Stellar account</a>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-flex>
                    <v-flex xs12 md6 offset-md3>
                        <div class="mt-5 mb-4 pb-4">
                            <div class="text-xs-center">
                                <a @click.stop="ledgerDialog = true"
                                   class="grey--text"
                                   @mouseover="ledgerActive = true"
                                   @mouseleave="ledgerActive = false"
                                >
                                    <span>Sign in with</span><br>
                                    <img src="/img/ledger_logo.png"
                                         alt="Ledger"
                                         style="opacity: 0.5;"
                                         class="pointer"
                                    >
                                </a>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <div class="white py-5">
            <v-container grid-list-lg>
                <v-layout class="mb-3">
                    <v-flex>
                        <div class="headline">Features</div>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">language</v-icon>
                            Account explorer
                        </div>
                        <p>
                            You can view all information about every account on the network just by entering it's public key.</p>
                    </v-flex>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">transform</v-icon>
                            Payments
                        </div>
                        <p>Send, receive, view all the payments. <b>Send XLM to any email address</b>
                            with option to stop the operation.</p>
                    </v-flex>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">label_outline</v-icon>
                            Federation service
                        </div>
                        <p>Multiple federation addresses with *mystellar.tools suffix.</p>
                    </v-flex>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">settings_ethernet</v-icon>
                            Trustlines
                        </div>
                        <p>Manage your trustlines with easy-to-use interface. Find anchors using it's domain name.</p>
                    </v-flex>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">save</v-icon>
                            Browser based
                        </div>
                        <p>Everything is stored in the browser (possible to store encrypted keys). Share the data with another browser (ex. smartphone) using simple link.</p>
                    </v-flex>
                    <v-flex md4>
                        <div class="title mb-3">
                            <v-icon class="blue--text">settings</v-icon>
                            Advanced options
                        </div>
                        <p>MyStellar.Tools covers almost every operation you can do on Stellar network.</p>
                    </v-flex>
                </v-layout>

                <v-divider class="my-5"></v-divider>

                <v-layout row wrap>
                    <v-flex lg6>
                        <div class="headline mb-3">Plans</div>
                        <p>Here is a list of planned features:</p>
                        <ul>
                            <li>Paper Wallet generator</li>
                            <li>Stellar Distributed Exchange trading tools</li>
                            <li>Stellar Network explorer</li>
                            <li>Multi-sig coordinator</li>
                            <li>Improve existing features</li>
                        </ul>
                    </v-flex>
                    <v-flex lg6>
                        <div class="headline mb-3">About</div>
                        <p>
                            This project started as an entry for Stellar Build Challenge (November 2017).
                            Main goal of MyStellar.Tools is to create a single place where you can do pretty much everything
                            Stellar network has to offer. From simply sending assets through managing trustlines to trading on SDX.
                        </p>
                        <p>
                            MyStellar.Tools is still in development.
                            We are constantly working on new features.
                            If you have any idea/tip/suggestion, don't hesitate to contact us.
                        </p>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <footer class="grey darken-4">
            <v-container grid-list-lg>
                <v-layout wrap row class="py-5">
                    <v-flex lg4 xs12>
                        <div class="headline">My<span class="blue--text">Stellar</span>.Tools</div>
                    </v-flex>
                    <v-flex lg4 xs12>
                        <div class="subheading mb-3">MyStellar.Tools</div>
                        <ul>
                            <li>
                                <router-link :to="{name: 'help'}">Get started</router-link>
                            </li>
                            <li class="mt-3"><a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a></li>
                        </ul>
                    </v-flex>
                    <v-flex lg4 xs12>
                        <div class="subheading mb-3">Useful links</div>
                        <ul>
                            <li><a href="https://stellar.org" target="_blank" rel="noreferrer nofollow">Stellar.org</a></li>
                            <li><a href="https://dashboard.stellar.org/" target="_blank" rel="noreferrer nofollow">Stellar Dashboard</a></li>
                            <li><a href="https://www.stellar.org/laboratory/" target="_blank" rel="noreferrer nofollow">Stellar Laboratory</a></li>
                            <li><a href="https://galactictalk.org/" target="_blank" rel="noreferrer nofollow">Galactic Talk</a></li>
                        </ul>
                    </v-flex>
                </v-layout>
            </v-container>
        </footer>

        <v-dialog v-model="createDialog" lazy absolute width="400">
            <v-card>
                <v-card-title>
                    <div class="headline">Create new Stellar account</div>
                </v-card-title>
                <v-card-text>
                    <div>Public key</div>
                    <code v-text="newKeypair.publicKey()"></code>

                    <div class="mt-2">Secret key</div>
                    <code v-text="newKeypair.secret()"></code>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon flat @click="createNewKeypair">
                        <v-icon>autorenew</v-icon>
                    </v-btn>
                    <v-btn class="blue--text" flat @click.native="createDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="ledgerDialog" lazy absolute width="400">
            <v-card>
                <v-card-title>
                    <div class="headline">Sign in with Ledger</div>
                </v-card-title>
                <v-card-text>
                    <p>
                        Available on Chrome and Opera.
                        Install the Stellar app from Ledger and enable browser support in the app settings.
                    </p>
                    <v-checkbox label="Use default account" v-model="ledgerDefaultAccount" light color="info"></v-checkbox>
                    <v-text-field
                            v-if="!ledgerDefaultAccount"
                            label="BIP32 path"
                            v-model="ledgerBip32Path"
                    ></v-text-field>
                    <div class="red--text pt-1" v-html="ledgerError ? ledgerError : '&nbsp;'"></div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            class="grey--text"
                            flat
                            @click.native="ledgerDialog = false"
                    >Close</v-btn>
                    <v-btn
                            flat
                            :class="{'blue--text': isLedgerConnected, 'grey--text': !isLedgerConnected}"
                            @click="proceedWithLedger"
                    >Sign in</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </main>
</template>

<script>
  import { mapGetters } from 'vuex'
  import * as utils from '../utils'
  import StellarLedger from 'stellar-ledger-api'

  let Stellar = require('stellar-sdk')

  export default {
    metaInfo: () => ({
      title: 'Stellar Wallet and Tools to operate with Stellar network',
    }),

    layout: 'default',

    computed: {
      hasKeypair () {
        return !!this.$store.keypair
      },

      isLedgerConnected () {
        return this.ledgerStatus === 'Connected'
      },
    },

    data: () => ({
      title: 'MyStellar.Tools',
      valid: false,
      key: '',
      keyRules: [
        (v) => !!v || 'Key is required',
        (v) => {
          let secret = v[0] === 'S'

          try {
            if (secret) {
              Stellar.Keypair.fromSecret(v)
            } else {
              Stellar.Keypair.fromPublicKey(v)
            }
          } catch (e) {
            return 'Invalid key'
          }

          return true
        }
      ],
      createDialog: false,
      newKeypair: Stellar.Keypair.random(),

      ledgerDialog: false,
      ledgerError: 'Failed to connect',
      ledgerStatus: '',
      ledgerDefaultAccount: true,
      ledgerBip32Path: "44'/148'/0'",
    }),

    methods: {
      enter () {
        if (this.$refs.form.validate()) {
          let secret = this.key[0] === 'S'
          let keypair = null

          if (secret) {
            keypair = Stellar.Keypair.fromSecret(this.key)
          } else {
            keypair = Stellar.Keypair.fromPublicKey(this.key)
          }

          this.$store.dispatch('storeKeypair', {keypair})
          this.$router.push('balance')
        }
      },

      createNewKeypair () {
        this.newKeypair = Stellar.Keypair.random()
      },

      connectLedger () {
        this.ledgerStatus = 'Not connected'

        new StellarLedger.Api(new StellarLedger.comm(20))
          .connect(() => {
            this.ledgerStatus = 'Connected'
          }, (err) => {
            this.ledgerStatus = 'Error: ' + err
            this.ledgerError = 'Error: ' + err
          })
      },

      proceedWithLedger() {
        try {
          new StellarLedger.Api(new StellarLedger.comm(20)).getPublicKey_async(this.bip32Path).then((result) => {
            this.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey(result['publicKey'])})
            this.$store.dispatch('accessWithLedger', {bip32Path: this.bip32Path})
            this.$router.push({name: 'balance'})
          }).catch(() => {
            this.ledgerError = 'Failed to connect'
          });
        } catch (err) {
          this.ledgerError = 'Failed to connect'
        }
      },
    },

    created () {
      let publicKey = utils.getQueryParameter('public_key')

      if (publicKey) {
        try {
          let keypair = Stellar.Keypair.fromPublicKey(publicKey)

          this.$store.dispatch('storeKeypair', {keypair})
          this.$router.push('balance')
        } catch (e) {}
      }

      this.connectLedger()
    },
  }
</script>
