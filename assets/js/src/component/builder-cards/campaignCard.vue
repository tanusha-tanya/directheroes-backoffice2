<template>
    <builder-card class="campaign-card" :settings="campaignStep.displaySettings" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
      <template slot="header">{{ campaign.name }}</template>
      <template slot="header-controls">
        <builder-card-dialogs :step="campaign" :short="true"></builder-card-dialogs>
      </template>
      <template slot="body">
        <message-condition-multiple :element="campaignData" :triggers="triggersList" :tag="tag"></message-condition-multiple>
      </template>
    </builder-card>
</template>
<script>
import EventBus from '../../utils/event-bus.js'
import builderCard from "./builderCard.vue";
import messageConditionMultiple from "../elements/messageConditionMultiple.vue";
import builderCardDialogs from '../builderCardDialogs'

export default {
  computed: {
    campaignStep() {
      return this.campaign.steps.find(step => step.type == 'campaignEntry')
    },

    campaignData() {
      return this.campaignStep.elements.find(element => element.type === 'messageConditionMultiple')
    },

    triggersList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.growthTools;

      return messageTypes;
    }
  },

  components: {
    builderCard,
    messageConditionMultiple,
    builderCardDialogs
  },

  props: ['campaign', 'tag'],

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
    top: 100px;
    left: 50px;

    .builder-card-body {
      min-height: 140px;
      border-color: #2A4294;

      .list-conditions {
        padding: 0;
      }

      .arrow-born, .remove-go-to {
        position: absolute;
        z-index: 2;
        right: -7px;
        font-size: 15px;
        top: calc(50% - 11px);
        transition: transform .3s;
      }

      .arrow-born:hover {
        transform: scale(1.2);
      }

      .remove-go-to {
        color: #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 15px;
        width: 15px;
        font-size: 16px;
        border-radius: 7px;
        background-color: #fff;
        border: 1px solid #ddd;
        line-height: 10px;
        cursor: pointer;

        &:hover {
          border-color: #666;
          color: #666;
        }
      }
    }
  }
</style>

