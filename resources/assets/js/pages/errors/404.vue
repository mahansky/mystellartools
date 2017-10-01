<template>
  <div>
    This is the end... <br>
    <br>
    ...there is just one way to <a @click="$router.go(-1)">go back</a>. <br>
    <br>
    well, there is always a <a @click="$router.push({name:'welcome'})">homepage</a>, right?
  </div>
</template>

<script>
export default {
  name: 'not-found',

  layout: 'default'
}
</script>
