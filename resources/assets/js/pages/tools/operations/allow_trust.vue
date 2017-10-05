<template>
    <div>
        <table class="single-operation">
            <tr>
                <td><b>Trustee Account</b></td>
                <td><span v-text="operation.trustee"></span></td>
            </tr>
            <tr>
                <td><b>Trustor Account</b></td>
                <td><span v-text="operation.trustor"></span></td>
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
                <td><span v-text="operation.asset_issuer"></span></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>Authorize</b></td>
                <td><span v-text="operation.authorize.toString().toUpperCase()"></span></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>