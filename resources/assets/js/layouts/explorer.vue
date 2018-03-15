<template>
    <v-app id="app" toolbar>
        <v-toolbar class="blue" dark fixed>
            <v-container class="explorer-nav">
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>
                        <v-btn dark icon @click="$router.push({name: 'welcome'})" class="back">
                            <v-icon>arrow_back</v-icon>
                        </v-btn>
                        <v-toolbar-title @click="$router.push({name: 'explorer'})" class="pointer">MyStellar.Tools</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-side-icon class="hidden-md-and-up" @click="isNavbarOpen = !isNavbarOpen"></v-toolbar-side-icon>
                        <v-text-field
                            placeholder="Transaction hash / Account ID / Ledger number"
                            dark
                            hide-details
                            class="hidden-sm-and-down"
                            v-model="input"
                            append-icon="search"
                            :append-icon-cb="search"
                            @keydown.enter.prevent="search"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-toolbar>

        <main>
            <v-expansion-panel class="elevation-0">
                <v-expansion-panel-content v-model="isNavbarOpen">
                    <div class="mobile-nav">
                        <v-container>
                            <v-layout>
                                <v-flex>
                                    <v-text-field
                                            placeholder="Transaction hash / Account ID / Ledger number"
                                            hide-details
                                            class="pt-0"
                                            v-model="input"
                                            append-icon="search"
                                            :append-icon-cb="search"
                                            @keydown.enter.prevent="search"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-container grid-list-lg>
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1 class="pt-3">
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </main>
    </v-app>
</template>

<script>
  import { Stellar } from '~/stellar'

  export default {
    data: () => ({
      isNavbarOpen: false,
      input: '',
    }),

    methods: {
      search (event) {
        if (event !== undefined) {
          event.preventDefault()
        }

        if (Stellar.StrKey.isValidEd25519PublicKey(this.input)) {
          this.$router.push({name: 'explorer.account', params: {account: this.input}})
        } else if (! isNaN(parseInt(this.input))) {
          this.$router.push({name: 'explorer.ledger', params: {ledger: this.input}})
        } else {
          this.$router.push({name: 'explorer.transaction', params: {transaction: this.input}})
        }

        this.input = ''
      },
    },
  }
</script>

<style lang="scss">
    .explorer-nav {
        margin: auto !important;
        padding: 0 16px;

        .layout .flex {
            display: flex;
            align-items: center;
            position: relative;

            @media (min-width: 500px) {
                .back {
                    position: absolute;
                    left: -50px;
                    top: -8px;

                    i {
                        color: hsla(0, 0%, 100%, .7);
                    }
                }
            }

            .toolbar__title {
                margin-left: 0;
            }

            .input-group {
                padding-top: 0px;

                input::placeholder, input:placeholder-shown {
                    color: hsla(0,0%,100%,.7);
                }
            }
        }
    }
</style>