<template>
<div class="dh-view dh-cmpaigns-view">
  <dh-header title="Campaigns"></dh-header>
  <div class="dh-view-content">
    <dh-campaigns></dh-campaigns>
  </div>
  <dh-footer></dh-footer>
</div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaigns from '../components/dh-campaigns'

export default {
  components: {
    dhHeader,
    dhFooter,
    dhCampaigns
  },
}
</script>

<style lang="scss">
.dh-campaigns-view {

}
</style>