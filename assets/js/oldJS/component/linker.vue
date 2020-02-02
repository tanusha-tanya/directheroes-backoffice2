<template>
  <div class="linker" :ref="linker.id">
    <div :class="[{'linker-item': true}, `linker-${ linkerType }-type`]">
      {{linkerName}}
    </div>
  </div>
</template>

<script>
export default {
  props:['linker'],

  computed: {
    linkerChild() {
      const { linker } = this;
      const { currentAccountData } = this.$store.state;
      const { campaignId } = this.$route.params;
      const campaign = currentAccountData.campaigns.find(campaign => campaign.id === campaignId)

      return campaign.steps.find(step => step.id === linker.target);
    },

    linkerType() {
      const { linkerChild } = this;

      if (!linkerChild) return;

      const firstElement = linkerChild.elements.find(element => !['checkpoint'].includes(element.type) || (element.displaySettings && element.displaySettings.subType !== 'settings'));

      return firstElement.displaySettings.subType || firstElement.type
    },

    linkerName() {
      const { linkerType } = this;

      switch (linkerType) {
        case 'trigger':
          return 'Triggers'
        case 'action':
          return 'Action'
        case 'user-input':
          return 'User Input'
        case 'condition':
          return 'Condition'
        case 'message':
          return 'Message'
      }
    },
  }
}
</script>

<style lang="scss">
  .linker {
    width: 100%;
    padding: 19px;
    display: flex;
    justify-content: flex-end;

    .linker-item {
      padding: 5px 8px 6px 14px;
      margin-left: auto;
      display: flex;
      align-items: center;
      border-radius: 7px;

      &:after {
        content: '';
        width: 14px;
        height: 14px;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        margin-left: 5px;
      }
    }

    .linker-trigger-type {
      color: #5CA6A6;
      background-color: rgba(#5CA6A6, .25);
      border: 1px solid #5CA6A6;

      &:after {
        background-image: url(../assets/v5/triggers.png);
      }
    }

    .linker-action-type {
      color: #F4B109;
      background-color: rgba(#F4B109, .25);
      border: 1px solid #F4B109;

      &:after {
        background-image: url(../assets/v5/actions.png);
      }
    }

    .linker-message-type {
      color: #6A12CB;
      background-color: rgba(#6A12CB, .25);
      border: 1px solid #6A12CB;

      &:after {
        background-image: url(../assets/v5/messages.png);
      }
    }

    .linker-user-input-type {
      color: #717FFF;
      background-color: rgba(#717FFF, .25);
      border: 1px solid #717FFF;

      &:after {
        background-image: url(../assets/svgV5/userInput.svg);
      }
    }

    .linker-condition-type {
      color: #FF9B71;
      background-color: rgba(#FF9B71, .25);
      border: 1px solid #FF9B71;

      &:after {
        background-image: url(../assets/v5/conditions.png);
      }
    }
  }
</style>