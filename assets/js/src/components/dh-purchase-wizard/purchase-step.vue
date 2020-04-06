<template>
  <div class="dh-wizard-step dh-offer-step">
    <div class="dh-wizard-step-body">
      {{plan}}
    </div>
  </div>
</template>

<script>
import wizardStep from '../../mixins/wizard/wizard-step'

export default {
  mixins: [wizardStep],

  computed: {
    plan() {
      const { wizard } = this;

      return wizard.selectedPlan
    }
  }
}
</script>

<style lang="scss">

</style>