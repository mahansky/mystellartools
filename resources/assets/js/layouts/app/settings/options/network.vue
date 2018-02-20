<template>
    <v-form v-model="valid" ref="form">
        <v-radio-group v-model="network" :mandatory="true">
            <v-radio color="blue" label="Main (Public network)" value="main"></v-radio>
            <v-radio color="blue" label="Testnet" value="testnet"></v-radio>
            <v-radio color="blue" label="Custom" value="custom"></v-radio>
        </v-radio-group>

        <v-text-field
            label="Horizon URL"
            v-model="horizonUrl"
            :readonly="!isCustom"
        ></v-text-field>

        <v-text-field
            label="Network Passphrase"
            v-model="networkPassphrase"
            :readonly="!isCustom"
        ></v-text-field>
    </v-form>
</template>

<script>
import { Stellar } from '~/stellar'

const MAIN_HORIZON = window.config.horizon_url
const MAIN_PASSPHRASE = Stellar.Networks.PUBLIC
const TESTNET_HORIZON = window.config.horizon_testnet_url
const TESTNET_PASSPHRASE = Stellar.Networks.TESTNET

export default {
  data: () => ({
    valid: false,
    network: 'main',
    horizonUrl: MAIN_HORIZON,
    networkPassphrase: MAIN_PASSPHRASE,
  }),

  computed: {
    isCustom () {
      return this.network === 'custom'
    }
  },

  watch: {
    network (type) {
      if (type === 'main') {
        this.horizonUrl = MAIN_HORIZON
        this.networkPassphrase = MAIN_PASSPHRASE
      } else if (type === 'testnet') {
        this.horizonUrl = TESTNET_HORIZON
        this.networkPassphrase = TESTNET_PASSPHRASE
      } else {
        this.horizonUrl = ''
        this.networkPassphrase = ''
      }
    }
  },
}
</script>

