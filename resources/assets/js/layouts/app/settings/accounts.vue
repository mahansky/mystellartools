<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card-text v-if="$store.getters.keypair">
                    <b>Current account</b>
                    <p v-text="$store.getters.keypair.publicKey()" class="break-all"></p>
                </v-card-text>

                <v-card-text>
                    <b>List of your accounts</b>

                    <v-data-table
                            :headers="headers"
                            :items="accounts"
                            hide-actions
                            class="elevation-1 mt-2 mb-3"
                    >
                        <template slot="items" slot-scope="props">
                            <td v-text="props.item.name"></td>
                            <td v-text="props.item.public_key"></td>
                            <td>
                                <v-icon v-if="props.item.secret_key">check</v-icon>
                            </td>
                            <td class="text-xs-right">
                                    <span class="table-row-detail">
                                        <a href="#" @click.prevent="use(props.item)" class="mr-3">Use</a>

                                        <a href="#" @click.prevent.stop="remove(props.item)" class="red--text">Delete</a>
                                    </span>
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-flex>

            <v-flex lg6>
                <v-card-text>
                    <b>Add account to your list</b>
                    <p>
                        You can add any number of accounts to your list.
                        If you enter Secret key, it will be stored on our servers so you don't have to store it on your own.
                        You will be asked to enter a password that will be used to encrypt your Secret key.
                    </p>
                    <v-form v-model="addForm.valid" ref="addFormRef">
                        <v-checkbox
                                label="Adding Ledger Nano S account?"
                                v-model="addForm.ledger"
                                light
                                color="blue"
                                hide-details
                        ></v-checkbox>
                        <v-text-field
                                label="Name"
                                v-model="addForm.name"
                                :rules="addForm.nameRules"
                        ></v-text-field>
                        <v-text-field
                                v-if="addForm.ledger"
                                label="Bip 32 Path"
                                v-model="addForm.bip32Path"
                                :rules="addForm.bip32PathRules"
                        ></v-text-field>
                        <v-text-field
                                v-if="!addForm.ledger"
                                label="Public or Secret key"
                                v-model="addForm.key"
                                :rules="addForm.keyRules"
                        ></v-text-field>
                        <v-text-field
                                v-if="!addForm.ledger && addForm.isSecret"
                                label="Password"
                                v-model="addForm.password"
                                :rules="addForm.passwordRules"
                                :append-icon="addForm.pw ? 'visibility' : 'visibility_off'"
                                :append-icon-cb="() => (addForm.pw = !addForm.pw)"
                                :type="addForm.pw ? 'password' : 'text'"
                        ></v-text-field>
                    </v-form>
                    <v-layout row>
                        <v-spacer></v-spacer>
                        <v-btn
                                :loading="addForm.loading"
                                flat
                                :class="{'blue--text': addForm.valid, 'red--text': !addForm.valid}"
                                @click.stop="add"
                        >Add</v-btn>
                    </v-layout>
                </v-card-text>
            </v-flex>
            <v-flex lg6>
                <v-card-text>
                    <b>Switch to another account</b>
                    <p>
                        You can input Public or Secret key.
                        Using Secret, account will be automatically unlocked.
                    </p>
                    <p v-if="$store.getters.keypair && !unlocked" class="blue--text">
                        Use this form to unlock your account (enter your Secret key).
                    </p>
                    <v-form v-model="viewForm.valid" ref="viewFormRef" @submit.prevent="">
                        <v-checkbox
                                label="Switching to Ledger Nano S account?"
                                v-model="viewForm.ledger"
                                light
                                color="blue"
                                hide-details
                        ></v-checkbox>
                        <v-text-field
                                v-if="!viewForm.ledger"
                                label="Public or Secret key"
                                v-model="viewForm.key"
                                :rules="viewForm.rules"
                        ></v-text-field>
                        <v-text-field
                                v-if="viewForm.ledger"
                                label="Bip 32 Path"
                                v-model="viewForm.bip32Path"
                                :rules="viewForm.bip32PathRules"
                        ></v-text-field>
                    </v-form>
                    <v-layout row>
                        <v-spacer></v-spacer>
                        <v-btn
                                flat
                                :class="{'blue--text': viewForm.valid, 'red--text': !viewForm.valid}"
                                @click="view"
                        >Switch</v-btn>
                    </v-layout>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import { Stellar, resolveAccountId } from '~/stellar'
  import { flash } from '~/utils'
  import { contains, filter, includes, map } from 'lodash'
  import { ruleBip32Path } from '~/stellar/index'
  import Vue from 'vue'
  import axios from 'axios'
  import StellarLedger from 'stellar-ledger-api'

  export default {
    data () {
      return {
        viewForm: {
          valid: false,
          ledger: false,
          bip32Path: "44'/148'/0'",
          bip32PathRules: [(v) => ruleBip32Path(v)],
          key: '',
          rules: [(v) => {
            if (this.viewForm.ledger) {
              return true
            }

            if (this.viewForm.key.startsWith('G')) {
              try {
                Stellar.Keypair.fromPublicKey(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            } else {
              try {
                Stellar.Keypair.fromSecret(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            }
          }],
        },

        addForm: {
          loading: false,
          pw: false,
          valid: false,
          name: '',
          nameRules: [(v) => !!v || 'Name is required'],
          key: '',
          keypair: null,
          keyRules: [(v) => {
            if (this.addForm.ledger) {
              return true
            }

            if (this.addForm.key.startsWith('G')) {
              try {
                this.addForm.keypair = Stellar.Keypair.fromPublicKey(v)
                this.addForm.isSecret = false
              } catch (e) {
                return 'Invalid key'
              }
            } else {
              try {
                this.addForm.keypair = Stellar.Keypair.fromSecret(v)
                this.addForm.isSecret = true
              } catch (e) {
                return 'Invalid key'
              }
            }

            let exists = includes(this.$store.getters.accounts, (account) => {
              return account.public_key === this.addForm.keypair.publicKey()
            })

            if (exists) {
              return 'Already in your list'
            }

            return true
          }],
          password: '',
          passwordRules: [(v) => (!!v && v.length >= 6 && v.length <= 32) || 'Password must have 6 - 32 characters'],
          isSecret: false,
          ledger: false,
          bip32Path: "44'/148'/0'",
          bip32PathRules: [(v) => ruleBip32Path(v)],
        },

        headers: [
          {text: 'Name', value: 'name', align: 'left'},
          {text: 'Public key', value: 'public_key', align: 'left'},
          {text: 'Secret key', value: '', align: 'left', sortable: false},
          {text: '', value: '', align: 'right', sortable: false},
        ],
      }
    },

    computed: {
      unlocked () {
        return this.$store.getters.keypairCanSign || this.$store.getters.keypairLedger
      },

      accounts () {
        return this.$store.getters.accounts
      },
    },

    methods: {
      view () {
        if (this.viewForm.ledger) {
          try {
            new StellarLedger.Api(new StellarLedger.comm(20)).getPublicKey_async(this.viewForm.bip32Path).then((result) => {
              this.$store.dispatch('storeKeypair', {keypair: Stellar.Keypair.fromPublicKey(result['publicKey'])})
              this.$store.dispatch('accessWithLedger', {bip32Path: this.viewForm.bip32Path})

              this.closeDialog()

              this.$router.push({name: 'balance'})
            }).catch(() => {
              flash('Failed to connect to Ledger', 'error')
            })
          } catch (err) {
            flash('Failed to connect to Ledger', 'error')
          }
        } else {
          if (this.$refs.viewFormRef.validate()) {
            new Promise((r) => {
              if (Stellar.StrKey.isValidEd25519SecretSeed(this.viewForm.key)) {
                r(Stellar.Keypair.fromSecret(this.viewForm.key))
              } else {
                resolveAccountId(this.viewForm.key).then(({account_id}) => {
                  r(Stellar.Keypair.fromPublicKey(account_id))
                })
              }
            })
              .then(keypair => {
                this.$store.dispatch('storeKeypair', {keypair})

                this.viewForm.key = ''

                this.closeDialog()

                this.$router.push({name: 'balance'})
              })
              .catch(flash)
          }
        }
      },

      add () {
        if (this.$refs.addFormRef.validate()) {
          this.addForm.loading = true

          if (this.addForm.ledger) {
            try {
              new StellarLedger.Api(new StellarLedger.comm(20)).getPublicKey_async(this.addForm.bip32Path).then((result) => {
                this.$store.dispatch('storeAccount', {
                  name: this.addForm.name,
                  public_key: result['publicKey'],
                  bip32Path: this.addForm.bip32Path,
                })

                this.addForm.name = ''
                this.addForm.key = ''
                this.addForm.password = ''
              }).catch(() => {
                flash('Problem with contacting Ledger Nano S', 'error')
              }).then(() => {
                this.addForm.loading = false
              })
            } catch (err) {
              this.addForm.loading = false

              flash('Problem with contacting Ledger Nano S', 'error')
            }
          } else {
            let account = {
              name: this.addForm.name,
              public_key: this.addForm.keypair.publicKey(),
            }

            if (this.addForm.keypair.canSign()) {
              account.secret_key = this.addForm.keypair.secret()
              account.password = this.addForm.password
            }

            this.$store.dispatch('storeAccount', account)

            this.addForm.name = ''
            this.addForm.key = ''
            this.addForm.password = ''

            this.addForm.loading = false
          }
        }
      },

      closeDialog () {
        this.$parent.$parent.$parent.closeDialog()
      },

      use (account) {
        let selectedAccount = filter(this.accounts, function (acc) {
          return acc.public_key === account.public_key
        })[0]

        this.$store.dispatch('storeKeypair', {
          keypair: Stellar.Keypair.fromPublicKey(selectedAccount.public_key),
        })

        if (selectedAccount.bip32Path) {
          this.$store.dispatch('accessWithLedger', {
            bip32Path: this.bip32Path
          })
        }

        flash('Account switched', 'success')

        this.closeDialog()

        this.$router.push({name: 'balance'})
      },

      remove (account) {
        this.$store.dispatch('removeAccount', account.public_key)
      },
    },
  }
</script>