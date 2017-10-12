<template>
    <transition name="fade">
        <div class="error-popup red lighten-1 white--text" v-if="message">
            <h6 v-text="title"></h6>
            <div v-text="message"></div>
            <div @click="hide" class="mt-3"><b>CLOSE</b></div>
        </div>
    </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      title () {
        return this.flash.type === 'error' ? 'Error!' : 'Success!'
      },

      message () {
        return this.flash.message
      },

      ...mapGetters([
        'flash',
      ])
    },

    methods: {
      hide () {
        this.$store.dispatch('removeFlash')
      }
    }
  }
</script>