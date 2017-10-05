<template>
    <div>
        <table class="single-operation">
            <tr>
                <td><b>From</b></td>
                <td><span v-text="operation.from"></span></td>
            </tr>
            <tr>
                <td><b>To</b></td>
                <td><span v-text="operation.to"></span></td>
            </tr>
            <tr>
                <td><b>Amount</b></td>
                <td>
                    <span v-html="amountFormat(operation.amount)"></span>
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