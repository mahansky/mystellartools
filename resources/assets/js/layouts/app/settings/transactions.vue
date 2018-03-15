<template>
    <v-container fluid grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card-text>
                    <b>Global settings for transactions</b>
                    <p>Every transaction that will be executed will use the following parameters.</p>
                </v-card-text>
            </v-flex>
            <v-flex md6>
                <v-card-text>
                    <b>Network</b>
                    <network></network>            
                </v-card-text>
            </v-flex>
            <v-flex>
                <v-card-text>
                    <b>Time bounds</b>
                    <time-bounds></time-bounds>
                </v-card-text>

                <v-card-text>
                    <b>Memo</b>
                    <memo></memo>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import Network from './options/network'
import TimeBounds from './options/timebounds'
import Memo from './options/memo'

export default {
  components: {
    Network,
    TimeBounds,
    Memo,
  },
}
</script>
