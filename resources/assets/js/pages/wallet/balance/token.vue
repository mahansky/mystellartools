<template>
    <div>
        <h4 class="mb-1 mt-0">
            <amount :amount="token.balance"></amount>
            <small v-text="token.asset_code"></small>
        </h4>
        <table class="mb-3">
            <tr>
                <td class="grey--text text--darken-2">Issuer</td>
                <td><public-key class="grey--text" :value="token.asset_issuer"></public-key></td>
            </tr>
            <tr v-if="token.limit">
                <td class="grey--text text--darken-2">Limit</td>
                <td><amount :amount="token.limit" class="grey--text"></amount></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['token'],
  }
</script>