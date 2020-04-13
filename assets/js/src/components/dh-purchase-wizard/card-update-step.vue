<template>
  <div class="dh-wizard-step dh-card-step">
    <dh-stripe :goal="plan.code || 'updateExistingSubscriptions'"></dh-stripe>
  </div>
</template>

<script>
import loader from '../dh-loader'
import wizardStep from '../../mixins/wizard/wizard-step'
import dhStripe from '../dh-stripe'

export default {
  components: {
    loader,
    dhStripe
  },

  mixins: [wizardStep],

  computed: {
    plan() {
      const { wizard } = this;

      return wizard.selectedPlan
    },
  },

  methods: {

  }
}
</script>

<style lang="scss">
.dh-card-step {

}
</style>
