<template>
    <builder-card class="campaign-card" :settings="campaignStep.displaySettings">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="body">
        <message-condition :element="campaignData"></message-condition>
      </template>
    </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import messageCondition from "../elements/messageCondition.vue";

export default {
  computed: {
    campaignStep() {
      return this.campaign.steps.find(step => step.type = 'campaignEntry')
    },

    campaignData() {
      return this.campaignStep.elements.find(element => element.type === 'messageCondition')
    },
  },

  components: {
    builderCard,
    messageCondition
  },

  props: ['campaign'],
}
</script>
<style lang="scss">
  div.campaign-card {
    background-color: #2A4294;

    .builder-card-body {
      min-height: 140px;
      border-color: #2A4294;
    }
  }
</style>

