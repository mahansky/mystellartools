<template>
    <main>
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex md6>
                    <v-card class="white">
                        <v-card-text>
                            <v-form>
                                <v-text-field label="Recipient"></v-text-field>

                                <v-layout row>
                                    <v-flex xs8>
                                        <v-text-field label="Amount"></v-text-field>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-select label="Asset" :items="['XLM']"></v-select>
                                    </v-flex>
                                </v-layout>

                                <v-layout row v-if="memo">
                                    <v-flex xs4>
                                        <v-select label="Memo type" :items="['MEMO_ID', 'MEMO_TEXT', 'MEMO_HASH', 'MEMO_RETURN']"></v-select>
                                    </v-flex>
                                    <v-flex xs8>
                                        <v-text-field label="Memo"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn flat class="grey--text" @click="memo = !memo">Memo</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn flat class="blue--text">
                                Verify
                                <v-icon>chevron_right</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex md6>
                    <b>Recipient</b>
                    <p>Public key (address) of Stellar account or any email.</p>
                    <b>Amount & Asset</b>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, asperiores atque blanditiis cumque deserunt earum.</p>
                    <b>Memo</b>
                    <p>Laboriosam libero molestias nostrum placeat quaerat quam qui recusandae sapiente soluta temporibus velit!</p>
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
  export default {
    data () {
      return {
        memo: false,
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
    }
  }
</script>