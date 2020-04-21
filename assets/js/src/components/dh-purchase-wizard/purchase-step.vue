<template>
  <div class="dh-wizard-step dh-purchase-step">
    <div class="dh-wizard-step-body">
      <div class="dh-wrapper">
        <div class="dh-wrapper__title">
          Plan
        </div>
        <div class="dh-wrapper__body">
          <div class="dh-plan-info">
            <div class="dh-plan-name">
              {{plan.name}}
            </div>
            <div class="dh-plan-info__divider">
            </div>
            <div class="dh-plan-price">
              ${{plan.price}}
            </div>
          </div>
          <div class="dh-plan-description">
            {{plan.description}}
          </div>
        </div>
      </div>
       <div class="dh-wrapper">
        <div class="dh-wrapper__title">
          Payment
        </div>
        <div class="dh-wrapper__body ">
          <loader v-if="inSourceGet"/>
          <div class="dh-card-info" v-else>
            <div class="dh-payment" v-if="card">
              <div class="dh-payment-card">
                <dh-card-brand-image :type="card.brand"></dh-card-brand-image>
                <div class="dh-payment-card__info">
                  <div class="dh-payment-card__type">
                    {{card.brand}} ••••  ••••  ••••  {{card.last4}}
                  </div>
                  <div class="dh-payment-card__date">
                    Expires on {{String(card.exp_month).padStart(2, '0')}}/{{card.exp_year}}
                  </div>
                </div>
              </div>
            </div>
            <div class="dh-no-payment-card" v-else>
              No card attached to service
            </div>
            <dh-button type="outline" size="small" @click="updateCard">Edit payment card</dh-button>
          </div>
        </div>
      </div>
      <div class="dh-wizard-error" v-if="error">
        {{error}}
      </div>
    </div>
    <div class="el-dialog__footer">
      <dh-button @click.native="backToPlans" type="reset" :disabled="inPurchaseProcess">Back</dh-button>
      <dh-button @click.native="purchasePlan" :loading="inPurchaseProcess">Buy</dh-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import loader from '../dh-loader'
import wizardStep from '../../mixins/wizard/wizard-step'
import dhCardBrandImage from '../dh-card-brand-image'

export default {
  data() {
    return {
      paymentSource: null,
      inSourceGet: true,
      inPurchaseProcess: false,
      error: null
    }
  },

  mixins: [wizardStep],

  components: {
    loader,
    dhCardBrandImage
  },

  computed: {
    plan() {
      const { wizard } = this;

      return wizard.selectedPlan
    },

    card() {
      const { paymentSource } = this;

      return paymentSource && (paymentSource.card || paymentSource.three_d_secure);
    },
  },

  methods: {
    backToPlans() {
      const { setWizardState } = this.wizard;

      setWizardState('Select plan', 'offerStep', { width: '80%'})
    },

    purchasePlan() {
      const { plan } = this;

      this.error = null;
      this.inPurchaseProcess = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/add-subscription`,
        method: 'post',
        data: {
          cartItems: [{
            plan: plan.code,
            quantity: 1
          }]
        }
      }).then(({ data }) => {
        const { success, error } = data.request;
        const { dhAccount } = data.response.body;

        if (success) {
          this.$store.commit('set', { path:'dhAccount', value: dhAccount })
        } else {
          this.error = error.message;
        }
      }).catch(error => {
        const { response } = error;

        if (response && response.data && response.data.request) {
          const { request } = response.data;

          this.error = request.statusMessage;
        } else {
          this.error = 'Server connection problem, try again';
        }

      }).finally(() =>  this.inPurchaseProcess = false);
    },

    updateCard() {
      const { setWizardState } = this.wizard;

      setWizardState('Card info', 'cardUpdateStep', { width: '80%' })
    }
  },

  created() {
    axios({
      url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/stripe/get-source`
    }).then(({ data }) => {
      const { activeSource } = data.response.body;

      this.$nextTick(() => {
        this.inSourceGet = false;
      })

      if (!activeSource) return;

      this.paymentSource = activeSource;
    });
  }
}
</script>

<style lang="scss">
.dh-purchase-step {
  .dh-wrapper {
    background: #FFFFFF;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);
    border-radius: 4px;

    .dh-wrapper__title {
      padding: 16px;
      font-size: 18px;
      line-height: 22px;
      color: #000000;
      border-bottom: 1px solid #E8ECEF;
    }

    .dh-wrapper__body {
      padding: 16px;
    }

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .dh-plan-info {
    display: flex;
    align-items: flex-end;
    font-weight: 500;
    color: #252631;
  }

  .dh-plan-info__divider {
    flex-grow: 1;
    border-bottom: 1px dotted #98A9BC;
    margin: 0 8px;
  }

  .dh-plan-description {
    margin-top: 8px;
    color: #778CA2;
  }

  .dh-card-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dh-payment-card {
    display: flex;
    align-items: center;
    color: #252631;
  }

  .dh-payment-card__info {
    margin-left: 12px;
  }

  .dh-payment-card__type {
    font-weight: 500;
  }
}
</style>
