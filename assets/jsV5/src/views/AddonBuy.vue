<template>
  <div class="dh-view dh-settings-view">
    <dh-header title="Addon buy"></dh-header>
    <div class="dh-view-content">
      <addon-buy></addon-buy>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'

import addonBuy from '../../oldJS/routes/addonBuy'

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