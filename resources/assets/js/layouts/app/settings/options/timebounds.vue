<template>
    <v-form v-model="valid" ref="form">
        <v-checkbox label="Enabled?" v-model="enabled" light color="blue" hide-details></v-checkbox>

        <template v-if="enabled">
            <v-layout row wrap>
                <v-flex xs6>
                    <v-menu
                      lazy
                      :close-on-content-click="false"
                      v-model="date1m"
                      transition="scale-transition"
                      offset-y
                      :nudge-left="40"
                    >
                        <v-text-field
                          slot="activator"
                          label="From date"
                          v-model="date1"
                          prepend-icon="event"
                          readonly
                          hide-details
                        ></v-text-field>
                        <v-date-picker v-model="date1" autosave></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs6>
                    <v-menu
                      lazy
                      :close-on-content-click="false"
                      v-model="time1m"
                      transition="scale-transition"
                      offset-y
                      :nudge-left="40"
                    >
                        <v-text-field
                          slot="activator"
                          label="From time"
                          v-model="time1"
                          prepend-icon="access_time"
                          readonly
                          ref="time1field"
                          @focus="()=>$refs.time1field.blur()"
                          hide-details
                        ></v-text-field>
                        <v-time-picker v-model="time1" autosave format="24hr"></v-time-picker>
                    </v-menu>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs4>
                    <v-menu
                      lazy
                      :close-on-content-click="false"
                      v-model="date2m"
                      transition="scale-transition"
                      offset-y
                      :nudge-left="40"
                    >
                        <v-text-field
                          slot="activator"
                          label="To date"
                          v-model="date2"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker v-model="date2" autosave></v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex xs2 class="text-xs-center">
                    <v-btn flat @click="clear">Unset</v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-menu
                      lazy
                      :close-on-content-click="false"
                      v-model="time2m"
                      transition="scale-transition"
                      offset-y
                      :nudge-left="40"
                    >
                        <v-text-field
                          slot="activator"
                          label="To time"
                          v-model="time2"
                          prepend-icon="access_time"
                          readonly
                          ref="time2field"
                          @focus="()=>$refs.time2field.blur()"
                        ></v-text-field>
                        <v-time-picker v-model="time2" autosave format="24hr"></v-time-picker>
                    </v-menu>
                </v-flex>
            </v-layout>
        </template>
    </v-form>
</template>

<script>
import moment from 'moment'

export default {
  data: (vm) => ({
    valid: false,
    enabled: false,
    date1: '',
    date1m: false,
    date1r: [v => !!v || 'Date is required'],
    time1: '',
    time1m: false,
    time1r: [v => !!v || 'Time is required'],
    date2: '',
    date2m: false,
    date2r: [],
    time2: '',
    time2m: false,
    time2r: [v => (vm.date2 && !!v) || 'Time is required'],
  }),

  computed: {
    fields () {
      return this.date1, this.time1, this.date2, this.time2, this.enabled, Date.now()
    },
  },

  watch: {
    fields () {
      this.save()
    },
  },

  methods: {
    save () {
      if (this.enabled && this.$refs.form.validate()) {
        this.$store.commit('STORE_TRANSACTIONS_TIMEBOUNDS', {
          from: moment(this.date1 + ' ' + this.time1).unix(),
          to: this.date2 ? moment(this.date2 + ' ' + this.time2).unix() : 0,
        })
      } else {
        this.$store.commit('REMOVE_TRANSACTIONS_TIMEBOUNDS')
      }
    },

    clear () {
      this.date2 = ''
      this.time2 = ''
    },
  },

  created () {
    const timeBounds = this.$store.getters.transactionsTimeBounds

    if (timeBounds) {
      this.enabled = true
      this.date1 = moment.unix(timeBounds.from).format('YYYY-MM-DD')
      this.time1 = moment.unix(timeBounds.from).format('HH:mm')
      this.date2 = timeBounds.to === 0 ? '' : moment.unix(timeBounds.to).format('YYYY-MM-DD')
      this.time2 = timeBounds.to === 0 ? '' : moment.unix(timeBounds.to).format('HH:mm')
    }
  },
}
</script>
