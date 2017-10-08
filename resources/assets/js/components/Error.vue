<template>
    <transition name="fade">
        <div class="error-popup red lighten-1 white--text" v-if="error" v-text="error"></div>
    </transition>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'error',
      ])
    },

    methods: {
      hide () {
        this.$store.dispatch('removeError')
      }
    }
  }
</script>