<template>
    <main class="trustlines">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-card-text>
                            <v-form ref="anchorForm" v-model="anchorFormValid" lazy-validation>
                                <v-layout row>
                                    <v-flex xs10>
                                        <v-text-field
                                                label="Anchor's domain"
                                                v-model="anchorDomain"
                                                :rules="anchorDomainRules"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs2>
                                        <v-btn
                                                flat
                                                icon
                                                class="mt-3"
                                                :class="{'blue--text': anchorFormValid, 'red--text': !anchorFormValid}"
                                                :loading="isSearching"
                                                @click="search">
                                            <v-icon>search</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>

                            <span
                                    v-if="showAnchorResults && anchorResults.length === 0"
                                    class="red--text"
                            >
                                No results found.
                            </span>
                        </v-card-text>
                        <v-expansion-panel
                                v-if="showAnchorResults && anchorResults.length > 0"
                                class="anchor-results"
                                expand
                        >
                            <v-expansion-panel-content v-for="currency in anchorResults" :key="currency.code">
                                <div slot="header">
                                    <v-avatar class="grey lighten-4 mr-3" size="18px" v-if="currency.image">
                                        <img :src="currency.image" :alt="currency.code">
                                    </v-avatar>
                                    <span v-text="currency.code.toUpperCase()"></span>
                                </div>
                                <v-card>
                                    <v-card-text class="grey lighten-4">
                                        <table class="anchor-result">
                                            <tr>
                                                <td><b>Code</b></td>
                                                <td v-text="currency.code"></td>
                                            </tr>
                                            <tr>
                                                <td><b>Issuer</b></td>
                                                <td v-text="currency.issuer"></td>
                                            </tr>
                                            <tr v-if="currency.name">
                                                <td><b>Name</b></td>
                                                <td v-text="currency.name"></td>
                                            </tr>
                                            <tr v-if="currency.description">
                                                <td><b>Description</b></td>
                                                <td v-text="currency.description"></td>
                                            </tr>
                                            <tr v-if="currency.condition">
                                                <td><b>Condition</b></td>
                                                <td v-text="currency.condition"></td>
                                            </tr>
                                            <tr v-if="currency.display_decimals">
                                                <td><b>Decimals</b></td>
                                                <td v-text="currency.display_decimals"></td>
                                            </tr>
                                            <tr v-if="currency.image">
                                                <td><b>Image</b></td>
                                                <td>
                                                    <v-avatar class="grey lighten-4 mr-3" size="64px" tiled v-if="currency.image">
                                                        <img :src="currency.image" :alt="currency.code">
                                                    </v-avatar>
                                                </td>
                                            </tr>
                                        </table>

                                        <v-layout row>
                                            <v-spacer></v-spacer>
                                            <v-btn info @click="add(currency)" :loading="currency.loading">Add</v-btn>
                                        </v-layout>
                                    </v-card-text>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-card>
                </v-flex>

                <v-flex lg6>
                    <v-expansion-panel expand>
                        <v-expansion-panel-content v-model="trustlineFormShown">
                            <div slot="header">
                                Change trust
                            </div>
                            <v-card>
                                <v-card-text>
                                    <v-form ref="trustlineForm" v-model="trustlineFormValid">
                                        <v-text-field
                                                label="Asset code"
                                                v-model="assetCode"
                                                :rules="assetCodeRules"
                                        ></v-text-field>
                                        <v-text-field
                                                label="Asset issuer"
                                                v-model="assetIssuer"
                                                :rules="assetIssuerRules"
                                        ></v-text-field>
                                        <v-text-field
                                                label="Limit"
                                                v-model="assetLimit"
                                                :rules="assetLimitRules"
                                        ></v-text-field>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            flat
                                            :class="{'blue--text': trustlineFormValid, 'red--text': !trustlineFormValid}"
                                            @click="update"
                                            :loading="isTrustlineLoading"
                                    >
                                        Update
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-expansion-panel-content>
                        <v-expansion-panel-content>
                            <div slot="header">
                                Allow trust
                            </div>
                            <v-card>
                                <v-card-text>
                                    <v-form ref="allowForm" v-model="allowFormValid">
                                        <v-text-field
                                                label="Asset code"
                                                v-model="allowAssetCode"
                                                :rules="allowAssetCodeRules"
                                        ></v-text-field>
                                        <v-text-field
                                                label="Trustor Account ID"
                                                v-model="allowTrustor"
                                                :rules="allowTrustorRules"
                                        ></v-text-field>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="allowAuthorized"
                                        >
                                            <div slot="label">
                                                Authorized
                                            </div>
                                        </v-checkbox>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                            flat
                                            :class="{'blue--text': allowFormValid, 'red--text': !allowFormValid}"
                                            @click="allow"
                                            :loading="isAllowLoading"
                                    >
                                        Update
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-flex>
            </v-layout>

            <v-layout v-if="trustlines.length > 0">
                <v-flex xs12>
                    <div class="subheader">Trustlines</div>

                    <v-data-table
                            :headers="headers"
                            :items="trustlines"
                            hide-actions
                            class="elevation-1"
                    >
                        <template slot="items" scope="props">
                            <td v-text="props.item.asset_code"></td>
                            <td v-text="props.item.asset_issuer"></td>
                            <td v-text="props.item.limit"></td>
                            <td class="text-xs-right">
                                <span class="table-row-detail">
                                    <a href="#" @click.prevent="edit(props.item)" class="mr-3">Edit</a>
                                    <a href="#" @click.prevent="remove(props.item)" class="red--text">Delete</a>
                                </span>
                            </td>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { Stellar, StellarServer, ruleAccountIsValid } from '../../stellar'
  import { Asset, TransactionBuilder, Operation } from 'stellar-sdk'
  import axios from 'axios'
  import { flash } from '../../utils'

  export default {
    data () {
      return {
        headers: [
          { text: 'Asset code', value: 'asset_code', align: 'left' },
          { text: 'Issuer', value: 'asset_issuer', align: 'left' },
          { text: 'Limit', value: 'limit', align: 'left' },
          { text: '', value: '', align: 'right' },
        ],
        balances: [],

        allowFormValid: false,
        isAllowLoading: false,
        allowAssetCode: '',
        allowAssetCodeRules: [(v) => (v.length > 0 && v.length <= 12) || 'Maximum is 12 characters'],
        allowTrustor: '',
        allowTrustorRules: [(v) => ruleAccountIsValid(v, false)],
        allowAuthorized: false,

        trustlineFormShown: false,
        trustlineFormValid: false,
        assetCode: '',
        assetCodeRules: [(v) => (v.length > 0 && v.length <= 12) || 'Maximum is 12 characters'],
        assetIssuer: '',
        assetIssuerRules: [(v) => ruleAccountIsValid(v, false)],
        assetLimit: '',
        assetLimitRules: [(v) => v >= 0 || 'Must be equal or greater than 0'],
        isTrustlineLoading: false,

        anchorFormValid: false,
        showAnchorResults: false,
        anchorResults: [],
        isSearching: false,
        anchorDomain: '',
        anchorDomainRules: [(v) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(v) || 'Invalid domain'],
      }
    },

    computed: {
      trustlines () {
        return _.filter(this.balances, function (asset) {
          return asset.asset_type !== 'native'
        })
      }
    },

    methods: {
      search () {
        if (this.$refs.anchorForm.validate()) {
          this.isSearching = true

          Stellar.StellarTomlResolver.resolve(this.anchorDomain)
            .then(toml => {
              this.anchorResults = toml.CURRENCIES
            })
            .catch(err => {
              this.anchorResults = []
            })
            .then(() => {
              this.isSearching = false
              this.showAnchorResults = true
            })
        }
      },

      add (currency) {
        currency.loading = true

        this.$forceUpdate()

        this.submitTx(currency.code, currency.issuer)
          .then(() => {
            currency.loading = false

            this.$forceUpdate()
          })
      },

      update () {
        if (this.$refs.trustlineForm.validate()) {
          this.isTrustlineLoading = true

          if (!this.assetLimit && this.assetLimit !== 0) {
            this.submitTx(this.assetCode, this.assetIssuer)
              .then(() => {
                this.isTrustlineLoading = false
              })
          } else {
            this.submitTx(this.assetCode, this.assetIssuer, this.assetLimit)
              .then(() => {
                this.isTrustlineLoading = false
              })
          }
        }
      },

      submitTx (code, issuer, limit) {
        let vm = this
        let asset = new Asset(code, issuer)

        return StellarServer.loadAccount(vm.$store.getters.keypair.publicKey())
          .then(account => {
            let attr = { asset }

            if (limit !== undefined) {
              attr.limit = limit
            }

            let transaction = new TransactionBuilder(account)
              .addOperation(Operation.changeTrust(attr))
              .build()

            transaction.sign(vm.$store.getters.keypair)

            return StellarServer.submitTransaction(transaction)
          })
          .then(() => {
            flash(vm.$store, 'Trustline updated', 'success')

            return vm.fetchData()
          })
          .catch((err) => {
            flash(vm.$store, err, 'error')
          })
      },

      fetchData () {
        return StellarServer.loadAccount(this.$store.getters.keypair.publicKey())
          .then(account => {
            this.balances = account.balances
          })
      },

      edit (asset) {
        this.assetCode = asset.asset_code
        this.assetIssuer = asset.asset_issuer
        this.assetLimit = asset.limit

        window.scrollTo(0, 0)

        if (!this.trustlineFormShown) {
          this.trustlineFormShown = true
        }
      },

      remove (asset) {
        this.submitTx (asset.asset_code, asset.asset_issuer, '0')
      },

      allow () {
        this.isAllowLoading = true

        let vm = this

        StellarServer.loadAccount(vm.$store.getters.keypair.publicKey())
          .then(account => {
            let transaction = new TransactionBuilder(account)
              .addOperation(Operation.allowTrust({
                trustor: vm.allowTrustor,
                assetCode: vm.allowAssetCode,
                authorize: vm.allowAuthorized,
              }))
              .build()

            transaction.sign(vm.$store.getters.keypair)

            return StellarServer.submitTransaction(transaction)
          })
          .then(() => {
            flash(vm.$store, 'Trust updated', 'success')

            return vm.fetchData()
          })
          .catch((err) => {
            flash(vm.$store, err, 'error')
          })
          .then(() => {
            this.isAllowLoading = true
          })
      }
    },

    created () {
      this.fetchData()
    }
  }
</script>