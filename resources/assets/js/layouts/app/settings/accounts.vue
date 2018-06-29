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
                <accountswitch @done="closeDialog"></accountswitch>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import { Stellar, resolveAccountId } from '~/stellar'
  import { flash } from '~/utils'
  import { contains, filter, includes, map } from 'lodash'
  import { ruleBip32Path } from '~/stellar/index'
  import { getPublicKey } from '~/stellar/ledger'
  import Accountswitch from './accounts/accountswitch.vue'
  import Vue from 'vue'

  export default {
    components: {
      Accountswitch,
    },

    data () {
      return {
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

            if (new RegExp('^.+\\*.+$').test(v)) {
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
      add () {
        if (this.$refs.addFormRef.validate()) {
          this.addForm.loading = true

          if (this.addForm.ledger) {
              getPublicKey.then(publicKey => {
                this.$store.dispatch('storeAccount', {
                  name: this.addForm.name,
                  public_key: publicKey,
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
          } else {
            new Promise((r) => {
              if (this.addForm.key.indexOf('*') !== -1) {
                resolveAccountId(this.addForm.key).then(({account_id}) => {
                  r(Stellar.Keypair.fromPublicKey(account_id))
                })
              } else {
                r(this.addForm.keypair)
              }
            })
              .then(keypair => {
                let account = {
                  name: this.addForm.name,
                  public_key: keypair.publicKey(),
                }

                if (keypair.canSign()) {
                  account.secret_key = keypair.secret()
                  account.password = this.addForm.password
                }

                this.$store.dispatch('storeAccount', account)

                flash('Account added', 'success')
              })
              .catch(flash)
              .then(() => {
                this.addForm.name = ''
                this.addForm.key = ''
                this.addForm.password = ''

                this.addForm.loading = false
              })
          }
        }
      },

      closeDialog () {
        this.$parent.$parent.$parent.closeDialog()
        this.$router.push({name: 'balance'})
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
      },

      remove (account) {
        this.$store.dispatch('removeAccount', account.public_key)
      },
    },
  }
</script>