<template>
  <div class="flow-builder" v-if="entryItem">
    <div class="builder-area" ref="builderArea">
      <step-item
        :class="{'entry-step': !index}"
        v-for="(step, index) in entryItem.steps"
        :key="step.id"
        :step="step"
        :flow-name="!index && entryItem.name"
        @add-step="addStep"
        ></step-item>
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom';
import stepItem from './stepItem';

export default {
  props: ['entryItem'],

  components: {
    stepItem
  },

  methods: {
    addStep(step) {
      const { entryItem } = this;

      entryItem.steps.push(step);
    }
  }
}
</script>

<style lang="scss">
.flow-builder {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
