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
                                                            :rules="newAssetRules"
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
                            <v-btn flat :class="{'blue--text': valid, 'red--text': !valid}" @click="clickVerify">
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
                                <span v-text="recipient"></span>
                            </p>

                            <v-layout row wrap>
                                <v-flex xs6>
                                    <b>Amount sending</b>
                                    <table class="send-amount-table" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <span v-html="amountFormat(parseFloat(amount).toFixed(7))"></span>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span class="grey--text">+</span>
                                                <span class="grey--text text--darken-2"
                                                      v-html="amountFormat((0.0000100).toFixed(7))"></span>
                                            </td>
                                            <td>
                                                <small class="grey--text">(base fee)</small>
                                            </td>
                                        <tr class="total">
                                            <td>
                                                <span v-html="amountFormat(parseFloat(amount + 0.00001).toFixed(7))"></span>
                                            </td>
                                            <td>
                                                <span v-text="asset"></span>
                                            </td>
                                        </tr>
                                    </table>
                                </v-flex>
                                <v-flex xs6>
                                    <b>New balance</b>
                                    <table class="send-amount-table" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td>
                                                <span v-html="amountFormat(parseFloat(balance).toFixed(7))"></span>
                                            </td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>-</span>
                                                <span v-html="amountFormat(parseFloat(amount + 0.00001).toFixed(7))"></span>
                                            </td>
                                            <td>
                                                <small class="grey--text">(sending)</small>
                                            </td>
                                        <tr class="total">
                                            <td>
                                                <span v-html="amountFormat(parseFloat(balance - (amount + 0.00001)).toFixed(7))"></span>
                                            </td>
                                            <td>
                                                <span v-text="asset"></span>
                                            </td>
                                        </tr>
                                    </table>
                                </v-flex>
                            </v-layout>

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
                                    @click="clickedSend"
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
                        If you enter an email, that hasn't received any assets in the past, recipient will get a message with information on how to access his new assets.
                        If he doesn't claim them, you can <a href="#">revert the process</a>.
                    </p>
                    <b>Asset</b>
                    <p>
                        You can choose one of the assets your account has (see <router-link :to="{name: 'balance'}">Balance</router-link>) or you can issue new asset directly using this form.
                        Recipient will have to trust you first. Trust can be created using <router-link :to="{name: 'trustlines'}">Trustlines</router-link>.
                    </p>
                    <b>Memo</b>
                    <p>
                        If you choose MEMO_TEXT, you can write short message that will be sent to the recipient along with the payment.
                        For information on other types, check <a href="https://www.stellar.org/developers/guides/concepts/transactions.html#memo" target="_blank" rel="noreferrer nofollow">documentation</a>.
                    </p>
                </v-flex>
                <!--<v-flex lg8 md12>-->
                <!--<v-text-field v-model="contactsSearch" label="Search contacts" hide-details class="mt-5"></v-text-field>-->

                <!--<v-data-table-->
                <!--:headers="contactsHeaders"-->
                <!--:search="contactsSearch"-->
                <!--:items="contacts"-->
                <!--hide-actions-->
                <!--class="elevation-1 mt-3"-->
                <!--&gt;-->
                <!--<template slot="items" scope="props">-->
                <!--<td>{{ props.item.name }}</td>-->
                <!--<td>{{ props.item.key }}</td>-->
                <!--</template>-->
                <!--</v-data-table>-->
                <!--</v-flex>-->
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { ruleAccountIsValid, Stellar, StellarServer } from '../../stellar'
  import { Asset, Keypair, Memo, Operation, TransactionBuilder } from 'stellar-sdk'
  import BigNumber from 'bignumber.js'
  import { flash } from '../../utils'
  import { forEach } from 'lodash'

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

        recipient: '',
        recipientRules: [(v) => ruleAccountIsValid(v)],

        amount: '',
        amountRules: [(v) => Operation.isValidAmount(v) || 'Amount must be greater than zero.'],

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
                this.resolvedMemo = Memo.text(v)
                break
              case 'MEMO_ID':
                memoError = 'MEMO_ID must be a valid 64 bit unsigned integer'
                this.resolvedMemo = Memo.id(v)
                break
              case 'MEMO_HASH':
                memoError = 'MEMO_HASH must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                this.resolvedMemo = Memo.hash(v)
                break
              case 'MEMO_RETURN':
                memoError = 'MEMO_RETURN must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                this.resolvedMemo = Memo.returnHash(v)
                break
            }
          } catch (error) {
            return memoError
          }

          return true
        }],

        selectedAvailableAsset: '',
        newAsset: '',
        newAssetRules: [(v) => (!!v && v.length > 0 && v.length <= 12) || 'Max 12 characters'],
        availableAssets: [],
        assetSelector: false,
        asset: 'XLM',
        assetTypes: ['XLM'],
        assetRules: [(v) => !!v || 'You have to choose an asset code'],

//        contactsSearch: '',
//        contactsHeaders: [
//          { text: 'Name', value: 'name', align: 'left' },
//          { text: 'Address', value: 'key', align: 'left' },
//        ],
//        contacts: [
//          {
//            name: 'John Doe',
//            key: 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD'
//          },
//          {
//            name: 'Julia Clark',
//            key: 'GDP4SJE5Y5ODX627DO2F7ZNBAPVXRFHKKR3W4UJ6I4XMW3S3OH2XRWYD'
//          }
//        ],
      }
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
      clickVerify () {
        if (this.$refs.form.validate()) {
          if (this.valid) {
            this.clickedVerify = true
            this.isVerifying = true
            this.isSending = false

            this.verifyPayment()
          }
        }
      },

      verifyPayment () {
        let vm = this

        StellarServer.loadAccount(this.$store.getters.keypair.publicKey())
          .then(account => {
            vm.loadedAccount = account

            let minimumBalance = 20 + (account.subentry_count) * 10
            let nativeBalance = _(account.balances).find(balance => balance.asset_type === 'native').balance
            let maxSend = new BigNumber(nativeBalance).minus(minimumBalance)

            if (maxSend.lt(this.amount)) {
              throw 'InsufficientBalanceError'
            }
          })
          .then(() => {
            if (new BigNumber(this.amount).gte(20)) {
              return
            }

            return StellarServer.accounts()
              .accountId(this.recipient)
              .call()
              .catch(err => {
                if (err.name === 'NotFoundError') {
                  throw 'DestinationAccountNotExistError'
                }
              })
          })
          .then(() => {
            vm.isVerifying = false
          })
          .catch(err => {
            flash(vm.$store, err, 'error')
          })
      },

      clickedSend () {
        this.isSending = true

        StellarServer.accounts()
          .accountId(this.recipient)
          .call()
          .then(() => {
            let operation = Operation.payment({
              destination: this.recipient,
              asset: Asset.native(),
              amount: this.amount,
            })

            return this.submitTransaction(operation)
          })
          .then(() => {
            this.$router.push({name: 'payments'})
          })
          .catch(err => {
            if (err.name === 'NotFoundError') {
              let operation = Operation.createAccount({
                destination: this.destination,
                startingBalance: this.amount,
              })

              return this.submitTransaction(operation)
            } else {
              flash(this.$store, err.name, 'error')
            }
          })
      },

      submitTransaction (operation) {
        let transaction = new TransactionBuilder(this.loadedAccount).addOperation(operation)

        if (this.memo) {
          transaction.addMemo(this.resolvedMemo)
        }

        transaction.build()

        transaction.sign(Keypair.fromSeed(this.$store.getters.keypair.secret()))

        return StellarServer.submitTransaction(transaction)
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
        .catch(err => {
          flash(this.$store, err, 'error')
        })
    },
  }
</script>