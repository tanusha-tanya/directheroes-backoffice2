<template>
  <el-tooltip class="element-warning" effect="light" :content="warning" v-if="warning">
    <img src="../assets/triangle.svg">
  </el-tooltip>
</template>
<script>
export default {

  computed: {
    warning() {
      const { element } = this;
      let warning = null;

      switch(element.type || element.messageType) {
        case "sendImageAction":
          if (!element.value) {
            warning = 'Image not uploaded'
          }
        break;
        case "sendTextAction":
          if (!element.value.text) {
            warning = 'Enter text'
          }
        break;
        case "any":
          const { onMatch } = element;

          if (!onMatch) {
            warning = 'List element has no target step'
          }
        break;
      }

      return warning
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

