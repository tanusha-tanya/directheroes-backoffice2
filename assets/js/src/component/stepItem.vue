<template>
<div :class="[{'step-item': true}, `step-${ stepType }-type`]">
  <div class="step-item-header">
    {{flowName || stepNames[stepType]}}
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

    stepNames() {
      return {
        action: 'Actions',
        rule: 'Triggers'
      }
    }
  }
}
</script>

<style lang="scss">
  .step-item {
    position: absolute;
    min-height: 90px;
    width: 246px;

    .step-item-header {
      padding: 10px;
      background-color: #E7E7E7;
      font-size: 13px;
      color: #2D2D2D;
      border-radius: 5px 5px 0 0;
    }

    &.entry-step {
      top: calc(20% );
      left: 30px;
      border: 2px solid #1DC27C;
      border-radius: 5px;

      &:before {
        content: 'Start';
        position: absolute;
        bottom: 100%;
        left: calc(50% - 63px);
        background-color: #1DC27C;
        color: #fff;
        padding: 10px 44px 1px;
        border-radius: 3px 3px 0 0;
        font-size: 18px;
      }

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: calc(50% - 63px);
        border-width: 10px 63px 0 63px;
        border-color: #1DC27C transparent transparent transparent;
        border-style: solid;
      }
    }

    &:not(.entry-step) {
      &.step-action-type {
        top: calc(50% - 190px);
        left: 445px;

        .step-item-header {
          color: #F4B109;
          background-color: rgba(#F4B109, .25);
          border: 1px solid #F4B109;
        }
      }
    }
  }
</style>
