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
            @blur="save"
        ></v-text-field>

        <v-text-field
            label="Network Passphrase"
            v-model="networkPassphrase"
            :readonly="!isCustom"
            @blur="save"
        ></v-text-field>
    </v-form>
</template>

<script>
import { Stellar, HorizonURL } from '~/stellar'

const MAIN_HORIZON = window.config.horizon_url
const MAIN_PASSPHRASE = Stellar.Networks.PUBLIC
const TESTNET_HORIZON = window.config.horizon_testnet_url
const TESTNET_PASSPHRASE = Stellar.Networks.TESTNET

export default {
  data: () => ({
    valid: false,
    network: 'main',
    horizonUrl: MAIN_HORIZON,
    horizonUrlRules: [v => !!v || 'Horizon URL is required'],
    networkPassphrase: MAIN_PASSPHRASE,
    networkPassphraseRules: [v => !!v || 'Network Passphrase is required']
  }),

  computed: {
    isCustom () {
      return this.network === 'custom'
    }
  },

  watch: {
    network (type) {
      this.fillWithDefaults(type)
    }
  },

  methods: {
    save () {
      if (this.$refs.form.validate()) {
        this.$store.commit('STORE_TRANSACTIONS_NETWORK', {
          type: this.network,
          horizonUrl: this.horizonUrl,
          passphrase: this.networkPassphrase,
        })

        HorizonURL(this.horizonUrl)
        Stellar.Network.use(new Stellar.Network(this.networkPassphrase))
      }
    },

    fillWithDefaults (type) {
      if (type === 'main') {
        this.horizonUrl = MAIN_HORIZON
        this.networkPassphrase = MAIN_PASSPHRASE
        this.save()
      } else if (type === 'testnet') {
        this.horizonUrl = TESTNET_HORIZON
        this.networkPassphrase = TESTNET_PASSPHRASE
        this.save()
      } else {
        this.horizonUrl = ''
        this.networkPassphrase = ''
      }
    }
  },

  mounted () {
    const txSettings = this.$store.getters.transactionsNetwork

    this.network = txSettings.type

    this.fillWithDefaults(this.network)

    if (this.network === 'custom') {
      this.$nextTick(() => {
        this.horizonUrl = txSettings.horizonUrl
        this.networkPassphrase = txSettings.passphrase
      })
    }
  },
}
</script>

