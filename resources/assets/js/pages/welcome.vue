<template>
    <main>
        <div class="pattern">
            <v-container class="rocket">
                <v-layout row wrap>
                    <v-flex xs12 md6 offset-md3>
                        <key></key>
                    </v-flex>
                    <v-flex xs12 md6 offset-md3>
                        <div class="mt-5 mb-4 pb-4">
                            <div class="text-xs-center">
                                <ledger></ledger>
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
                        <p>Everything is stored in the browser (possible to store encrypted keys).</p>
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
                            <li>Stellar network explorer</li>
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

        <create></create>
    </main>
</template>

<script>
  import * as utils from '../utils'
  import { Stellar } from '~/stellar'

  import Ledger from './welcome/ledger.vue'
  import Key from './welcome/key.vue'
  import Create from './welcome/create.vue'

  export default {
    metaInfo: () => ({
      title: 'Stellar Wallet and Tools to operate with Stellar network',
    }),

    layout: 'default',

    components: {
      Ledger,
      Key,
      Create,
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
    },
  }
</script>
