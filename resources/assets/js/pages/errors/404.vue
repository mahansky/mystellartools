<template>
    <main>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Page not found</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container>
            <v-layout>
                <v-flex xs12>
                    You can go <a href="#" @click="$router.go(-1)">back</a> or to the
                    <a href="#" @click="$router.push({name:'welcome'})">homepage</a>.
                </v-flex>
            </v-layout>
        </v-container>
    </main>
</template>

<script>
  export default {
    metaInfo: () => ({
      title: 'Not found',
    }),

    name: 'not-found',

    layout: 'default'
  }
</script>
