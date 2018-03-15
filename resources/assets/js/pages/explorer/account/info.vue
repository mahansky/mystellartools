<template>
    <v-layout row wrap>
        <v-flex xs12>
            <div class="info-block">
                <b>Account ID</b>
                <code v-text="account.id"></code>
            </div>
        </v-flex>
        <v-flex xs12 md6>
            <div class="info-block">
                <b>Sequence</b>
                <span v-text="account.sequence"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6>
            <div class="info-block">
                <b>Subentry Count</b>
                <span v-text="account.subentry_count"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6 v-if="account.inflation_destination">
            <div class="info-block">
                <b>Inflation Destination</b>
                <public-key :value="account.inflation_destination"></public-key>
            </div>
        </v-flex>
        <v-flex xs12 md6 v-if="account.home_domain">
            <div class="info-block">
                <b>Home Domain</b>
                <span v-text="account.home_domain"></span>
            </div>
        </v-flex>
        <v-flex xs12 class="mb-3">
            <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 md6>
            <div class="info-block">
                <b>Low Threshold</b>
                <span v-text="account.thresholds.low_threshold"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6>
            <div class="info-block">
                <b>Medium Threshold</b>
                <span v-text="account.thresholds.med_threshold"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6>
            <div class="info-block">
                <b>High Threshold</b>
                <span v-text="account.thresholds.high_threshold"></span>
            </div>
        </v-flex>
        <v-flex xs12 class="mb-3">
            <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 md6 v-if="account.flags.auth_required !== undefined">
            <div class="info-block">
                <b>Auth Required</b>
                <span v-text="account.flags.auth_required.toString().toUpperCase()"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6 v-if="account.flags.auth_revocable !== undefined">
            <div class="info-block">
                <b>Auth Revocable</b>
                <span v-text="account.flags.auth_revocable.toString().toUpperCase()"></span>
            </div>
        </v-flex>
        <v-flex xs12 md6 v-if="account.flags.auth_immutable !== undefined">
            <div class="info-block">
                <b>Auth Immutable</b>
                <span v-text="account.flags.auth_immutable.toString().toUpperCase()"></span>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
      props: ['account'],
    }
</script>