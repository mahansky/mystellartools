<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex lg12 xl8 offset-xl2>
                        <div class="display-2">Login</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container grid-list-lg class="mt-3">
            <v-layout>
                <v-flex lg12 xl8 offset-xl2>
                    <v-layout wrap row>
                        <v-flex lg4 xs12>
                            <v-radio-group v-model="path" column class="pt-0">
                                <v-radio label="HW Wallet" value="login.hw" color="info"></v-radio>
                                <v-radio label="Public key" value="login.public" color="info"></v-radio>
                                <v-radio label="Secret key" value="login.secret" color="error"></v-radio>
                                <v-radio label="Create account" value="login.create" color="info" class="mt-3"></v-radio>
                            </v-radio-group>
                        </v-flex>
                        <v-flex lg8 xs12>
                            <router-view></router-view>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    export default {
      layout: 'default',

      data () {
        return {
          path: 'login.hw',
        }
      },

      watch: {
        path (val) {
          this.$router.push({name: val})
        },
      },

      created () {
        if (this.$route.name === 'login') {
          if (this.$store.getters.keypair) {
            this.$router.push({name: 'balance'})
          } else {
            this.$router.push({name: this.path})
          }
        } else {
          this.path = this.$route.name
        }
      },
    }
</script>