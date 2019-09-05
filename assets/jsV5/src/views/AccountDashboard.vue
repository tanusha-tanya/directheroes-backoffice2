<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-dashboard-ig-account">

      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

export default {
  components: {
    dhHeader,
    dhFooter,
  },
}
</script>

<style lang="scss">
.dh-dashboard-view {
  .dh-dashboard-ig-account {

  }
}
</style>