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
        <div class="dh-wrapper__body">
          <loader v-if="inSourceGet"/>
          <div class="dh-payment" v-else-if="card">
            <div class="dh-payment-card">
              <div class="dh-payment-card__type-image"></div>
              <div class="dh-payment-card__info">
                {{card}}
              </div>
            </div>
          </div>
          <div class="dh-no-payment-card" v-else>
            No card attached to service
          </div>
          <dh-button type="outline" size="small">Edit payment method</dh-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import loader from '../dh-loader'
import wizardStep from '../../mixins/wizard/wizard-step'

export default {
  data() {
    return {
      paymentSource: null,
      inSourceGet: true,
    }
  },

  mixins: [wizardStep],

  components: {
    loader
  },

  computed: {
    plan() {
      const { wizard } = this;

      return wizard.selectedPlan
    },

    card() {
      const { paymentSource } = this;

      return paymentSource && (paymentSource.card || paymentSource.three_d_secure);
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

      // if (!activeSource) return;

      // this.paymentSource = activeSource;
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
}
</style>
