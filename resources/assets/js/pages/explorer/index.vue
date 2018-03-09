<template>
    <v-layout>
        <v-flex lg12>
            index

            <router-link :to="{name: 'explorer.transaction', params: {transaction: 1}}">transaction 1</router-link>
            <router-link :to="{name: 'explorer.account', params: {account: 1}}">account 1</router-link>
            <router-link :to="{name: 'explorer.ledger', params: {ledger: 1}}">ledger 1</router-link>

        </v-flex>
    </v-layout>
</template>

<script>
  export default {
    layout: 'explorer',
  }
</script>