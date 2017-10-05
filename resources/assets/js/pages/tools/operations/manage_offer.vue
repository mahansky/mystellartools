<template>
    <div>
        <table class="single-operation">
            <tr>
                <td><b>Offer ID</b></td>
                <td><span v-text="operation.offer_id"></span></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>Selling</b></td>
                <td>
                    <span v-html="amountFormat(operation.amount)"></span>
                    <span v-if="operation.selling_asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.selling_asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.selling_asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><span v-text="operation.selling_asset_issuer"></span></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>Buying</b></td>
                <td>
                    <span v-if="operation.buying_asset_type === 'native'">XLM</span>
                    <span v-else v-text="operation.buying_asset_code"></span>
                </td>
            </tr>
            <tr v-if="operation.buying_asset_issuer">
                <td><b>Asset Issuer</b></td>
                <td><span v-text="operation.buying_asset_issuer"></span></td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
                <td><b>Price</b></td>
                <td><span v-html="amountFormat(operation.price)"></span></td>
            </tr>
            <tr>
                <td><b>Price N</b></td>
                <td><span v-html="amountFormat(operation.price_r.n)"></span></td>
            </tr>
            <tr>
                <td><b>Price D</b></td>
                <td><span v-html="amountFormat(operation.price_r.d)"></span></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>