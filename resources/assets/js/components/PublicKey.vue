<template>
    <div>
        <div class="public-key">
            <pre v-text="value.slice(0, 6)"></pre>
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
                        <v-btn flat icon class="grey--text" @click.stop="info = false"
                               v-tooltip:top="{ html: 'Close' }"
                        >
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-btn flat icon class="blue--text"
                               v-tooltip:top="{ html: 'Add to contacts' }"
                               @click="addToContacts(value)"
                               v-if="isLoggedIn"
                        >
                            <v-icon>person_add</v-icon>
                        </v-btn>
                        <v-btn flat icon class="blue--text"
                               v-tooltip:top="{ html: 'Explore' }"
                               @click="$router.push({name: 'explorer.account', params: {account: value}})"
                        >
                            <v-icon>search</v-icon>
                        </v-btn>
                        <v-btn flat icon class="blue--text" :data-clipboard-text="value" ref="copybtn"
                               v-tooltip:top="{ html: 'Copy' }"
                        >
                            <v-icon>content_copy</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
            <pre v-text="value.slice(50)"></pre>
            <small
                    class="contact-name blue blue--text"
                    v-text="contact"
                    v-if="!hideContactName && contact"
            ></small>
        </div>
    </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import knownAccounts from '~/stellar/known_accounts'
  import { nodes } from '~/stellar/network_nodes'
  import { find } from 'lodash'
  import { events } from '~/utils'

  export default {
    props: {
      value: {
        type: String,
      },
      hideContactName: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      info: false,
      hover: false,
    }),

    computed: {
      isLoggedIn () {
        return !!this.$store.getters.keypair
      },

      contact () {
        let contact = find(this.$store.getters.contacts, {public_key: this.value})

        if (contact) {
          return contact.name
        }

        if (this.isLoggedIn && this.value === this.$store.getters.keypair.publicKey()) {
          return 'Your account'
        }

        if (this.value in knownAccounts) {
          return knownAccounts[this.value].name
        }

        if (this.value in nodes) {
          return nodes[this.value].label
        }

        return null
      },
    },

    methods: {
      addToContacts (publicKey) {
        this.info = false
        
        events.$emit('contacts:add-contact', publicKey)
      },
    },

    mounted () {
      new Clipboard(this.$refs.copybtn.$el)
    },
  }
</script>