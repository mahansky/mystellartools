<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div class="headline">
                Account <span v-text="$route.params.account"></span>
                <span v-if="loading" :loading="loading" small class="blue--text my-0 mx-0"></span>
            </div>
        </v-flex>
        <v-flex sm12 md7 v-if="account">
            <v-layout row wrap>
                <v-flex md12 lg4>
                    <div class="caption grey--text mb-4 mt-4">BALANCES</div>
                    <v-card>
                        <asset :asset="asset" v-for="asset in balances" :key="asset.asset_issuer"></asset>
                    </v-card>
                </v-flex>
                <v-flex md12 lg4>
                    <div class="caption grey--text mb-4 mt-4">SIGNERS</div>
                    <v-card>
                        <div v-for="signer in account.signers" :key="signer.key">
                            <v-card-text>
                                <public-key :value="signer.public_key" class="mb-2"></public-key>
                                <span class="grey--text">Weight: <b v-text="signer.weight"></b></span>
                            </v-card-text>
                            <v-divider></v-divider>
                        </div>
                    </v-card>
                </v-flex>
                <v-flex md12 lg4>
                    <div class="caption grey--text mb-4 mt-4">DATA</div>
                    <v-card>
                        <v-card-text>
                            <div v-for="(value, key) in account.data_attr">
                                <b v-text="key"></b>
                                <span v-text="convert(value)"></span>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-flex>
        <v-flex md1></v-flex>
        <v-flex sm12 md4 v-if="account" class="break-all">
            <div class="caption grey--text mb-4 mt-4">INFORMATION</div>

            <info :account="account"></info>
        </v-flex>
    </v-layout>
</template>

<script>
  import {StellarServer} from '~/stellar'
  import {flash} from '~/utils'
  import Info from './account/info'
  import Asset from './account/asset'

  export default {
    layout: 'explorer',

    components: {
      Info,
      Asset,
    },

    data: () => ({
      loading: true,
      account: null,
    }),

    computed: {
      balances () {
        return this.account.balances.sort((a, b) => {
          return a.asset_type === 'native' ? -1 : 1;
        })
      },
    },

    methods: {
      convert (val) {
        return window.atob(val)
      },
    },

    created () {
      StellarServer().accounts()
        .accountId(this.$route.params.account)
        .call()
        .then(account => {
          console.log(account)
          this.account = account
        })
        .catch(flash)
        .then(() => {
          this.loading = false
        })
    },
  }
</script>