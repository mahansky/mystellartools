<template>
    <span v-text="publicKey"></span>
</template>

<script>
  export default {
    props: ['public-key'],
  }
</script>