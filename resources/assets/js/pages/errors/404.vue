<template>
  <div>
    Not Found<br>
    <br>
    <a @click="$router.go(-1)">Back</a>
    <br>
    <a @click="$router.push({name:'welcome'})">Homepage</a>
  </div>
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
