<template>
  <el-dialog
    :visible.sync="isShow"
    width="554px"
    append-to-body
    :title="title"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    class="dh-wizard-dialog"
  >
    <component
      :is="wizardState"
      @close-wizard="isShow = false"
      @set-title="title = $event"
      ></component>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import offerStep from './dh-purchase-wizard/offer-step'

export default {
  data() {
    return {
      title: 'Select plan',
      wizardState: 'offerStep',
      tariffs: null,
    }
  },

  props:['value'],

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

  created() {
    axios({
      url: `${ dh.apiUrl }/api/1.0.0/plans`,
    }).then(({ data }) => {
      console.log(data);

    })
  }
}
</script>

<style lang="scss">

</style>
