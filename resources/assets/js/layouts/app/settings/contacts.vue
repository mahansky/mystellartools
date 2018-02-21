<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card-text>
                    <b>List of your contacts</b>

                    <v-data-table
                            :headers="headers"
                            :items="contacts"
                            hide-actions
                            class="elevation-1 mt-2 mb-3"
                    >
                        <template slot="items" slot-scope="props">
                            <td v-text="props.item.name"></td>
                            <td v-text="props.item.public_key"></td>
                            <td>
                                <template v-if="props.item.memo_type">
                                    <span v-text="props.item.memo_type.toUpperCase()"></span>:
                                    <span v-text="props.item.memo"></span>
                                </template>
                            </td>
                            <td class="text-xs-right">
                                <span class="table-row-detail">
                                    <a href="#" @click.prevent.stop="remove(props.item)" class="red--text">
                                        Delete
                                    </a>
                                </span>
                            </td>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-flex>
            <v-flex lg6>
                <v-card-text>
                    <b>Create new contact</b>

                    <v-form v-model="contactForm.valid" ref="contactFormRef">
                        <v-text-field
                                label="Name"
                                v-model="contactForm.name"
                                :rules="contactForm.nameRules"
                        ></v-text-field>
                        <v-text-field
                                label="Public key"
                                v-model="contactForm.publicKey"
                                :rules="contactForm.publicKeyRules"
                        ></v-text-field>
                        <v-layout row>
                            <v-flex xs4>
                                <v-select
                                        label="Memo type"
                                        :items="['MEMO_ID', 'MEMO_TEXT', 'MEMO_HASH', 'MEMO_RETURN']"
                                        v-model="contactForm.memoType"
                                        clearable
                                ></v-select>
                            </v-flex>
                            <v-flex xs8>
                                <v-text-field
                                        :label="contactForm.memoPlaceholder"
                                        :rules="contactForm.memoType ? contactForm.memoValueRules : []"
                                        v-model="contactForm.memoValue"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :loading="contactForm.loading"
                                    :class="{'blue--text': contactForm.valid, 'red--text': !contactForm.valid}"
                                    @click.stop="save"
                            >Save
                            </v-btn>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'
  import Vue from 'vue'
  import { flash } from '~/utils'
  import { ruleAccountIsValid, resolveAccountId, Stellar } from '~/stellar/index'
  import { map } from 'lodash'

  export default {
    data: (vm) => {
      return {
        loaded: false,
        headers: [
          {text: 'Name', value: 'name', align: 'left'},
          {text: 'Public key', value: 'public_key', align: 'left'},
          {text: 'Memo', value: '', align: 'left', sortable: false},
          {text: '', value: '', align: 'right', sortable: false},
        ],
        contactForm: {
          valid: false,
          loading: false,
          name: '',
          nameRules: [(v) => !!v || 'Name is required'],
          publicKey: '',
          publicKeyRules: [(v) => ruleAccountIsValid(v)],
          memoType: '',
          memoValue: '',
          memoPlaceholder: '',
          memoValueRules: [(v) => {
            let memoError = ''

            try {
              switch (vm.contactForm.memoType) {
                case 'MEMO_TEXT':
                  memoError = 'MEMO_TEXT must contain a maximum of 28 characters'
                  Stellar.Memo.text(v)
                  break
                case 'MEMO_ID':
                  memoError = 'MEMO_ID must be a valid 64 bit unsigned integer'
                  Stellar.Memo.id(v)
                  break
                case 'MEMO_HASH':
                  memoError = 'MEMO_HASH must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                  Stellar.Memo.hash(v)
                  break
                case 'MEMO_RETURN':
                  memoError = 'MEMO_RETURN must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                  Stellar.Memo.returnHash(v)
                  break
              }
            } catch (error) {
              return memoError
            }

            return true
          }],
        },
      }
    },

    computed: {
      contacts () {
        return this.$store.getters.contacts
      },
    },

    watch: {
      'contactForm.memoType' (type) {
        switch (type) {
          case 'MEMO_ID':
            this.contactForm.memoPlaceholder = 'Enter memo ID number'
            break
          case 'MEMO_TEXT':
            this.contactForm.memoPlaceholder = 'Up to 28 characters'
            break
          case 'MEMO_HASH':
          case 'MEMO_RETURN':
            this.contactForm.memoPlaceholder = 'Enter 64 character encoded string'
            break
        }
      }
    },

    methods: {
      remove (contact) {
        this.$store.dispatch('removeContact', contact.public_key)
      },

      save () {
        if (this.$refs.contactFormRef.validate()) {
          this.contactForm.loading = true

          resolveAccountId(this.contactForm.publicKey)
            .then(({account_id}) => {
              let contact = {
                name: this.contactForm.name,
                public_key: account_id,
              }

              if (this.contactForm.memoType) {
                contact.memo_type = this.contactForm.memoType
                contact.memo = this.contactForm.memoValue
              }

              this.$store.dispatch('storeContact', contact)

              flash('Contact added', 'success')
            })
            .catch(flash)
            .then(() => {
              this.contactForm.loading = false
            })
        }
      },
    },
  }
</script>