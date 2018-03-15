<template>
    <div>
        <v-card-text>
            <public-key :value="signer.public_key" class="mb-2"></public-key>
            <span class="grey--text">Weight: <b v-text="signer.weight"></b></span>
        </v-card-text>
        <v-divider></v-divider>
    </div>
</template>

<script>
  export default {
    props: ['signer'],
  }
</script>