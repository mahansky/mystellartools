<template>
    <main>
        <v-container>
            <v-layout>
                <v-flex lg12 xl10 offset-xl1>

                    <v-layout row wrap class="intro mb-5">
                        <v-flex lg5 order-xs2 order-lg1 class="text text-xs-center text-sm-left">
                            <div>
                                <div class="display-3 mb-4">Secure and easy to use Stellar Wallet</div>
                                <div>
                                    MyStellar.Tools is a universal tool and wallet that gives users a one-stop web-based application
                                    to take advantage of all the features the Stellar network has to offer.
                                </div>
                                <v-btn class="blue mt-5 mx-0" dark large @click="$router.push({name: 'login'})">WALLET LOGIN</v-btn>
                                <v-btn class="white mt-5 mx-0" large @click="$router.push({name: 'explorer'})">BLOCKCHAIN</v-btn>
                                <v-btn class="white mt-5 mx-0" large @click="$router.push({name: 'explorer.network'})">NETWORK</v-btn>
                            </div>
                        </v-flex>
                        <v-flex lg1 order-lg2 class="hidden-md-and-down"></v-flex>
                        <v-flex lg6 order-xs1 order-lg3 class="image">
                            <img src="/img/laptop.png" alt="MyStellar.Tools Wallet" class="img-fluid hidden-lg-and-up">
                        </v-flex>
                    </v-layout>

                    <v-layout row wrap class="features1">
                        <v-flex lg6 order-xs2 order-lg1 class="image">
                            <img src="/img/features.png" alt="MyStellar.Tools Features" class="img-fluid hidden-lg-and-up mt-4">
                        </v-flex>
                        <v-flex lg1 order-lg2 class="hidden-md-and-down"></v-flex>
                        <v-flex lg5 order-xs1 order-lg3>
                            <div class="blue--text ml-5">WHY SHOULD YOU USE IT?</div>
                            <div class="display-1 my-4 ml-5">Main features</div>
                            <div class="feature">
                                <div class="icon">
                                    <v-icon class="green--text">check_circle</v-icon>
                                </div>
                                <div class="body">
                                    <b>Secure</b>
                                    <p>
                                        It works with Ledger (hardware wallet) <br>
                                        You can also generate transactions without your secret key to sign them offline. <br>
                                        It’s an open source project built with latest technologies. <br>
                                    </p>
                                </div>
                            </div>
                            <div class="feature">
                                <div class="icon">
                                    <v-icon class="green--text">check_circle</v-icon>
                                </div>
                                <div class="body">
                                    <b>Smart</b>
                                    <p>
                                        It does a lot of work behind the scene for you. <br>
                                        For example, you can send XLM to an email address in seconds. <br>
                                    </p>
                                </div>
                            </div>
                            <div class="feature">
                                <div class="icon">
                                    <v-icon class="green--text">check_circle</v-icon>
                                </div>
                                <div class="body">
                                    <b>Multifunctional</b>
                                    <p>
                                        Easily track your payments, operations, manage trustlines, options (inflation destination), and others...
                                    </p>
                                </div>
                            </div>
                        </v-flex>
                    </v-layout>

                </v-flex>
            </v-layout>
        </v-container>

        <div class="features2">
            <v-container>
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>

                        <v-layout row wrap class="my-5 py-5">
                            <v-flex lg5>
                                <div class="blue--text ml-5">WHAT ELSE CAN IT DO?</div>
                                <div class="display-1 my-4 ml-5">Advanced tools</div>
                                <div class="feature">
                                    <div class="icon">
                                        <v-icon class="green--text">check_circle</v-icon>
                                    </div>
                                    <div class="body">
                                        <b>Blockchain explorer</b>
                                        <p>
                                            Explore the Stellar blockchain with ease.
                                        </p>
                                    </div>
                                </div>
                                <div class="feature">
                                    <div class="icon">
                                        <v-icon class="green--text">check_circle</v-icon>
                                    </div>
                                    <div class="body">
                                        <b>Network explorer</b>
                                        <p>
                                            Do you want to know what does the actual network look like? <br>
                                            Head over to our Network explorer and see it for yourself!
                                        </p>
                                    </div>
                                </div>
                                <div class="feature">
                                    <div class="icon">
                                        <v-icon class="green--text">check_circle</v-icon>
                                    </div>
                                    <div class="body">
                                        <b>Transaction signer</b>
                                        <p>
                                            Crossplatform application for signing Stellar transactions
                                        </p>
                                    </div>
                                </div>
                                <div class="feature">
                                    <div class="icon">
                                        <v-icon class="green--text">check_circle</v-icon>
                                    </div>
                                    <div class="body">
                                        <b>Developer friendly</b>
                                        <p>
                                            Shows as much information as there is available and works with custom Stellar networks.
                                        </p>
                                    </div>
                                </div>
                            </v-flex>
                            <v-flex lg1></v-flex>
                            <v-flex lg6 class="image hidden-lg-and-up">
                                <img src="/img/features2.png" alt="MyStellar.Tools Features" class="img-fluid mt-4">
                            </v-flex>
                        </v-layout>

                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <div class="blue lighten-5 text-xs-center py-5">
            <div class="display-1">Want to give it a try?</div>
            <div class="my-3">No registration or secret key required.</div>
            <v-btn class="blue" dark @click="$router.push({name: 'login'})">LOGIN</v-btn>
        </div>

        <footer>
            <v-container>
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>

                        <v-layout wrap row class="py-5">
                            <v-flex md6 xs12>
                                <div class="title">My<span class="blue--text">Stellar</span>.Tools</div>
                            </v-flex>
                            <v-flex md3 xs12>
                                <div class="subheading mb-3">MyStellar.Tools</div>
                                <ul>
                                    <li><router-link :to="{name: 'login'}">Stellar Wallet</router-link></li>
                                    <li><router-link :to="{name: 'explorer'}">Blockchain explorer</router-link></li>
                                    <li><router-link :to="{name: 'explorer.network'}">Network explorer</router-link></li>
                                    <li><router-link :to="{name: 'txsigner'}">Transaction signer</router-link></li>
                                    <li><router-link :to="{name: 'paper'}">Paper wallet</router-link></li>

                                    <li class="mt-3"><router-link :to="{name: 'help'}">Get started</router-link></li>
                                    <li><a href="https://github.com/mahansky/mystellartools" target="_blank" rel="noreferrer nofollow">Source code</a></li>
                                    <li><a href="#" @click.stop="donateDialog = true">Donate</a></li>

                                    <li class="mt-3"><a href="mailto:contact@mystellar.tools">contact@mystellar.tools</a></li>
                                </ul>
                            </v-flex>
                            <v-flex md3 xs12>
                                <div class="subheading mb-3">Useful links</div>
                                <ul>
                                    <li><a href="https://stellar.org" target="_blank" rel="noreferrer nofollow">Stellar.org</a></li>
                                    <li><a href="https://dashboard.stellar.org/" target="_blank" rel="noreferrer nofollow">Stellar Dashboard</a></li>
                                    <li><a href="https://www.stellar.org/laboratory/" target="_blank" rel="noreferrer nofollow">Stellar Laboratory</a></li>
                                    <li><a href="https://galactictalk.org/" target="_blank" rel="noreferrer nofollow">Galactic Talk</a></li>
                                </ul>
                            </v-flex>
                        </v-layout>

                    </v-flex>
                </v-layout>
            </v-container>
        </footer>

        <v-dialog v-model="donateDialog" lazy absolute width="400">
            <v-card>
                <v-card-title>
                    <div class="headline">Donate</div>
                </v-card-title>
                <v-card-text>
                    <p>
                        Enjoying MyStellar.Tools? Feel free to send a donation to this address.
                        Include your name in the memo to be shown on the donators page (wip).
                        Thank you!
                    </p>
                    <code>donate*mystellar.tools</code>
                    <br><br>
                    <code>GD4TEQZTNLLE6QTUZ36BFRW3423SHFFVEICX322U4U7DVRHNU363IGSK</code>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat @click.native="donateDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </main>
</template>

<script>
  import { getQueryParameter } from '~/utils'
  import { Stellar } from '~/stellar'

  export default {
    metaInfo: () => ({
      title: 'Secure and easy to use Stellar Wallet',
    }),

    layout: 'default',

    data: () => ({
      donateDialog: false,
    }),

    created () {
      let publicKey = getQueryParameter('public_key')

      if (publicKey) {
        if (Stellar.StrKey.isValidEd25519PublicKey(publicKey)) {
          let keypair = Stellar.Keypair.fromPublicKey(publicKey)

          this.$store.dispatch('storeKeypair', {keypair})
          this.$router.push({name: 'balance'})
        }
      }
    },
  }
</script>
