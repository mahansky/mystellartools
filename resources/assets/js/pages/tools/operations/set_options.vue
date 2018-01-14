<template>
    <div>
        <table class="first-padding">
            <tr v-if="operation.signer_key">
                <td><b>SIGNER_KEY</b></td>
                <td><public-key :value="operation.signer_key"></public-key></td>
            </tr>
            <tr v-if="operation.signer_weight">
                <td><b>SIGNER_WEIGHT</b></td>
                <td><span v-text="operation.signer_weight"></span></td>
            </tr>
            <tr v-if="operation.master_key_weight">
                <td><b>MASTER_KEY_WEIGHT</b></td>
                <td><span v-text="operation.master_key_weight"></span></td>
            </tr>
            <tr v-if="operation.low_treshold">
                <td><b>LOW_TRESHOLD</b></td>
                <td><span v-text="operation.low_treshold"></span></td>
            </tr>
            <tr v-if="operation.med_treshold">
                <td><b>MED_TRESHOLD</b></td>
                <td><span v-text="operation.med_treshold"></span></td>
            </tr>
            <tr v-if="operation.high_treshold">
                <td><b>HIGH_TRESHOLD</b></td>
                <td><span v-text="operation.high_treshold"></span></td>
            </tr>
            <tr v-if="operation.home_domain">
                <td><b>HOME_DOMAIN</b></td>
                <td><span v-text="operation.home_domain"></span></td>
            </tr>
            <tr v-if="operation.set_flags_s">
                <td><b>SET_FLAGS</b></td>
                <td><span v-text="operation.set_flags_s.join(', ')"></span></td>
            </tr>
            <tr v-if="operation.clear_flags_s">
                <td><b>CLEAR_FLAGS</b></td>
                <td><span v-text="operation.clear_flags_s.join(', ')"></span></td>
            </tr>
            <tr v-if="operation.inflation_dest">
                <td><b>INFLATION_DEST</b></td>
                <td><public-key :value="operation.inflation_dest"></public-key></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>