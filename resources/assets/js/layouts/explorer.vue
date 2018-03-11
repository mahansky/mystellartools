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
                        <v-text-field
                            placeholder="Transaction hash / Account ID / Ledger number"
                            dark
                            hide-details
                            append-icon="search"
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-toolbar>

        <main>
            <v-container>
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>
                        <router-view></router-view>
                    </v-flex>
                </v-layout>
            </v-container>
        </main>
    </v-app>
</template>

<script>
  export default {}
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