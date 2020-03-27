<template>
  <el-dialog
    :visible.sync="isShow"
    width="800px"
    append-to-body
    :title="title"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizard-dialog dh-purchase-wizard"
  >
    <component
      :is="wizardState"
      @close-wizard="isShow = false"
      @set-title="title = $event"
      ></component>
  </el-dialog>
</template>

<script>
import offerStep from './dh-purchase-wizard/offer-step'

export default {
  data() {
    return {
      title: 'Select plan',
      wizardState: 'offerStep',
      tariffs: null,
      selectedPlan: null,
    }
  },

  props:['value', 'permission'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },
  },

  components: {
    offerStep
  },
}
</script>

<style lang="scss">
div.dh-purchase-wizard {
  div.dh-wizard-step-body {
    min-height: 400px;
  }
}
</style>
