<template>
    <div>
        <v-card-text>
            <div class="mb-2">
                <amount class="title" :amount="asset.balance" :suffix="' ' + suffix(asset)"></amount>
            </div>
            <div v-if="asset.asset_type === 'native'" class="grey--text">
                <span>Native</span>
            </div>
            <div v-else  class="grey--text">
                <public-key :value="asset.asset_issuer"></public-key>
                Limit: <span v-text="asset.limit"></span>
            </div>
        </v-card-text>
        <v-divider></v-divider>
    </div>
</template>

<script>
  export default {
    props: ['asset'],

    methods: {
      suffix(asset) {
        return asset.asset_type === 'native' ? 'XLM' : asset.asset_code
      },
    },
  }
</script>