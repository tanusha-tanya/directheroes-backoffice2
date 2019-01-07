<template>
    <builder-card class="campaign-card" :settings="campaignStep.displaySettings" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
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
import EventBus from '../../utils/event-bus.js'
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

  props: ['campaign'],

  methods: {
    handleMouseDown(position) {
      const cardDetails = {}
      cardDetails.x = position.x
      cardDetails.y = position.y
      cardDetails.id = this.campaignStep.id
      EventBus.$emit('builderCard:mousedown', cardDetails)
    },

    handleMouseUp(position) {
      const cardDetails = {}
      cardDetails.x = position.positionX
      cardDetails.y = position.positionY
      cardDetails.id = this.campaignStep.id
      EventBus.$emit('builderCard:mouseup', cardDetails)
    }
  }

}
</script>
<style lang="scss">
  div.campaign-card {
    background-color: #2A4294;
    top: calc(50% + 140px);
    left: calc(50% + 30px);

    .builder-card-body {
      min-height: 140px;
      border-color: #2A4294;
    }
  }
</style>

