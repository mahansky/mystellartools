<template>
    <v-card>
        <v-toolbar style="flex: 0 0 auto;" dark class="blue">
            <v-btn icon @click.native="$emit('close-dialog')" dark>
                <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
            <v-layout row wrap>
                <v-flex lg6 v-if="true">
                    <v-subheader>List of all your accounts</v-subheader>
                    acc1 - G87978797 <br>
                    asdd2 - G098098098 <br>

                    <v-subheader>Add current account to your list</v-subheader>
                    Name of this account: ferrr <br>
                    Add <br>
                </v-flex>
                <v-flex lg6>
                    <template v-if="!unlocked">
                        <v-card-text>
                            <p class="red--text">
                                Use following form to unlock your account (enter your Secret key).
                            </p>
                        </v-card-text>
                    </template>

                    <v-card-text>
                        <b>View another account</b>
                        <p>
                            You can input Public or Secret key. With Secret, account will be automatically unlocked.
                        </p>
                        <v-form v-model="viewForm.valid" ref="viewFormRef">
                            <v-text-field
                                    label="Public or Secret key"
                                    v-model="viewForm.key"
                                    :rules="viewForm.rules"
                            ></v-text-field>
                        </v-form>
                        <v-layout row>
                            <v-spacer></v-spacer>
                            <v-btn
                                    flat
                                    :class="{'blue--text': viewForm.valid, 'red--text': !viewForm.valid}"
                                    @click="view"
                            >
                                View
                            </v-btn>
                        </v-layout>
                    </v-card-text>
                </v-flex>
            </v-layout>
        </v-card-text>

        <div style="flex: 1 1 auto;"></div>
    </v-card>
</template>

<script>
  import { Stellar } from '../../stellar'

  export default {
    data () {
      return {
        viewForm: {
          valid: false,
          key: '',
          rules: [(v) => {
            if (this.viewForm.key.startsWith('G')) {
              try {
                Stellar.Keypair.fromPublicKey(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            } else {
              try {
                Stellar.Keypair.fromSecret(v)

                return true
              } catch (e) {
                return 'Invalid key'
              }
            }
          }],
        },
      }
    },

    computed: {
      unlocked () {
        return this.$store.getters.keypairCanSign
      },
    },

    methods: {
      view () {
        if (this.$refs.viewFormRef.validate()) {
          if (this.viewForm.key.startsWith('G')) {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromPublicKey(this.viewForm.key)
            })
          } else {
            this.$store.dispatch('storeKeypair', {
              keypair: Stellar.Keypair.fromSecret(this.viewForm.key)
            })
          }
        }
      },
    },
  }
</script>