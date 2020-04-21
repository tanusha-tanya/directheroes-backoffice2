<template>
  <div class="dh-wizard-step dh-card-step">
    <dh-stripe goal="updateExistingSubscriptions" ref="stripeComponent"></dh-stripe>
    <div class="el-dialog__footer" v-if="stripeComponent && stripeComponent.stripe">
      <dh-button @click.native="backToPurchase" :disabled="inCardUpdate" type="reset">Back</dh-button>
      <dh-button @click.native="setPaymentInfo" :loading="inCardUpdate">Set card info</dh-button>
    </div>
  </div>
</template>

<script>
import wizardStep from '../../mixins/wizard/wizard-step'
import dhStripe from '../dh-stripe'

export default {
  data() {
    return {
      stripeComponent: null,
      inCardUpdate: false
    }
  },

  components: {
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
    backToPurchase() {
      const { setWizardState } = this.wizard;

      setWizardState('Summary', 'purchaseStep', { width: '45%' })
    },

    setPaymentInfo() {
      const { submitPayment } = this.stripeComponent;

      this.inCardUpdate = true;

      submitPayment((error) => {
        this.inCardUpdate = false;

        if (error) return;

        this.backToPurchase();
      })
    }
  },

  mounted() {
    const { $nextTick } = this;

    $nextTick(() => {
      const { stripeComponent } = this.$refs;

      this.stripeComponent = stripeComponent;
    })
  }
}
</script>

<style lang="scss">
.dh-card-step {
  min-height: 250px;
}
</style>
