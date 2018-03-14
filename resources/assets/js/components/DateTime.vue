<template>
    <span v-text="dateTime"></span>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      value: {
        required: true,
      },
    },

    computed: {
      dateTime () {
        return moment(this.value).format('DD.MM.YYYY HH:mm:ss')
      },
    },
  }
</script>