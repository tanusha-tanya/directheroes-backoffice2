<template>
  <div class="campaign-builder">
    <campaign-card :campaign="campaign"></campaign-card>
    <step-card :step="step" v-for="step in campaign.steps" :key="step.id"></step-card>
  </div>    
</template>
<script>
import campaignCard from '../component/campaignCard.vue'
import stepCard from '../component/stepCard.vue'

export default {
  data() {
    return {
      campaign: {
        name: 'Campaign Name',
        typeCode: 'story',
        keywords: ['Hero', 'Yes'],
        link:'',
        steps:[
          {
            name: 'Step One',
            id: 1,
            content: [],
            position: {
              x: 500, y: 200
            }
          }
        ]
      }
    }
  },

  components: {
    campaignCard,
    stepCard
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
