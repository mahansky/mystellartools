<template>
    <v-app id="frontpage" :class="{landingpage: isLanding, whitebg: isWhiteBackground}">
        <header>
            <v-container class="px-lg-0">
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>
                        <v-toolbar dense class="transparent front-toolbar">
                            <v-toolbar-title class="ml-0 pointer" @click="$router.push({name: 'welcome'})">
                                My<span class="blue--text">Stellar</span>.Tools
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-side-icon class="hidden-md-and-up" @click="isNavbarOpen = !isNavbarOpen"></v-toolbar-side-icon>
                            <v-toolbar-items class="hidden-sm-and-down">
                                <v-btn flat @click="$router.push({name: 'login'})">Wallet</v-btn>
                                <v-btn flat @click="$router.push({name: 'explorer'})">Explorer</v-btn>
                                <v-btn flat @click="$router.push({name: 'txsigner'})">Signer</v-btn>
                                <v-btn flat @click="$router.push({name: 'paper'})">Paper</v-btn>
                                <v-btn flat @click="$router.push({name: 'help'})" icon><v-icon>help</v-icon></v-btn>
                            </v-toolbar-items>
                        </v-toolbar>

                        <v-expansion-panel class="elevation-0">
                            <v-expansion-panel-content v-model="isNavbarOpen">
                                <div class="mobile-nav">
                                    <ul>
                                        <li><router-link :to="{name: 'login'}">Wallet</router-link></li>
                                        <li><router-link :to="{name: 'explorer'}">Explorer</router-link></li>
                                        <li><router-link :to="{name: 'txsigner'}">Transaction signer</router-link></li>
                                        <li><router-link :to="{name: 'paper'}">Paper wallet</router-link></li>
                                        <li><router-link :to="{name: 'help'}">Get started</router-link></li>
                                    </ul>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-flex>
                </v-layout>
            </v-container>
        </header>

        <router-view></router-view>
    </v-app>
</template>

<script>
  export default {
    name: 'default-layout',

    data () {
      return {
        isNavbarOpen: false,
      }
    },

    computed: {
      isLanding () {
        return this.$route.name === 'welcome'
      },

      isWhiteBackground() {
        return ['welcome', 'help', 'txsigner', 'paper', 'claim'].indexOf(this.$route.name)
      },
    }
  }
</script>
