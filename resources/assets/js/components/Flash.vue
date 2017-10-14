<template>
    <transition name="fade">
        <v-alert
                v-if="message"
                :error="type === 'error'"
                :success="type === 'success'"
                :value="true"
                v-text="message"
                class="error-popup"
                dismissible
        ></v-alert>
    </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      type () {
        return this.flash.type
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