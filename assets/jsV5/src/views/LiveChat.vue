<template>
   <div class="dh-view dh-live-chat-view">
    <dh-header title="Live chat"></dh-header>
    <div class="dh-view-content">
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
.dh-live-chat-view {

}
</style>