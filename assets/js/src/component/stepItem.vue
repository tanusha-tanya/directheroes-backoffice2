<template>
<div :class="[{'step-item': true}, `step-${ stepType }-type`]" @mousedown="blockEvent">
  <div class="step-item-header">
    <span>
      {{flowName || step.name || '&nbsp;'}}
    </span>
    <div class="step-delete-button" v-if="!isEntry && !hasChilds" @click="$emit('delete-step', step)">
      <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.35 16h2.1V8h-2.1v8zm4.2 0h2.1V8h-2.1v8zm-6.3 2h10.5V6H5.25v12zm2.1-14h6.3V2h-6.3v2zm8.4 0V0H5.25v4H0v2h3.15v14h14.7V6H21V4h-5.25z" fill="currentColor" fill-rule="evenodd"/></svg>
    </div>
  </div>
  <component :is="stepType" :is-entry="isEntry" :elements="step.elements" @add-step="$emit('add-step', $event)"></component>
</div>
</template>

<script>
import action from './elements/action'
import rule from './elements/rule'
import message from './elements/message'
import utils from '../utils'

export default {
  props: ['step', 'flowName'],

  components: {
    message,
    action,
    rule
  },

  computed: {
    stepType() {
      const { step } = this;
      const firstElement = step.elements[0];

      return (firstElement.displaySettings && firstElement.displaySettings.subType) || firstElement.type
    },

    hasChilds() {
      const { elements } = this.step;

      return elements.some(element => {
        const matchElement = utils.getOnMatchElement(element);

        return matchElement && matchElement.onMatch;
      })
    },

    isEntry() {
      const { displaySettings } = this.step;

      return displaySettings && displaySettings.isEntry;
    }
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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step-delete-button {
      color: #A9A9A9;
      width: 13px;
    }

    &.step-action-type {
      .step-item-header {
        color: #F4B109;
        background-color: rgba(#F4B109, .25);
        border: 1px solid #F4B109;
      }
    }

    &.step-message-type {
      .step-item-header {
        color: #2D2D2D;
        background-color: rgba(#E7E7E7, .25);
        border: 1px solid #E7E7E7;
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

    .add-step-button {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #ccc;
      background-color: #fff;
    }

    .element-warning {
      position: absolute;
      right: 20px;
      top: 10px;
    }
  }
</style>
