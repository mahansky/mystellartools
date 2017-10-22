<template>
    <v-card>
        <v-toolbar style="flex: 0 0 auto;" dark class="blue">
            <v-btn icon @click.native="closeDialog" dark>
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>
        <v-container fluid grid-list-xl>
            <v-layout row wrap>
                <v-flex lg12>
                    <v-card-text v-if="$store.getters.keypair">
                        <b>Current account</b>
                        <p v-text="$store.getters.keypair.publicKey()"></p>
                    </v-card-text>

                    <v-card-text v-if="$store.getters.authCheck">
                        <b>List of your accounts</b>

                        <v-data-table
                                :headers="headers"
                                :items="accounts"
                                hide-actions
                                class="elevation-1 mt-2 mb-3"
                        >
                            <template slot="items" scope="props">
                                <td v-text="props.item.name"></td>
                                <td v-text="props.item.public_key"></td>
                                <td>
                                    <v-icon v-if="props.item.sss">check</v-icon>
                                </td>
                                <td class="text-xs-right">
                                <span class="table-row-detail">
                                    <a href="#" @click.prevent="use(props.item.public_key)" class="mr-3">Use</a>
                                    <a href="#" @click.prevent="remove(props.item.public_key)"
                                       class="red--text">Delete</a>
                                </span>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-flex>

                <v-flex lg6 v-if="$store.getters.authCheck">
                    <v-card-text>
                        <b>Add account to your list</b>
                        <p>
                            You can add any number of accounts to your list.
                            If you enter Secret key, it will be stored on our servers so you don't have to store it on your own.
                            You will be asked to enter a password that will be used to encrypt your Secret key.
                        </p>
                        <v-form v-model="addForm.valid" ref="addFormRef">
                            <v-text-field
                                    label="Name"
                                    v-model="addForm.name"
                                    :rules="addForm.nameRules"
                            ></v-text-field>
                            <v-text-field
                                    label="Public or Secret key"
                                    v-model="addForm.key"
                                    :rules="addForm.keyRules"
                            ></v-text-field>
                            <v-text-field
                                    v-if="addForm.isSecret"
                                    label="Password"
                                    v-model="addForm.password"
                                    :rules="addForm.passwordRules"
                            ></v-text-field>
                        </v-form>
                        <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': addForm.valid, 'red--text': !addForm.valid}"
                                    @click="add"
                                    :loading="addForm.isLoading"
                            >Add
                            </v-btn>
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
                        <v-form v-model="viewForm.valid" ref="viewFormRef">
                            <v-text-field
                                    label="Public or Secret key"
                                    v-model="viewForm.key"
                                    :rules="viewForm.rules"
                            ></v-text-field>
                        </v-form>
                        <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': viewForm.valid, 'red--text': !viewForm.valid}"
                                    @click="view"
                            >
                                Switch
                            </v-btn>
                        </v-layout>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-container>

        <div style="flex: 1 1 auto;"></div>
    </v-card>
</template>

<script>
  import { Stellar } from '../../stellar'
  import axios from 'axios'
  import { flash } from '../../utils'
  import { contains, filter, includes } from 'lodash'

  export default {
    data () {
      return {
        viewForm: {
          valid: false,
          key: '',
          rules: [(v) => {
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
          isLoading: false,
          valid: false,
          name: '',
          nameRules: [(v) => !!v || 'Name is required'],
          key: '',
          keypair: null,
          keyRules: [(v) => {
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
          passwordRules: [(v) => (!!v && v.length > 6 && v.length <= 32) || 'Password must have 6 - 32 characters'],
          isSecret: false,
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
        return this.$store.getters.keypairCanSign
      },

      accounts () {
        return this.$store.getters.accounts
      },
    },

    methods: {
      view () {
        if (this.$refs.viewFormRef.validate()) {
          if (this.viewForm.key.startsWith('G')) {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromPublicKey(this.viewForm.key)
            })
          } else {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromSecret(this.viewForm.key)
            })
          }

          this.viewForm.key = ''

          this.closeDialog()
        }
      },

      add () {
        if (this.$refs.addFormRef.validate()) {
          this.addForm.isLoading = true

          let attr = {
            name: this.addForm.name,
            public_key: this.addForm.keypair.publicKey()
          }

          if (this.addForm.keypair.canSign()) {
            attr.secret_key = this.addForm.keypair.secret()
            attr.password = this.addForm.password
          }

          axios.post('/api/accounts', attr)
            .then((response) => {
              this.$store.dispatch('storeAccounts', response.data.data)

              flash(this.$store, 'Account added', 'success')
            })
            .catch((err) => {
              flash(this.$store, err, 'error')
            })
            .then(() => {
              this.addForm.isLoading = false
            })
        }
      },

      closeDialog () {
        this.$emit('close-dialog')
      },

      use (publicKey) {
        let account = filter(this.accounts, function (account) {
          return account.publicKey() === publicKey
        })[0]

        this.$store.dispatch('storeKeypair', {
          keypair: Stellar.Keypair.fromPublicKey(account.public_key),
          sss: account.sss,
        })

        flash(this.$store, 'Account switched', 'success')
      },

      remove (publicKey) {
        axios.delete('/api/accounts', {
          public_key: publicKey,
        }).then((response) => {
          this.$store.dispatch('storeAccounts', response.data.data)

          flash(this.$store, 'Account deleted', 'success')
        }).catch((err) => {
          flash(this.$store, err, 'error')
        })
      },
    },
  }
</script>