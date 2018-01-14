<template>
    <div>
        <table class="first-padding">
            <tr>
                <td><b>From</b></td>
                <td><public-key :value="operation.from"></public-key></td>
            </tr>
            <tr>
                <td><b>To</b></td>
                <td><public-key :value="operation.to"></public-key></td>
            </tr>
            <tr>
                <td><b>Amount</b></td>
                <td>
                    <amount :amount="operation.amount"></amount>
                    <span v-if="operation.asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><public-key :value="operation.asset_issuer"></public-key></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>