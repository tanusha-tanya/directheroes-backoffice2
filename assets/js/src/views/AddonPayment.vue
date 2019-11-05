<template>
  <div class="dh-view dh-settings-view">
    <dh-header title="Addon payment"></dh-header>
    <div class="dh-view-content">
      <addon-payment></addon-payment>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

import addonPayment from '../../oldJS/routes/addonPayment'

export default {
  components: {
    dhHeader,
    dhFooter,
    addonPayment
  },
};
</script>

<style lang="scss">
.dh-settings-view {
  .dh-view-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>