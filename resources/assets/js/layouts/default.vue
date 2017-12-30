<template>
    <v-app id="frontpage">
        <header class="white">
            <v-container class="px-lg-0">
                <v-layout>
                    <v-flex xs12>
                        <v-toolbar dense class="white front-toolbar">
                            <v-toolbar-title @click="$router.push({name: 'welcome'})">My<span class="blue--text">Stellar</span>.Tools</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-toolbar-side-icon class="hidden-md-and-up" @click="isNavbarOpen = !isNavbarOpen"></v-toolbar-side-icon>
                            <v-toolbar-items class="hidden-sm-and-down">
                                <v-btn flat @click="$router.push({name: 'paper'})">Paper wallet</v-btn>
                                <v-btn flat @click="$router.push({name: 'help'})">Get started</v-btn>
                            </v-toolbar-items>
                        </v-toolbar>

                        <v-expansion-panel class="elevation-0">
                            <v-expansion-panel-content v-model="isNavbarOpen">
                                <div class="mobile-nav">
                                    <ul>
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
  }
</script>
