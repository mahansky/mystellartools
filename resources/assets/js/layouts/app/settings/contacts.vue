<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex lg12>
                <v-card-text>
                    <b>List of your contacts</b>

                    <v-btn info loading flat v-if="!loaded"></v-btn>
                    <v-data-table
                            v-if="loaded"
                            :headers="headers"
                            :items="contacts"
                            hide-actions
                            class="elevation-1 mt-2 mb-3"
                    >
                        <template slot="items" scope="props">
                            <td v-text="props.item.name"></td>
                            <td v-text="props.item.public_key"></td>
                            <td>
                                <template v-if="props.item.memo_type">
                                    <span v-text="props.item.memo_type"></span>
                                    <span v-text="props.item.memo"></span>
                                </template>
                            </td>
                            <td class="text-xs-right">
                                <span class="table-row-detail">
                                    <a v-if="!props.item.isDeleteLoading" href="#"
                                       @click.prevent.stop="remove(props.item)" class="red--text">Delete</a>
                                    <v-btn v-if="props.item.isDeleteLoading" flat small loading
                                           class="red--text"></v-btn>
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
                                    :class="{'blue--text': contactForm.valid, 'red--text': !contactForm.valid}"
                                    @click="save"
                                    :loading="contactForm.isLoading"
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
  import { flash } from '../../../utils'
  import Vue from 'vue'
  import { ruleAccountIsValid } from '../../../stellar/index'
  import { Memo } from 'stellar-sdk'
  import { map } from 'lodash'

  export default {
    data () {
      return {
        loaded: false,
        headers: [
          {text: 'Name', value: 'name', align: 'left'},
          {text: 'Public key', value: 'public_key', align: 'left'},
          {text: 'Memo', value: '', align: 'left', sortable: false},
          {text: '', value: '', align: 'right', sortable: false},
        ],
        contactForm: {
          isLoading: false,
          valid: false,
          name: '',
          nameRules: [(v) => !!v || 'Name is required'],
          publicKey: '',
          publicKeyRules: [(v) => ruleAccountIsValid(v, false)],
          memoType: '',
          memoValue: '',
          memoPlaceholder: '',
          memoValueRules: [(v) => {
            let memoError = ''

            try {
              switch (this.memoType) {
                case 'MEMO_TEXT':
                  memoError = 'MEMO_TEXT must contain a maximum of 28 characters'
                  Memo.text(v)
                  break
                case 'MEMO_ID':
                  memoError = 'MEMO_ID must be a valid 64 bit unsigned integer'
                  Memo.id(v)
                  break
                case 'MEMO_HASH':
                  memoError = 'MEMO_HASH must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                  Memo.hash(v)
                  break
                case 'MEMO_RETURN':
                  memoError = 'MEMO_RETURN must be a 32 byte hash represented in hexadecimal (A-Z0-9)'
                  Memo.returnHash(v)
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
        return map(this.$store.getters.contacts, (contact) => {
          Vue.set(contact, 'isDeleteLoading', false)

          return contact
        })
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
      fetch () {
        this.loaded = false

        axios.get('/api/contacts')
          .then(response => {
            this.$store.dispatch('storeContacts', response.data)
          })
          .catch(err => {
            flash(this.$store, err, 'error')
          })
          .then(() => {
            this.loaded = true
          })
      },

      remove (contact) {
        contact.isDeleteLoading = true

        axios.delete(`/api/contacts/${contact.id}`)
          .then(() => {
            flash(this.$store, 'Contact deleted', 'success')
          })
          .catch(err => {
            flash(this.$store, err, 'error')
          })
          .then(() => {
            return this.fetch()
          })
      },

      save () {
        if (this.$refs.contactFormRef.validate()) {
          this.contactForm.isLoading = true

          let params = {
            name: this.contactForm.name,
            public_key: this.contactForm.publicKey,
          }

          if (this.contactForm.memoType) {
            params.memo_type = this.contactForm.memoType.split('_')[1].toLowerCase()
            params.memo = this.contactForm.memoValue
          }

          axios.post('/api/contacts', params).then(() => {
            flash(this.$store, 'Contact added', 'success')
          }).catch(err => {
            flash(this.$store, err, 'error')
          }).then(() => {
            this.contactForm.isLoading = false

            return this.fetch()
          })
        }
      },
    },

    created () {
      this.fetch()
    },
  }
</script>