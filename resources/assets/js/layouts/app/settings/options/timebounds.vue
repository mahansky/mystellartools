<template>
    <v-form>
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
                        <v-time-picker v-model="time1" autosave></v-time-picker>
                    </v-menu>
                </v-flex>
            </v-layout>

            <v-layout row wrap>
                <v-flex xs6>
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
                        <v-time-picker v-model="time2" autosave></v-time-picker>
                    </v-menu>
                </v-flex>
            </v-layout>
        </template>
    </v-form>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    enabled: false,
    date1: '',
    date1m: false,
    date1r: [v => !!v || 'Date is required'],
    time1: '',
    time1m: false,
    time1r: [v => !!v || 'Time is required'],
    date2: '',
    date2m: false,
    date2r: [
      v => !!v || 'Date is required',
      v => {
        
      },
    ],
    time2: '',
    time2m: false,
    time2r: [
      v => !!v || 'Time is required',
      v => {
        
      },
    ],
  })
}
</script>

