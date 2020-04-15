<template>
  <div class="dh-plans-form">
    <div class="dh-sign-title">
      Plans
      <div class="dh-close-button" @click="backToBilling()">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 0C10.6458 0 8.45833 0.59375 6.4375 1.78125C4.47917 2.92708 2.92708 4.47917 1.78125 6.4375C0.59375 8.45833 0 10.6458 0 13C0 15.3542 0.59375 17.5417 1.78125 19.5625C2.92708 21.5208 4.47917 23.0729 6.4375 24.2188C8.45833 25.4062 10.6458 26 13 26C15.3542 26 17.5417 25.4062 19.5625 24.2188C21.5208 23.0729 23.0729 21.5208 24.2188 19.5625C25.4062 17.5417 26 15.3542 26 13C26 10.6458 25.4062 8.45833 24.2188 6.4375C23.0729 4.47917 21.5208 2.92708 19.5625 1.78125C17.5417 0.59375 15.3542 0 13 0ZM13 2C15 2 16.8542 2.5 18.5625 3.5C20.2083 4.47917 21.5208 5.79167 22.5 7.4375C23.5 9.14583 24 11 24 13C24 15 23.5 16.8542 22.5 18.5625C21.5208 20.2083 20.2083 21.5208 18.5625 22.5C16.8542 23.5 15 24 13 24C11 24 9.14583 23.5 7.4375 22.5C5.79167 21.5208 4.47917 20.2083 3.5 18.5625C2.5 16.8542 2 15 2 13C2 11 2.5 9.14583 3.5 7.4375C4.47917 5.79167 5.79167 4.47917 7.4375 3.5C9.14583 2.5 11 2 13 2ZM9.21875 7.78125L7.78125 9.21875L11.5625 13L7.78125 16.7812L9.21875 18.2188L13 14.4375L16.7812 18.2188L18.2188 16.7812L14.4375 13L18.2188 9.21875L16.7812 7.78125L13 11.5625L9.21875 7.78125Z" fill="#778CA2"/>
        </svg>
      </div>
    </div>
    <div class="dh-color-text">
      Empower Your Instagram Today
    </div>
    <dh-plans :plans="plans" :selected-plan="selectedPlan" action-text="Choose plan" @select-plan="backToBilling({selectedPlan: $event})"/>
  </div>
</template>

<script>
import dhPlans from '../../components/dh-plans'
import wizardStep from '../../mixins/wizard/wizard-step'

export default {
  components: {
    dhPlans
  },

  mixins: [wizardStep],

  computed: {
    plans() {
      const { plans } = dh;

      return plans.filter(plan => !plan.contactUs);
    },

    selectedPlan() {
      const { selectedPlan } = this.wizard;

      return selectedPlan;
    }
  },


  methods: {
    backToBilling(data = {}) {
      const { wizard } = this;

      wizard.setWizardState(null, 'billing', data);
    }
  }
}
</script>

<style lang="scss">
  .dh-step-plans {
    position: relative;
    width: 80%;
    max-width: 1145px;
  }

  .dh-plans-form {
    .dh-close-button {
      position: absolute;
      right: 24px;
      top: 24px;
    }

    .dh-color-text {
      background: linear-gradient(90deg, #661ACE 30.16%, #2665F9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #661ACE;
      text-align: center;
      font-size: 18px;
      line-height: 22px;
      margin-top: 12px;
    }

    .dh-plan-list {
      padding: 28px;
    }

    @include  screen-xs {
      padding-bottom: 20px;

      .dh-close-button {
        right: 12px;
        top: 12px
      }

      .dh-plan-list {
        padding: 2px;
        width: 100%;
        margin: 0;

        .dh-plan-item {
          width: calc(100% - 2px);
        }

        &:after {
          content: '';
          width: 5px;
          flex-shrink: 0;
        }
      }
    }
  }
</style>