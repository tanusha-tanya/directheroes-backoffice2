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
      const firstElement = linkerChild.elements[0];

      return (firstElement.type === 'group' && firstElement.displaySettings.subType) || firstElement.type
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

    .linker-user-input-type {
      color: #717FFF;
      background-color: rgba(#717FFF, .25);
      border: 1px solid #717FFF;

      &:after {
        background-image: url(../assets/svgV5/userInput.svg);
      }
    }
  }
</style>