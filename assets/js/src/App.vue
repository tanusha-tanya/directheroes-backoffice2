<template>
  <div id="app">
    <dh-header></dh-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './sections/header.vue'

export default {
  name: 'app',

  components: {
    'dh-header': Header
  }
}
</script>

<style lang="scss">
</style>
