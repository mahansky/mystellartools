<template>
    <transition name="fade">
        <v-alert
                v-if="hasMessage"
                :error="type === 'error'"
                :success="type === 'success'"
                v-model="visible"
                class="error-popup"
                dismissible
        >
            {{ message }}
        </v-alert>
    </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data () {
      return {
        visible: true,
      }
    },

    computed: {
      type () {
        return this.flash.type
      },

      message () {
        return this.flash.message
      },

      hasMessage () {
        return !!this.flash.message
      },

      ...mapGetters([
        'flash',
      ])
    },

    watch: {
      hasMessage (v) {
        this.visible = true
      },

      visible (v) {
        if (v === false) {
          this.visible = true
          this.$store.dispatch('removeFlash')
        }
      },
    },

    methods: {
      hide () {
        this.$store.dispatch('removeFlash')
      }
    }
  }
</script>