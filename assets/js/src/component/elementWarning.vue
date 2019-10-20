<template>
  <el-tooltip class="element-warning" effect="light" :content="warning" v-if="warning">
    <triangle />
  </el-tooltip>
</template>
<script>
import utils from '../utils'
import triangle from '../assets/triangle.svg'

export default {
  components: {
    triangle
  },

  computed: {
    warning() {
      const { element, isEntry } = this;

      return utils.campaignElementValidate(element, isEntry);
    }
  },

  props: ['element', 'isEntry']
}
</script>

<style lang="scss">
.element-warning {
  flex-shrink: 0;
  width: 14px
}
</style>

