<template>
   <div class="dh-view dh-live-chat-view">
    <dh-header title="Live chat"></dh-header>
    <div class="dh-view-content">
      <old-live-chat ref="liveChat"></old-live-chat>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import oldLiveChat from '../../oldJS/routes/accountThreadMessages'

export default {
  beforeRouteEnter(to, from, next) {
    next(liveChatComponent => {
      const { isLiveChatInTariff, $router } = liveChatComponent;

      if (isLiveChatInTariff) return

      $router.replace({name: 'accountHome'})
    })
  },

  beforeRouteUpdate(to, from, next) {
    const { liveChat } = this.$refs;

    if (!liveChat) return;

    liveChat.routeUpdate(to, from, next);
  },

  components: {
    dhHeader,
    dhFooter,
    oldLiveChat
  },

  computed: {
    isLiveChatInTariff() {
      const { getTariffParameter } = this;
      const liveChatTariff = getTariffParameter('live_chat')

      return liveChatTariff && liveChatTariff.enabled
    }
  }
}
</script>

<style lang="scss">
.dh-live-chat-view {
  .dh-view-content {
    display: flex;
    padding: 0;
  }
}
</style>