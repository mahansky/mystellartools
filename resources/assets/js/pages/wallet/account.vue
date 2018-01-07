<template>
    <main class="account">
        <v-btn flat loading info v-if="!account"></v-btn>

        <v-container grid-list-lg v-if="account">
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white account-card">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">Account</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <div class="datablock">
                                <div class="name">Account ID</div>
                                <public-key :value="account.id"></public-key>
                            </div>

                            <div class="datablock">
                                <div class="name">Sequence number</div>
                                <span v-text="account.sequence"></span>
                            </div>

                            <div class="datablock">
                                <div class="name">Number of subentries</div>
                                <span v-text="account.subentry_count"></span>
                            </div>

                            <div class="datablock" v-if="account.inflation_destination">
                                <div class="name">Inflation destination</div>
                                <public-key :value="account.inflation_destination"></public-key>
                            </div>

                            <div class="datablock" v-if="account.home_domain">
                                <div class="name">Home domain</div>
                                <span v-text="account.home_domain"></span>
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="datablock">
                                <div class="name">Thresholds</div>
                            </div>

                            <div class="datablock">
                                <table>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption">LOW</span></td>
                                        <td><span v-text="account.thresholds.low_threshold"></span></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption">MEDIUM</span></td>
                                        <td><span v-text="account.thresholds.med_threshold"></span></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption">HIGH</span></td>
                                        <td><span v-text="account.thresholds.high_threshold"></span></td>
                                    </tr>
                                </table>
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="datablock">
                                <div class="name">Flags</div>
                            </div>

                            <div class="datablock">
                                <table>
                                    <tr v-if="account.flags.auth_required !== undefined">
                                        <td><span class="grey--text text--darken-1 caption pr-2">AUTH_REQUIRED</span>
                                        </td>
                                        <td><span v-text="account.flags.auth_required.toString().toUpperCase()"></span>
                                        </td>
                                    </tr>
                                    <tr v-if="account.flags.auth_revocable !== undefined">
                                        <td><span class="grey--text text--darken-1 caption pr-2">AUTH_REVOCABLE</span>
                                        </td>
                                        <td><span v-text="account.flags.auth_revocable.toString().toUpperCase()"></span>
                                        </td>
                                    </tr>
                                    <tr v-if="account.flags.auth_immutable !== undefined">
                                        <td><span class="grey--text text--darken-1 caption pr-2">AUTH_IMMUTABLE</span>
                                        </td>
                                        <td><span v-text="account.flags.auth_immutable.toString().toUpperCase()"></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="datablock">
                                <div class="name">Balances</div>
                            </div>

                            <div class="datablock" v-for="asset in account.balances">
                                <table class="fluid">
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Balance</span></td>
                                        <td><amount :amount="asset.balance"></amount></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Type</span></td>
                                        <td><span v-text="asset.asset_type"></span></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Code</span></td>
                                        <td><span
                                                v-text="asset.asset_type === 'native' ? 'XLM' : asset.asset_code"></span>
                                        </td>
                                    </tr>
                                    <tr v-if="asset.asset_issuer">
                                        <td><span class="grey--text text--darken-1 caption pr-2">Issuer</span></td>
                                        <td><pubic-key :value="asset.asset_issuer"></pubic-key></td>
                                    </tr>
                                    <tr v-if="asset.asset_limit">
                                        <td><span class="grey--text text--darken-1 caption pr-2">Limit</span></td>
                                        <td><span v-text="asset.asset_limit"></span></td>
                                    </tr>
                                </table>
                            </div>
                        </v-card-text>
                        <v-divider></v-divider>
                        <v-card-text>
                            <div class="datablock">
                                <div class="name">Signers</div>
                            </div>

                            <div class="datablock" v-for="signer in account.signers">
                                <table class="fluid">
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Public key</span></td>
                                        <td><public-key :value="signer.public_key"></public-key></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Type</span></td>
                                        <td><span v-text="signer.type"></span></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Key</span></td>
                                        <td><span v-text="signer.key"></span></td>
                                    </tr>
                                    <tr>
                                        <td><span class="grey--text text--darken-1 caption pr-2">Weight</span></td>
                                        <td><span v-text="signer.weight"></span></td>
                                    </tr>
                                </table>
                            </div>
                        </v-card-text>
                        <template v-if="Object.keys(account.data_attr).length > 0">
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="datablock">
                                    <div class="name">Data</div>
                                </div>

                                <div class="datablock" v-for="(value, key) in account.data_attr">
                                    <table class="fluid">
                                        <tr>
                                            <td><span class="grey--text text--darken-1 caption pr-2">Key</span></td>
                                            <td><span v-text="key"></span></td>
                                        </tr>
                                        <tr>
                                            <td><span class="grey--text text--darken-1 caption pr-2">Value</span></td>
                                            <td>
                                                <span v-text="decode(value)"></span>
                                                <span class="grey--text pl-3" v-text="value"></span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </v-card-text>
                        </template>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Stellar address lookup
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-btn loading flat info v-if="stellarAddressLoading"></v-btn>
                            <template v-else>
                                <div class="datablock" v-if="stellarAddresses.length === 0">
                                    You don't have a Stellar address on our servers.
                                    <router-link :to="{name: 'receive'}">Setup</router-link>
                                </div>
                                <div class="datablock" v-else>
                                    <div class="name">Our federation server</div>
                                    <div v-for="stellarAddress in stellarAddresses" v-text="stellarAddress"></div>
                                </div>
                            </template>

                            <v-btn loading flat info v-if="homeDomainStellarAddressLoading"></v-btn>
                            <div v-else class="datablock" v-if="homeDomainStellarAddress">
                                <div class="name">Your home domain's federation server</div>
                                <span v-text="homeDomainStellarAddress"></span>
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card class="white mt-3">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">Minimal balance</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <p>
                                All Stellar accounts must maintain a minimum balance of lumens.
                                Any transaction that would reduce an account’s balance to less than the minimum will be rejected.
                            </p>

                            <div class="datablock">
                                <div class="name">Minimal account balance</div>
                                <span v-text="minimalBalance + ' XLM'"></span>
                            </div>
                        </v-card-text>
                    </v-card>

                    <v-card class="white mt-3">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">Horizon links</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <div class="datablock">
                                <a :href="account._links.self.href" target="_blank"
                                   rel="noreferrer nofollow">Account</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.transactions.href)" target="_blank"
                                   rel="noreferrer nofollow">Transactions</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.operations.href)" target="_blank"
                                   rel="noreferrer nofollow">Operations</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.payments.href)" target="_blank" rel="noreferrer nofollow">Payments</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.effects.href)" target="_blank" rel="noreferrer nofollow">Effects</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.offers.href)" target="_blank" rel="noreferrer nofollow">Offers</a>
                            </div>
                            <div class="datablock">
                                <a :href="link(account._links.trades.href)" target="_blank" rel="noreferrer nofollow">Trades</a>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer } from '../../stellar'
  import axios from 'axios'
  import { flash } from '../../utils'

  export default {
    metaInfo: () => ({
      title: 'Account',
    }),

    data () {
      return {
        stellarAddressLoading: true,
        stellarAddresses: [],
        homeDomainStellarAddressLoading: true,
        homeDomainStellarAddress: '',
        account: null,
      }
    },

    created () {
      StellarServer.loadAccount(this.$store.getters.keypair.publicKey())
        .then(account => {
          let promises = []

          this.account = account

          if (account.home_domain) {
            promises.push(Stellar.StellarTomlResolver.resolve(account.home_domain)
              .then(toml => {
                return axios.get(toml.FEDERATION_SERVER, {
                  params: {
                    q: account.id,
                    type: 'id',
                  },
                }).then(response => {
                  this.homeDomainStellarAddress = response.data.stellar_address
                }).catch(() => {
                  this.homeDomainStellarAddress = ''
                }).then(() => {
                  this.homeDomainStellarAddressLoading = false
                })
              })
              .catch(err => {
                this.homeDomainStellarAddress = ''
              })
              .then(() => {
                this.homeDomainStellarAddressLoading = false
              }))
          } else {
            this.homeDomainStellarAddressLoading = false
          }

          promises.push(axios.get('/api/federation', {
            params: {
              q: account.id,
              type: 'id',
            },
          }).then(response => {
            this.stellarAddresses = response.data.all
          }).catch(err => {
            this.stellarAddresses = []
          }).then(() => {
            this.stellarAddressLoading = false
          }))

          return Promise.all(promises)
        })
        .catch(() => {
          flash('Unable to load data', 'error')
        })
    },

    methods: {
      decode (value) {
        return window.atob(value)
      },

      link (link) {
        return link.split('{')[0]
      },
    },

    computed: {
      minimalBalance () {
        return (2 + this.account.subentry_count) * 10
      },
    },
  }
</script>