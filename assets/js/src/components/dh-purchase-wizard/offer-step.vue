<template>
  <div class="dh-wizard-step dh-offer-step">
    <div class="dh-wizard-step-body">
      <loader v-if="inGetPlans"></loader>
      <plans :plans="planList" @select-plan="selectPlan" v-else />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import plansMock from '../../temp/plansMock'
import loader from '../dh-loader'
import plans from '../dh-plans'
import wizardStep from '../../mixins/wizard/wizard-step'

export default {
  data() {
    return {
      planList: null,
      inGetPlans: true,
    }
  },

  mixins: [wizardStep],

  components: {
    loader,
    plans
  },

  methods: {
    selectPlan(plan) {
      const { wizard } = this;

      wizard.selectedPlan = plan;
      wizard.setWizardState('Summary', 'purchaseStep')
    }
  },

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/plans`,
    }).then(({ data }) => {
      const planCodes = ['basic_v2', 'pro_v2', 'hero_v2'];
      const filteredPlans = plansMock.response.body.data.filter(plan => planCodes.includes(plan.code));

      this.planList = ['basic_v2', 'pro_v2', 'hero_v2'].map(planCode => filteredPlans.find(plan => plan.code === planCode));
      this.inGetPlans = false;
    })
  }
}
</script>
