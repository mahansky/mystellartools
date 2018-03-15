<template>
    <main class="setoptions">
        <v-btn info loading flat v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-else>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Set Options
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="valid" ref="form">
                                <b>Thresholds</b>
                                <v-text-field
                                        label="Master weight"
                                        hint="0 - 255"
                                        v-model="masterWeight"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Low threshold"
                                        hint="0 - 255"
                                        v-model="lowThreshold"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Medium threshold"
                                        hint="0 - 255"
                                        v-model="medThreshold"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="High threshold"
                                        hint="0 - 255"
                                        v-model="highThreshold"
                                        :rules="weightRules"
                                ></v-text-field>

                                <v-layout row wrap>
                                    <v-flex lg12>
                                        <b>Flags</b>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="flags.required"
                                        >
                                            <div slot="label">
                                                Authorization required
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="flags.revocable"
                                        >
                                            <div slot="label">
                                                Authorization revocable
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="flags.immutable"
                                        >
                                            <div slot="label">
                                                Authorization immutable
                                            </div>
                                        </v-checkbox>
                                    </v-flex>
                                </v-layout>

                                <b>Signers</b>

                                <v-layout row wrap v-for="signer in account.signers" :key="signer.key" class="break-all">
                                    <v-flex xs10>
                                        <span v-text="signer.public_key"></span>
                                    </v-flex>
                                    <v-flex xs2>
                                        Weight: <span v-text="signer.weight"></span>
                                    </v-flex>
                                </v-layout>

                                <v-select
                                        label="Signer type"
                                        :items="signerTypes"
                                        v-model="signerType"
                                        clearable
                                ></v-select>
                                <v-text-field
                                        v-if="signerType"
                                        :label="signerLabel"
                                        v-model="signer"
                                        :rules="signerRules"
                                ></v-text-field>
                                <v-text-field
                                        v-if="signerType"
                                        label="Weight"
                                        hint="0 - 255"
                                        v-model="signerWeight"
                                        :rules="weightRules"
                                ></v-text-field>

                                <b>Others</b>
                                <v-text-field
                                        label="Inflation destination"
                                        v-model="inflationDest"
                                        :rules="accountRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Home domain"
                                        v-model="homeDomain"
                                        :rules="domainRules"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                                    @click="setOptions"
                                    :loading="isLoading"
                            >
                                Set
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Thresholds</b>
                    <p>
                        Operations have varying levels of access.
                        This field specifies thresholds for low-, medium-, and high-access levels, as well as the weight of the master key.
                        For more info, see <a href="https://www.stellar.org/developers/guides/concepts/multi-sig.html"
                                              target="_blank" rel="noreferrer nofollow">multi-sig</a>.
                    </p>

                    <b>Flags</b>
                    <ul class="mb-3">
                        <li><u>Authorization required</u>: Requires the issuing account to give other accounts permission before they can hold the issuing account’s credit.
                        </li>
                        <li><u>Authorization revocable</u>: Allows the issuing account to revoke its credit held by other accounts.
                        </li>
                        <li><u>Authorization immutable</u>: If this is set then none of the authorization flags can be set and the account can never be deleted.
                        </li>
                    </ul>

                    <b>Signers</b>
                    <p>
                        Used for multi-sig.
                        This field lists other public keys and their weights, which can be used to authorize transactions for this account.
                    </p>
                    <p>
                        Signer will be removed from account if this weight is 0.
                        You can use this form to add/remove or adjust weight of an additional signer on the account.
                    </p>

                    <b>Inflation destination</b>
                    <p>Account designated to receive inflation.</p>

                    <b>Home domain</b>
                    <p>
                        A domain name that can optionally be added to the account.
                        Clients can look up a stellar.toml from this domain.
                    </p>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { ruleAccountIsValid, resolveAccountId, Stellar, StellarServer } from '~/stellar'
  import { flash } from '~/utils'
  import { submitTransaction } from '~/stellar/internal'
  import isString from 'lodash'

  const xdr = require('stellar-base').xdr

  export default {
    metaInfo: () => ({
      title: 'Set Options',
    }),

    data () {
      return {
        loaded: false,
        isLoading: false,
        valid: false,

        masterWeight: '',
        lowThreshold: '',
        medThreshold: '',
        highThreshold: '',

        flags: {
          required: false,
          revocable: false,
          immutable: false,
        },

        signerType: '',
        signerTypes: [
          {
            value: 'ed25519',
            text: 'Ed25519 Public key',
          },
          {
            value: 'sha256',
            text: 'SHA256 hash',
          },
          {
            value: 'txhash',
            text: 'Pre-authorized transaction hash',
          },
        ],
        signer: '',
        signerLabel: '',
        signerWeight: '',

        inflationDest: '',
        homeDomain: '',

        weightRules: [(v) => {
          return ((v) >= 0 && (v) <= 255)
            || 'Expected an integer between 0 and 255 (inclusive)'
        }],
        accountRules: [(v) => !!v ? ruleAccountIsValid(v) : true],
        domainRules: [(v) => !!v ? (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(v) || 'Invalid domain') : true],
        signerRules: [(v) => {
          let temp

          try {
            switch (this.signerType) {
              case 'ed25519':
                if (!Stellar.StrKey.isValidEd25519PublicKey(v)) {
                  throw 'error'
                }

                break

              case 'txhash':
                if (isString(v)) {
                  temp = new Buffer.from(v, 'hex')
                }

                if (!(Buffer.isBuffer(temp) && temp.length === 32)) {
                  throw 'error'
                }

                break

              case 'sha256':
                if (isString(v)) {
                  temp = Buffer.from(v, 'hex')
                }

                if (!(Buffer.isBuffer(temp) && temp.length === 32)) {
                  throw 'error'
                }

                break
            }
          } catch (e) {
            return 'Invalid input'
          }

          return true
        }],
      }
    },

    watch: {
      signerType (value) {
        if (value === 'ed25519') {
          this.signerLabel = 'Signer\'s public key or federation address'
        }

        if (value === 'txhash') {
          this.signerLabel = '32-byte hash in hexadecimal format (64 characters)'
        }

        if (value === 'sha256') {
          this.signerLabel = '32-byte hash in hexadecimal format (64 characters)'
        }
      }
    },

    methods: {
      setOptions () {
        if (this.$refs.form.validate()) {
          this.isLoading = true

          let promises = []
          let signerPublicKey, inflationPublicKey

          if (this.signerType === 'ed25519') {
            promises.push(resolveAccountId(this.signer).then(({account_id}) => {
              signerPublicKey = account_id
            }))
          }

          if (this.inflationDest) {
            promises.push(resolveAccountId(this.inflationDest).then(({account_id}) => {
              inflationPublicKey = account_id
            }))
          }

          Promise.all(promises).then(() => {
            let attributes = {}

            if (this.masterWeight)
              attributes.masterWeight = this.masterWeight

            if (this.lowThreshold)
              attributes.lowThreshold = this.lowThreshold

            if (this.medThreshold)
              attributes.medThreshold = this.medThreshold

            if (this.highThreshold)
              attributes.highThreshold = this.highThreshold

            if (this.inflationDest)
              attributes.inflationDest = inflationPublicKey

            if (this.homeDomain)
              attributes.homeDomain = this.homeDomain

            attributes.clearFlags = this.calcFlags('clear')
            attributes.setFlags = this.calcFlags('set')

            if (this.signerType) {
              attributes.signer = {}
              
              if (this.signerType === 'ed25519') {
                attributes.signer.ed25519PublicKey = signerPublicKey
              } else if (this.signerType === 'txhash') {
                attributes.signer.preAuthTx = this.signer
              } else if (this.signerType === 'sha256') {
                attributes.signer.sha256Hash = this.signer
              }

              attributes.signer.weight = this.signerWeight
            }

            return submitTransaction('setOptions', attributes)
              .then(() => {
                flash('Options updated', 'success')
              })
          })
          .catch(flash)
          .then(() => {
            this.isLoading = false
          })
        }
      },

      calcFlags (type) {
        let result = 0

        if (type === 'clear') {
          if (this.account.flags.auth_required && !this.flags.required) {
            result += 1
          }

          if (this.account.flags.auth_revocable && !this.flags.revocable) {
            result += 2
          }

          if (this.account.flags.auth_immutable && !this.flags.immutable) {
            result += 4
          }
        } else if (type === 'set') {
          if (!this.account.flags.auth_required && this.flags.required) {
            result += 1
          }

          if (!this.account.flags.auth_revocable && this.flags.revocable) {
            result += 2
          }

          if (!this.account.flags.auth_immutable && this.flags.immutable) {
            result += 4
          }
        }

        return result
      },
    },

    created () {
      StellarServer().accounts()
        .accountId(this.$store.getters.keypair.publicKey())
        .call()
        .then(account => {
          console.log(account)

          let masterSigner = account.signers.find(signer => {
            return signer.public_key === this.$store.getters.keypair.publicKey()
          })

          this.masterWeight = masterSigner ? masterSigner.weight : ''

          this.lowThreshold = account.thresholds.low_threshold
          this.medThreshold = account.thresholds.med_threshold
          this.highThreshold = account.thresholds.high_threshold

          this.inflationDest = account.inflation_destination
          this.homeDomain = account.home_domain

          this.flags.required = !!account.flags.auth_required
          this.flags.revocable = !!account.flags.auth_revocable
          this.flags.immutable = !!account.flags.auth_immutable

          this.account = account

          this.loaded = true
        })
        .catch(flash)
    },
  }
</script>