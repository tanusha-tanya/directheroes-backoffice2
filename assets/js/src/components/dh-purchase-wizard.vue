<template>
  <el-dialog
    :visible.sync="isShow"
    :width="width"
    append-to-body
    :title="title"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizard-dialog dh-purchase-wizard"
  >
    <component
      :is="wizardState"
     ></component>
  </el-dialog>
</template>

<script>
import wizardMixin from '../mixins/wizard/wizard'
import offerStep from './dh-purchase-wizard/offer-step'
import purchaseStep from './dh-purchase-wizard/purchase-step'
import cardUpdateStep from './dh-purchase-wizard/card-update-step'

export default {
  data() {
    return {
      tariffs: null,
      selectedPlan: null,
      paymentSource: null,
    }
  },

  mixins: [ wizardMixin ],

  props: [ 'permission' ],

  components: {
    offerStep,
    purchaseStep,
    cardUpdateStep
  },

  created() {
    const { setWizardState } = this;

    setWizardState('Select plan', 'offerStep', { width: '80%'})
  }
}
</script>

<style lang="scss">
div.dh-purchase-wizard {

  .el-dialog {
    max-width: 900px;
  }

  div.dh-wizard-step-body {
    min-height: 250px;
    min-width: 580px;
  }
}
</style>
