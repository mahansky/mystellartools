<template>
    <div>
        <table class="first-padding">
            <tr>
                <td><b>From</b></td>
                <td><span v-text="operation.from"></span></td>
            </tr>
            <tr>
                <td><b>Amount sent</b></td>
                <td>
                    <amount :amount="operation.source_amount"></amount>
                    <span v-if="operation.source_asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.source_asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.source_asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><span v-text="operation.source_asset_issuer"></span></td>
            </tr>
            <tr v-if="operation.source_max">
                <td><b>Max send amount</b></td>
                <td><amount :amount="operation.source_max"></amount></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>To</b></td>
                <td><span v-text="operation.to"></span></td>
            </tr>
            <tr>
                <td><b>Amount received</b></td>
                <td>
                    <amount :amount="operation.amount"></amount>
                    <span v-if="operation.asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><span v-text="operation.asset_issuer"></span></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>