<template>
  <div class="campaign-builder">
    <campaign-card :campaign="campaign"></campaign-card>
  </div>    
</template>
<script>
import campaignCard from '../component/campaignCard.vue'

export default {
  data() {
    return {
      campaign: {
        name: 'Campaign Name',
        typeCode: 'story',
        keywords: [],
        link:''
      }
    }
  },

  components: {
    campaignCard
  }    
}
</script>
<style lang="scss">
.campaign-builder {
  position: relative;
  overflow: auto;
  height: 100%;
}
</style>
