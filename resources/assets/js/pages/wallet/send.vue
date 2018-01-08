<template>
    <main>
        <v-btn flat info loading v-if="!loaded"></v-btn>
        <v-container grid-list-lg v-if="loaded">
            <v-layout row wrap>
                <v-flex md6>
                    <v-card class="white" v-if="!clickedVerify">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Make a payment
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form v-model="valid" ref="form">
                                <v-text-field
                                        label="Recipient"
                                        :rules="recipientRules"
                                        v-model="recipient"
                                        append-icon="supervisor_account"
                                        :append-icon-cb="openContacts"
                                ></v-text-field>

                                <v-layout row>
                                    <v-flex xs8>
                                        <v-text-field
                                                label="Amount"
                                                :rules="amountRules"
                                                v-model="amount"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-menu
                                                offset-x
                                                :close-on-content-click="false"
                                                v-model="assetSelector"
                                                style="width: 100%"
                                        >
                                            <v-select
                                                    label="Asset"
                                                    slot="activator"
                                                    v-model="asset"
                                                    :items="assetTypes"
                                                    @focus="assetSelector = true"
                                                    :rules="assetRules"
                                                    disabled
                                            ></v-select>
                                            <v-card>
                                                <v-card-text>
                                                    <v-select
                                                            label="Select Asset"
                                                            :items="availableAssets"
                                                            v-model="selectedAvailableAsset"
                                                    ></v-select>
                                                    <v-layout>
                                                        <v-spacer></v-spacer>
                                                        <span class="subheader">or</span>
                                                        <v-spacer></v-spacer>
                                                    </v-layout>
                                                    <v-text-field
                                                            label="New Asset Code"
                                                            v-model="newAsset"
                                                    ></v-text-field>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn info flat @click="setAsset">Set</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>

                                <v-layout row v-if="memo">
                                    <v-flex xs4>
                                        <v-select
                                                label="Memo type"
                                                :items="['MEMO_ID', 'MEMO_TEXT', 'MEMO_HASH', 'MEMO_RETURN']"
                                                v-model="memoType"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field
                                                :label="memoPlaceholder"
                                                :rules="memoType ? memoValueRules : []"
                                                v-model="memoValue"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn flat class="grey--text" @click="memo = !memo">Memo</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn flat :class="{'blue--text': valid, 'red--text': !valid}" @click="verify">
                                Verify
                                <v-icon>chevron_right</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>

                    <v-card class="white" v-else>
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Make a payment
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <p>
                                <b>Recipient</b>
                                <br>
                                <public-key :value="recipient"></public-key>
                            </p>

                            <b>Amount</b>
                            <table class="first-padding" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td><span>Sending</span></td>
                                    <td>
                                        <amount :amount="newBigNumber(amount).toFixed(7)"></amount>
                                        <span v-text="asset"></span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span>New balance</span></td>
                                    <td>
                                        <amount :amount="newBigNumber(balance).minus(amount).toFixed(7)"></amount>
                                        <span v-text="asset"></span>
                                    </td>
                                </tr>
                            </table>
                            <p class="grey--text">
                                Every transaction costs extra <amount amount="0.0000100"></amount> XLM
                            </p>

                            <v-layout row wrap v-if="memo">
                                <v-flex xs12>
                                    <b>Memo</b>
                                    <br>
                                    <span v-text="memoType"></span>:
                                    <span v-text="memoValue"></span>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn class="white blue--text" flat @click="clickedVerify = false">
                                <v-icon>chevron_left</v-icon>
                                Back
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    v-if="isVerifying"
                                    flat
                                    :loading="isVerifying"
                                    class="red--text"
                            ></v-btn>
                            <v-btn
                                    info
                                    v-if="!isVerifying"
                                    :loading="isSending"
                                    @click="send"
                            >
                                Send
                                <v-icon>done</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <b>Recipient</b>
                    <p>
                        <u>Public key</u> (address) of Stellar account or <u>any email address</u>.
                    </p>
                    <p>
                        Clicking on the icon on the right side of the input opens up your contact list.
                    </p>
                    <p>
                        If you enter an email, that hasn't received any assets in the past,
                        recipient will get a message with information on how to access his new assets.
                        If he doesn't claim them, you can <router-link :to="{name: 'revoke'}">revert the process</router-link>.
                    </p>
                    <b>Asset</b>
                    <p>
                        You can choose one of the assets your account has
                        (see <router-link :to="{name: 'balance'}">Balance</router-link>)
                        or you can issue new asset directly using this form.
                        Recipient will have to trust you first. Trust can be created using
                        <router-link :to="{name: 'trustlines'}">Trustlines</router-link>.
                    </p>
                    <b>Memo</b>
                    <p>
                        If you choose MEMO_TEXT, you can write short message that will be sent to the recipient along with the payment.
                        For information on other types, check <a
                            href="https://www.stellar.org/developers/guides/concepts/transactions.html#memo"
                            target="_blank" rel="noreferrer nofollow">documentation</a>.
                    </p>
                </v-flex>
            </v-layout>
        </v-container>

        <v-dialog v-model="contactsSelector" lazy absolute>
            <v-card>
                <v-card-text>
                    <v-text-field
                            v-model="contactsSearch"
                            label="Search contacts"
                            hide-details
                    ></v-text-field>
                </v-card-text>
                <v-data-table
                        :headers="contactsHeaders"
                        :items="contacts"
                        :search="contactsSearch"
                        hide-actions
                        class="elevation-1 mt-2"
                >
                    <template slot="items" slot-scope="props">
                        <td class="pt-2 pb-2">
                            <div v-text="props.item.name"></div>
                            <div v-text="props.item.public_key" class="grey--text text--darken-2" style="word-break: break-all"></div>
                            <div v-if="props.item.memo_type">
                                <span v-text="props.item.memo_type + ': '"></span>
                                <span v-text="props.item.memo"></span>
                            </div>
                            <a href="#" @click.prevent.stop="selectContact(props.item)">Select</a>
                        </td>
                    </template>
                </v-data-table>
            </v-card>
        </v-dialog>
    </main>
</template>

<script>
  import { resolveAccountId, ruleAccountIsValid, Stellar, StellarServer } from '~/stellar'
  import { flash } from '~/utils'
  import { forEach } from 'lodash'
  import { submitTransaction } from '~/stellar/internal'
  import knownAccounts from '~/stellar/known_accounts'
  import BigNumber from 'bignumber.js'

  export default {
    metaInfo: () => ({
      title: 'Send',
    }),

    data () {
      return {
        loaded: false,

        balance: 0,
        clickedVerify: false,
        isVerifying: true,
        memo: false,
        valid: false,
        isSending: false,

        resolvedRecipient: '',
        recipient: '',
        recipientRules: [ruleAccountIsValid],

        amount: '',
        amountRules: [(v) => Stellar.Operation.isValidAmount(v) || 'Amount must be greater than zero.'],

        resolvedMemo: null,
        memoType: '',
        memoValue: '',
        memoPlaceholder: 'Memo',
        memoValueRules: [(v) => {
          let memoError = ''

          try {
            switch (this.memoType) {
              case 'MEMO_TEXT':
                memoError = 'MEMO_TEXT must contain a maximum of 28 characters'
                this.resolvedMemo = Stellar.Memo.text(v)
                break
              case 'MEMO_ID':
                memoError = 'MEMO_ID must be a valid 64 bit unsigned integer'
                this.resolvedMemo = Stellar.Memo.id(v)
                break
              case 'MEMO_HASH':
                memoError = 'MEMO_HASH must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                this.resolvedMemo = Stellar.Memo.hash(v)
                break
              case 'MEMO_RETURN':
                memoError = 'MEMO_RETURN must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                this.resolvedMemo = Stellar.Memo.returnHash(v)
                break
            }
          } catch (error) {
            return memoError
          }

          return true
        }],

        selectedAvailableAsset: '',
        newAsset: '',
        availableAssets: [],
        assetSelector: false,
        asset: 'XLM',
        assetTypes: ['XLM'],
        assetRules: [(v) => (!!v && v.length > 0 && v.length <= 12) || 'Asset code must have from 1 to 12 characters'],

        contactsSelector: false,
        contactsSearch: '',
        contactsHeaders: [
          { text: 'Contacts', value: '', align: 'left', sortable: false },
        ],
      }
    },

    computed: {
      contacts () {
        return this.$store.getters.contacts
      },
    },

    watch: {
      memoType (type) {
        switch (type) {
          case 'MEMO_ID':
            this.memoPlaceholder = 'Enter memo ID number'
            break
          case 'MEMO_TEXT':
            this.memoPlaceholder = 'Up to 28 characters'
            break
          case 'MEMO_HASH':
          case 'MEMO_RETURN':
            this.memoPlaceholder = 'Enter 64 character encoded string'
            break
        }
      }
    },

    methods: {
      verify () {
        if (this.$refs.form.validate()) {
          this.clickedVerify = true
          this.isVerifying = true
          this.isSending = false

          let vm = this

          resolveAccountId(this.recipient)
            .then(({account_id}) => {
              this.resolvedRecipient = account_id

              if (this.memoValue === '' && this.resolvedRecipient in knownAccounts && knownAccounts[this.resolvedRecipient].requiredMemoType) {
                this.memo = true
                this.memoType = knownAccounts[this.resolvedRecipient].requiredMemoType
                this.memoValue = ''

                throw new Error(knownAccounts[this.resolvedRecipient].name + ' requires MEMO to be set!')
              }

              return StellarServer.loadAccount(this.$store.getters.keypair.publicKey())
                .then(account => {
                  vm.loadedAccount = account

                  let selectedAsset = this.asset
                  let minimumNativeBalance = 20 + (account.subentry_count) * 10
                  let balance = _(account.balances).find(balance => {
                    if (selectedAsset === 'XLM') {
                      return balance.asset_type === 'native'
                    }

                    return balance.asset_code === selectedAsset
                  }).balance

                  this.balance = balance

                  if (selectedAsset === 'XLM') {
                    let maxSend = new BigNumber(balance).minus(minimumNativeBalance)

                    if (maxSend.lt(new BigNumber(this.amount))) {
                      throw new Error('Insufficient balance')
                    }
                  }
                })
                .then(() => {
                  if (this.asset === 'XLM') {
                    if (new BigNumber(this.amount).gte(20)) {
                      return
                    }

                    return StellarServer.accounts()
                      .accountId(this.resolvedRecipient)
                      .call()
                      .catch(err => {
                        if (err.name === 'NotFoundError') {
                          throw new Error('Account does not exist. You need to send at least 20 XLM.')
                        }
                      })
                  }
                })
                .then(() => {
                  vm.isVerifying = false
                })
            })
            .catch((err) => {
              this.clickedVerify = false

              flash(err, 'error')
            })
        }
      },

      send () {
        this.isSending = true

        let code, issuer

        if (this.asset === 'XLM') {
          code = 'XLM'
          issuer = null
        } else {
          code = this.asset
          issuer = this.$store.getters.keypair.publicKey()
        }

        StellarServer.accounts()
          .accountId(this.resolvedRecipient)
          .call()
          .then(() => {
            return submitTransaction('payment', {
              destination: this.resolvedRecipient,
              code,
              issuer,
              amount: this.amount,
              memo: this.memo ? this.resolvedMemo : undefined,
            })
          })
          .then(() => {
            this.$router.push({name: 'payments'})
          })
          .catch(err => {
            if (err.name === 'NotFoundError' && this.asset === 'XLM') {
              return submitTransaction('createAccount', {
                destination: this.resolvedRecipient,
                startingBalance: this.amount,
                memo: this.memo ? this.resolvedMemo : undefined,
              })
            }

            throw err
          })
          .then(() => {
            flash('Payment successfully submitted to the network!', 'success')
          })
          .catch(flash)
          .then(() => {
            this.isSending = false
            this.clickedVerify = false
          })
      },

      setAsset () {
        if (this.newAsset) {
          this.asset = this.newAsset
        } else {
          this.asset = this.selectedAvailableAsset
        }

        this.assetTypes = [this.asset]
        this.newAsset = ''
        this.assetSelector = false
      },

      newBigNumber (value) {
        return new BigNumber(value)
      },

      openContacts () {
        this.contactsSelector = true
      },

      selectContact (contact) {
        this.contactsSelector = false

        this.recipient = contact.public_key

        if (contact.memo_type) {
          this.memo = true
          this.memoType = contact.memo_type.toUpperCase()
          this.memoValue = contact.memo
        } else {
          this.memo = false
          this.memoType = ''
          this.memoValue = ''
        }
      },
    },

    created () {
      StellarServer.loadAccount(this.$store.getters.keypair.publicKey())
        .then((account) => {
          this.availableAssets = ['XLM']

          forEach(account.balances, (balance) => {
            if (balance.asset_type !== 'native') {
              this.availableAssets.push(balance.asset_code)
            }
          })

          this.loaded = true
        })
        .catch(flash)
    },
  }
</script>