<template>
    <div>
        <h4 class="mb-1 mt-3">
            <span v-html="amountFormat(token.balance)"></span>
            <small>{{ token.asset_code }}</small>
        </h4>
        <table>
            <tr>
                <td class="grey--text text--darken-2">Issuer</td>
                <td><span class="grey--text" v-text="token.asset_issuer"></span></td>
            </tr>
            <tr v-if="token.limit">
                <td class="grey--text text--darken-2">Limit</td>
                <td><span class="grey--text" v-html="amountFormat(token.limit)"></span></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['token'],
  }
</script>