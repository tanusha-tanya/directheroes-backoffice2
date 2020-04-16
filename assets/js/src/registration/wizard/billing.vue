<template>
  <div class="dh-billing-form">
    <div class="dh-sign-title">
      Billing & payment information
    </div>
    <dh-stripe goal="createPlanSubscription" :plan-code="plan.code" ref="stripeComponent">
      <div class="dh-plan-info">
        You will be charged <span @click="goToPlans">${{plan.price}}</span> now and subscribed to <span @click="goToPlans">{{plan.name}}</span>
      </div>
    </dh-stripe>
    <div class="dh-sign-footer" v-if="stripeComponent && stripeComponent.stripe">
      <span></span>
      <dh-button @click.native="setPaymentInfo" :loading="inCardUpdate">Join now</dh-button>
    </div>
  </div>
</template>

<script>
import dhStripe from '../../components/dh-stripe'
import wizardStep from '../../mixins/wizard/wizard-step'

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
    setPaymentInfo() {
      const { wizard } = this;
      const { submitPayment } = this.stripeComponent;

      this.inCardUpdate = true;

      submitPayment((error) => {
        this.inCardUpdate = false;

        if (error) return;

        window.onbeforeunload = undefined;

        wizard.setWizardState(null, 'thanks');
      })
    },

    goToPlans() {
      const { wizard } = this;

      window.onbeforeunload = undefined;

      wizard.setWizardState(null, 'plans');
    },
  },

  mounted() {
    const { $nextTick } = this;

    $nextTick(() => {
      const { stripeComponent } = this.$refs;

      this.stripeComponent = stripeComponent;
    })
  },

  created() {
    window.onbeforeunload = () => {
      return false
    }
  }
}
</script>

<style lang="scss">
  .dh-billing-form {
    max-width: 1028px;
    min-width: 1028px;
    min-height: 422px;

    .dh-stripe {
      margin-top: 25px;
    }

    .dh-sign-footer {
      padding: 28px 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #E8ECEF;
    }

    .dh-plan-info {
      margin-top: 24px;
      text-align: center;
      font-weight: 500;

      span {
        color: $elementActiveColor;
        cursor: pointer;
      }
    }

    @include  screen-xs {
      max-width: auto;
      min-width: auto;
      min-height: auto;

      .dh-sign-footer {
        padding: 24px 16px;
        margin: 0 -16px;
        flex-direction: column;

        .dh-button {
          width: 100%;
        }
      }
    }
  }
</style>