<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex md6>
                    <v-card class="white" v-if="!clickedVerify">
                        <v-card-text>
                            <v-form v-model="valid">
                                <v-text-field label="Recipient" :rules="recipientRules"
                                              v-model="recipient"></v-text-field>

                                <v-layout row>
                                    <v-flex xs8>
                                        <v-text-field label="Amount" :rules="amountRules"
                                                      v-model="amount"></v-text-field>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-select label="Asset" :items="['XLM']" :rules="assetRules"
                                                  v-model="asset"></v-select>
                                    </v-flex>
                                </v-layout>

                                <v-layout row v-if="memo">
                                    <v-flex xs4>
                                        <v-select label="Memo type"
                                                  :items="['MEMO_ID', 'MEMO_TEXT', 'MEMO_HASH', 'MEMO_RETURN']"
                                                  v-model="memoType"></v-select>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Memo" :rules="memoValueRules"
                                                      v-model="memoValue"></v-text-field>
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
                        <v-card-text>
                            <p>
                                <b>Recipient</b>
                                <br>
                                <span v-text="recipient"></span>
                            </p>

                            <b>Amount</b>
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
                                        <span class="grey--text text--darken-2" v-html="amountFormat((0.0000100).toFixed(7))"></span>
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
                        </v-card-text>
                        <v-card-actions>
                            <v-btn class="white blue--text" flat @click="clickedVerify = false">
                                <v-icon>chevron_left</v-icon>
                                Back
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn info :loading="isSending" @click="isSending = true">
                                Send
                                <v-icon>send</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <b>Recipient</b>
                    <p>Public key (address) of Stellar account or any email.</p>
                    <b>Amount & Asset</b>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, asperiores atque blanditiis cumque deserunt earum.</p>
                    <b>Memo</b>
                    <p>
                        Laboriosam libero molestias nostrum placeat quaerat quam qui recusandae sapiente soluta temporibus velit!</p>
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
  import { Stellar, StellarServer } from '../../stellar'

  export default {
    data () {
      return {
        clickedVerify: false,
        memo: false,
        valid: false,
        isSending: false,

        recipient: '',
        recipientRules: [(v) => {
          try {
            Stellar.Keypair.fromPublicKey(v)
          } catch (e) {
            return 'Invalid recipient'
          }

          return true
        }],

        amount: '',
        amountRules: [(v) => v > 0 || 'Amount must be greater than zero.'],

        memoType: '',
        memoValue: '',
        memoValueRules: [(v) => {

        }],

        asset: '',
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

    methods: {
      clickVerify() {
        if (this.valid) {
          this.clickedVerify = true
        }
      }
    }
  }
</script>