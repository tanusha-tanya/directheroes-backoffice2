<template>
  <div class="dh-view dh-settings-view">
    <dh-header title="Affilate"></dh-header>
    <div class="dh-view-content">

    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

import addonBuy from '../../../js/src/routes/addonBuy'

export default {
  components: {
    dhHeader,
    dhFooter,
    addonBuy
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

  .buy-extra-account {
    background-color: $sectionBG;
    border-radius: 4px;
    display: flex;
  }
}
</style>