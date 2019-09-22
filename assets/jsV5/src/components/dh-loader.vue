<template>
  <div class="dh-loader">
    <img :src="loader" alt="">
  </div>
</template>

<script>
import loader from '../assets/loader.gif'

export default {
  data() {
    return {
      loader
    }
  }
}
</script>

<style lang="scss">
.dh-loader {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
  }
}
</style>