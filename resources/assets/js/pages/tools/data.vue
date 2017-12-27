<template>
    <main class="data">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex lg6>
                    <v-card class="white">
                        <v-toolbar card color="white" dense>
                            <v-toolbar-title class="body-2 grey--text text--darken-2">
                                Data entry
                            </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="form" v-model="valid">
                                <v-text-field
                                        label="Key"
                                        v-model="key"
                                        :rules="keyRules"
                                ></v-text-field>
                                <v-text-field
                                        label="Value"
                                        v-model="value"
                                        :rules="valueRules"
                                ></v-text-field>
                            </v-form>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': valid, 'red--text': !valid}"
                                    :loading="isSubmitting"
                                    @click="save"
                            >
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex lg6>
                    <b>Data</b>
                    <p>
                        An account can have an arbitrary amount of DataEntries attached to it.
                        Each DataEntry increases the minimum balance needed to be held by the account.
                    </p>
                    <p>
                        DataEntries can be used for application specific things.
                        They are not used by the core Stellar protocol.
                    </p>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-btn info loading flat v-if="!loaded"></v-btn>
                <v-flex xs12 v-if="loaded && items.length > 0">
                    <div class="subheader">DataEntries</div>

                    <v-data-table
                            :headers="headers"
                            :items="items"
                            hide-actions
                            class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td v-text="props.item.key"></td>
                            <td>
                                <span v-text="decode(props.item.value)"></span>
                                <span class="grey--text ml-3" v-text="props.item.value"></span>
                            </td>
                            <td class="text-xs-right">
                                <span class="table-row-detail">
                                    <a href="#" @click.prevent="edit(props.item.key)" class="mr-3">Edit</a>

                                    <v-btn loading flat danger v-if="props.item.isDeleteLoading"></v-btn>
                                    <a v-if="!props.item.isDeleteLoading" href="#" @click.prevent="remove(props.item)" class="red--text">Delete</a>
                                </span>
                            </td>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  import { TransactionBuilder, Operation } from 'stellar-sdk'
  import { StellarServer } from '../../stellar'
  import { flash } from '../../utils'
  import { submitTransaction } from '../../stellar/internal'
  import Vue from 'vue'
  import { forEach } from 'lodash'

  export default {
    metaInfo: () => ({
      title: 'Manage data',
    }),

    data () {
      return {
        loaded: false,
        isSubmitting: false,

        headers: [
          {
            text: 'Key',
            align: 'left',
            sortable: true,
            value: 'key'
          },
          {
            text: 'Value',
            align: 'left',
            sortable: true,
            value: 'value'
          },
          {
            text: '',
            align: 'right',
            sortable: false,
          }
        ],
        dataset: {},
        valid: false,
        key: '',
        keyRules: [(v) => (v.length > 0 && v.length <= 64) || 'Maximum length is 64 characters'],
        value: '',
        valueRules: [(v) => new Buffer(v).length <= 64 || 'Maximum size is 64 bytes'],
      }
    },

    computed: {
      items () {
        let array = []

        _.forEach(this.dataset, function (value, key) {
          array.push({
            key,
            value,
            isDeleteLoading: false,
          })
        })

        return array
      },
    },

    methods: {
      decode (input) {
        return window.atob(input)
      },

      edit (key) {
        this.key = key
        this.value = window.atob(_.filter(this.items, function (i) {
          return i.key === key
        })[0].value)

        window.scrollTo(0, 0)
      },

      remove (item) {
        item.isDeleteLoading = true

        this.submitTx(item.key, null)
          .then(() => {
            item.isDeleteLoading = false

            flash('Data entry deleted', 'success')
          })
      },

      save () {
        if (this.$refs.form.validate()) {
          this.isSubmitting = true

          this.submitTx(this.key, this.value)
            .then((res) => {
              this.isSubmitting = false

              if (res) {
                flash('Data entry updated', 'success')
              }
            })
        }
      },

      fetchData () {
        let vm = this

        vm.loaded = false

        return StellarServer.accounts()
          .accountId(vm.$store.getters.keypair.publicKey())
          .call()
          .then(account => {
            vm.dataset = account.data_attr
            vm.loaded = true

            forEach(vm.dataset, (data) => {
              Vue.set(data, 'isDeleteLoading', false)
            })
          })
          .catch(e => {})
      },

      submitTx (name, value) {
        return submitTransaction('manageData', {name, value})
          .then(() => {
            return this.fetchData()
          })
          .catch((err) => {
            flash(err, 'error')
          })
      },
    },

    created () {
      this.fetchData()
    },
  }
</script>