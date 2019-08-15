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

      return linkerChild.elements[0].type
    },

    linkerName() {
      const { linkerType } = this;

      switch (linkerType) {
        case 'rule':
          return 'Triggers'
        case 'action':
          return 'Action'
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
      padding: 8px 8px 8px 14px;
      margin-left: auto;
      color: #5CA6A6;
      background-color: rgba(#5CA6A6, .25);
      border: 1px solid #5CA6A6;
      border-radius: 7px;
    }
  }
</style>