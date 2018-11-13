<template>
    <builder-card class="step-card" :style="{top: `${ step.position.y }px`, left: `${ step.position.y }px`}">
      <template slot="header">{{ step.name }}</template>
      <template slot="body">
        Step Card
      </template>
    </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import keywords from "./keywords.vue";

export default {
  components: {
    builderCard,
  },

  props: ['step'],
}
</script>
<style lang="scss">
  div.step-card {
    border-color: #2E9E7B;
    background-color: #2E9E7B;
  }
</style>

