<template>
  <el-tooltip class="element-warning" effect="light" :content="warning" v-if="warning">
    <img src="../assets/triangle.svg">
  </el-tooltip>
</template>
<script>
import utils from '../utils'

export default {

  computed: {
    warning() {
      const { element } = this;

      return utils.campaignElementValidate(element);
    }
  },

  props: ['element']
}
</script>

<style lang="scss">
.element-warning {
  flex-shrink: 0;
  width: 20px
}
</style>

