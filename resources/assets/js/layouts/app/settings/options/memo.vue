<template>
    <v-form>
        <v-checkbox label="Enabled?" v-model="enabled" light color="blue" hide-details></v-checkbox>

        <v-layout row v-if="enabled">
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
</template>

<script>
import { Stellar } from '~/stellar'

export default {
  data: (vm) => ({
    enabled: false,
    memoType: 'MEMO_TEXT',
    memoValue: '',
    memoPlaceholder: '',
    memoValueRules: [(v) => {
      let memoError = ''

      try {
        switch (vm.memoType) {
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
  }),

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

      this.save()
    },

    memoValue () {
      this.save()
    },
  },

  methods: {
    save () {
      if (this.enabled && this.memoType && this.memoValue) {
        this.$store.commit('STORE_TRANSACTIONS_MEMO', {
          type: this.memoType,
          value: this.memoValue,
        })
      } else {
        this.$store.commit('REMOVE_TRANSACTIONS_MEMO')
      }
    },
  },

  created () {
    const memo = this.$store.getters.transactionsMemo

    if (memo) {
      this.enabled = true
      this.memoType = memo.type
      this.memoValue = memo.value
    }
  },
}
</script>

