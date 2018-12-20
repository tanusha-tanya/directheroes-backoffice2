<template>
    <builder-card class="campaign-card" :settings="campaignStep.displaySettings">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="header-controls">
        <builder-card-dialogs :step="campaign" :short="true"></builder-card-dialogs>
      </template>
      <template slot="body">
        <message-condition :element="campaignData" mode="list-conditions"></message-condition>
      </template>
    </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import messageCondition from "../elements/messageCondition.vue";
import builderCardDialogs from '../builderCardDialogs'

export default {
  computed: {
    campaignStep() {
      return this.campaign.steps.find(step => step.type == 'campaignEntry')
    },

    campaignData() {
      return this.campaignStep.elements.find(element => element.type === 'messageConditionMultiple')
    },
  },

  components: {
    builderCard,
    messageCondition,
    builderCardDialogs
  },

  props: ['campaign']
}
</script>
<style lang="scss">
  div.campaign-card {
    background-color: #2A4294;
    top: 100px;
    left: 50px;

    .builder-card-body {
      min-height: 140px;
      border-color: #2A4294;
    }
  }
</style>

