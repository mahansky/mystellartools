<template>
    <main class="setoptions">
        <v-container grid-list-lg>
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
                                <b>Tresholds</b>
                                <v-text-field
                                        label="Master weight"
                                        hint="0 - 255"
                                        v-model="masterWeight"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Low treshold"
                                        hint="0 - 255"
                                        v-model="lowTreshold"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Medium treshold"
                                        hint="0 - 255"
                                        v-model="medTreshold"
                                        :rules="weightRules"
                                ></v-text-field>
                                <v-text-field
                                        label="High treshold"
                                        hint="0 - 255"
                                        v-model="highTreshold"
                                        :rules="weightRules"
                                ></v-text-field>

                                <v-layout row wrap>
                                    <v-flex lg6>
                                        <b>Set flags</b>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="setFlags.required"
                                        >
                                            <div slot="label">
                                                Authorization required
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="setFlags.revocable"
                                        >
                                            <div slot="label">
                                                Authorization revocable
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="setFlags.immutable"
                                        >
                                            <div slot="label">
                                                Authorization immutable
                                            </div>
                                        </v-checkbox>
                                    </v-flex>
                                    <v-flex lg6>
                                        <b>Clear flags</b>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="clearFlags.required"
                                        >
                                            <div slot="label">
                                                Authorization required
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="clearFlags.revocable"
                                        >
                                            <div slot="label">
                                                Authorization revocable
                                            </div>
                                        </v-checkbox>
                                        <v-checkbox
                                                color="blue"
                                                hide-details
                                                v-model="clearFlags.immutable"
                                        >
                                            <div slot="label">
                                                Authorization immutable
                                            </div>
                                        </v-checkbox>
                                    </v-flex>
                                </v-layout>

                                <b>Signer</b>
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
                    <b>Tresholds</b>
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
  import { ruleAccountIsValid, Stellar, StellarServer } from '../../stellar'
  import { TransactionBuilder, Operation, Keypair, StrKey } from 'stellar-sdk'
  import { flash } from '../../utils'
  import { submitTransaction } from '../../stellar/internal'
  import isString from 'lodash'

  const xdr = require('stellar-base').xdr

  export default {
    metaInfo: () => ({
      title: 'Set Options',
    }),

    data () {
      return {
        isLoading: false,
        valid: false,

        masterWeight: '',
        lowTreshold: '',
        medTreshold: '',
        highTreshold: '',

        setFlags: {
          required: false,
          revocable: false,
          immutable: false,
        },

        clearFlags: {
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
        accountRules: [(v) => !!v ? ruleAccountIsValid(v, false) : true],
        domainRules: [(v) => !!v ? (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(v) || 'Invalid domain') : true],
        signerRules: [(v) => {
          let temp

          try {
            switch (this.signerType) {
              case 'ed25519':
                if (!StrKey.isValidEd25519PublicKey(v)) {
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
          this.signerLabel = 'Signer\'s public key'
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

          let attributes = {}

          if (this.masterWeight)
            attributes.masterWeight = this.masterWeight

          if (this.lowTreshold)
            attributes.lowTreshold = this.lowTreshold

          if (this.medTreshold)
            attributes.medTreshold = this.medTreshold

          if (this.highTreshold)
            attributes.highTreshold = this.highTreshold

          if (this.inflationDest)
            attributes.inflationDest = Keypair.fromPublicKey(this.inflationDest).xdrAccountId()

          if (this.homeDomain)
            attributes.homeDomain = this.homeDomain

          attributes.clearFlags = this.calcFlags(this.clearFlags)
          attributes.setFlags = this.calcFlags(this.setFlags)

          if (this.signerType) {
            let weight = this.signerWeight
            let key

            if (this.signerType === 'ed25519') {
              key = new xdr.SignerKey.signerKeyTypeEd25519(StrKey.decodeEd25519PublicKey(this.signer))
            }

            if (this.signerType === 'txhash') {
              key = new xdr.SignerKey.signerKeyTypePreAuthTx(Buffer.from(this.signer, 'hex'))
            }

            if (this.signerType === 'sha256') {
              key = new xdr.SignerKey.signerKeyTypeHashX(Buffer.from(this.signer, 'hex'))
            }

            attributes.signer = new xdr.Signer({key, weight})
          }

          submitTransaction('setOptions', attributes)
            .then(() => {
              this.$router.push({name: 'account'})

              flash(this.$store, 'Options updated', 'success')
            })
            .catch((err) => {
              flash(this.$store, err, 'error')
            })
            .then(() => {
              this.isLoading = false
            })
        }
      },

      calcFlags (flags) {
        let result = 0

        if (flags.required)
          result += 1

        if (flags.revocable)
          result += 2

        if (flags.immutable)
          result += 4

        return result
      },
    }
  }
</script>