<template>
    <div>
        <table class="first-padding">
            <tr>
                <td><b>Trustee Account</b></td>
                <td><public-key :value="operation.trustee"></public-key></td>
            </tr>
            <tr>
                <td><b>Trustor Account</b></td>
                <td><public-key :value="operation.trustor"></public-key></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>Asset</b></td>
                <td>
                    <span v-if="operation.asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><public-key :value="operation.asset_issuer"></public-key></td>
            </tr>
            <tr v-if="operation.limit">
                <td><b>Asset Limit</b></td>
                <td><amount :amount="operation.limit"></amount></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>