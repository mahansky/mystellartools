<template>
    <div>
        <div class="public-key">
            <span v-text="value.slice(0, 6)"></span>
            <v-menu
                    offset-x
                    :close-on-content-click="false"
                    :nudge-width="200"
                    v-model="info"
            >
                <v-icon
                        slot="activator"
                        class="pointer"
                        :class="{'blue--text': hover}"
                        @click.stop="info = true"
                        @mouseenter="hover = true"
                        @mouseleave="hover = false"
                >more_horiz</v-icon>
                <v-card>
                    <v-card-text>
                        <div class="body-2 break-all" v-text="value"></div>
                        <div class="body-1" v-text="contact" v-if="contact"></div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat class="grey--text" @click.stop="info = false">Close</v-btn>
                        <v-btn flat :data-clipboard-text="value" ref="copybtn">Copy</v-btn>
                        <!--<v-btn primary flat>Explore</v-btn>-->
                    </v-card-actions>
                </v-card>
            </v-menu>
            <span v-text="value.slice(50)"></span>
            <small class="contact-name blue blue--text" v-text="contact" v-if="contact"></small>
        </div>
    </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import { knownAccounts } from '~/stellar/known_accounts'
  import { find } from 'lodash'

  export default {
    props: ['value'],

    data: () => ({
      info: false,
      hover: false,
    }),

    computed: {
      contact () {
        if (this.value in knownAccounts) {
          return knownAccounts[this.value].name
        }

        let contact = find(this.$store.getters.contacts, {public_key: this.value})

        if (contact) {
          return contact.name
        }

        return null
      },
    },

    mounted () {
      new Clipboard(this.$refs.copybtn.$el)
    },
  }
</script>