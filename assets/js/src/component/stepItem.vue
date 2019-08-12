<template>
<div :class="[{'step-item': true}, `step-${ stepType }-type`]" @mousedown="blockEvent">
  <div class="step-item-header">
    {{flowName || step.name || '&nbsp;'}}
  </div>
  <component :is="stepType" :elements="step.elements" @add-step="$emit('add-step', $event)"></component>
</div>
</template>

<script>
import action from './elements/action'
import rule from './elements/rule'

export default {
  props: ['step', 'flowName'],

  components: {
    action,
    rule
  },

  computed: {
    stepType() {
      const { step } = this;

      return step.elements.length && step.elements[0].type
    },
  }
}
</script>

<style lang="scss">
  .step-item {
    position: relative;
    width: 246px;
    flex-grow: 1;
    margin: 30px 0;

    &:not(step-item) {
      flex-shrink: 0;
    }

    .step-item-header {
      padding: 10px;
      background-color: #E7E7E7;
      font-size: 13px;
      color: #2D2D2D;
      border-radius: 5px 5px 0 0;
    }

    &.step-action-type {
      .step-item-header {
        color: #F4B109;
        background-color: rgba(#F4B109, .25);
        border: 1px solid #F4B109;
      }
    }

    &.step-rule-type {
      .step-item-header {
        color: #5CA6A6;
        background-color: rgba(#5CA6A6, .25);
        border: 1px solid #5CA6A6;
      }
    }

    &.entry-step {
      border: 2px solid #1DC27C;
      border-radius: 5px;

      .step-item-header {
        border-width: 0 0 1px 0;
      }

      &:after {
        content: 'Start';
        position: absolute;
        bottom: 100%;
        left: -2px;
        background-color: #1DC27C;
        color: #fff;
        padding: 11px 29px;
        border-radius: 4px 4px 0 0;
        font-size: 15px;
      }
    }

  }
</style>
