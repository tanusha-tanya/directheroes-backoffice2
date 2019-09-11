<template>
<div :class="[{'step-item': true}, `step-${ stepType }-type`]" @mousedown="blockEvent">
  <div class="step-item-header" :ref="stepType === 'action' && linker && linker.id">
    <span>
      {{flowName || step.name || '&nbsp;'}}
    </span>
    <span>
      <div class="step-delete-button" v-if="(!isEntry && !hasChilds && stepType !== 'sub-input') || (stepType === 'user-input' && !hasUserInputMatch)" @click="$emit('delete-step', step)">
        <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.35 16h2.1V8h-2.1v8zm4.2 0h2.1V8h-2.1v8zm-6.3 2h10.5V6H5.25v12zm2.1-14h6.3V2h-6.3v2zm8.4 0V0H5.25v4H0v2h3.15v14h14.7V6H21V4h-5.25z" fill="currentColor" fill-rule="evenodd"/></svg>
      </div>
      <add-step-popup :available-list="availableList" @add-step="createStep" v-if="stepType === 'action' && !linker"></add-step-popup>
    </span>
  </div>
  <component :is="stepType" :is-entry="isEntry" :elements="step.elements" @add-step="$emit('add-step', $event)"></component>
</div>
</template>

<script>
import elementsPermissions from '../elements/permissions'
import action from './elements/action'
import condition from './elements/condition'
import trigger from './elements/trigger'
import message from './elements/message'
import userInput from './elements/userInput'
import subInput from './elements/subInput'
import utils from '../utils'
import ObjectId from '../utils/ObjectId';
import addStepPopup from './addStepPopup';

export default {
  props: ['steps', 'step', 'flowName'],

  components: {
    message,
    action,
    condition,
    trigger,
    addStepPopup,
    userInput,
    subInput
  },

  computed: {
    stepType() {
      const { step } = this;
      const firstElement = step.elements.find(element => element.type !== 'group' || element.displaySettings.subType !== 'settings');
      const { displaySettings } = firstElement;

      return (displaySettings && displaySettings.subType) || firstElement.type
    },

    hasChilds() {
      const { elements } = this.step;

      return elements.some(element => {
        const actionElement = (matchElement) => {
          const target =  matchElement && (matchElement.target || (matchElement.onMatch && matchElement.onMatch.target))

          return target;
        }

        if (element.displaySettings && element.displaySettings.type === 'followers') {
          return element.elements.some(actionElement);
        } else {
          return actionElement(utils.getOnMatchElement(element));
        }
      })
    },

    availableList() {
      const { isEntry } = this;
      const { messageTypes } = this.dhAccount.flowBuilderSettings[isEntry ? 'growthTools': 'triggers'];

      return elementsPermissions.fromActionStep.concat(messageTypes);
    },

    isEntry() {
      const { displaySettings } = this.step;

      return displaySettings && displaySettings.isEntry;
    },

    linker() {
      const { elements } = this.step;

      return elements.find(element => element.type === 'linker');
    },

    hasUserInputMatch() {
      const { steps } = this;
      const { elements } = this.step;
      const userInputElement = elements.find(element => element.displaySettings.subType === 'user-input');
      const userInputRule = userInputElement.elements.find(element => element.type == 'rule')

      if (userInputRule.onFail) return true;

      const subInputStep = steps.find(step => step.id === userInputRule.onMatch.target);

      return subInputStep.elements.find(element => element.type === 'linker');
    }
  },

  methods: {
    createStep(element) {
      const { elements } = this.step;
      const step = {
        id: (new ObjectId).toString(),
        elements: [
          {
            id: (new ObjectId).toString(),
            ...element
          }
        ]
      }

      if (element.type === 'group') {
        element.elements.forEach(element => {
          element.id = (new ObjectId).toString()
        })

        if (element.displaySettings.type === 'delay') {
          const { elements } = element;
          const checkpoint = elements.find(element => element.type === 'checkpoint');
          const action = elements.find(element => element.type === 'action');

          action.checkpointId = checkpoint.id
        }
      }

      elements.push({
        id: (new ObjectId).toString(),
        type: 'linker',
        target: step.id
      })

      this.$emit('add-step', step);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }

    .add-step-button {
      position: absolute;
      right: -14px;
      top: calc(50% - 14px);

      &:after {
        content: '';
        position: absolute;
        top: calc(50% - 1px);
        left: calc(50% - 7px);
        height: 2px;
        background-color: #ccc;
        width: 14px;
      }

      &:before {
        content: '';
        position: absolute;
        top: calc(50% - 7px);
        left: calc(50% - 1px);
        height: 14px;
        background-color: #ccc;
        width: 2px;
      }

      &:hover {
        &:after, &:before {
          background-color: #6A12CB;
        }
      }
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

      .step-delete-button {
        margin-right: 10px;
      }
    }

    &.step-message-type {
      .step-item-header {
        color: #2D2D2D;
        background-color: rgba(#E7E7E7, .25);
        border: 1px solid #E7E7E7;
      }
    }

    &.step-trigger-type {
      .step-item-header {
        color: #5CA6A6;
        background-color: rgba(#5CA6A6, .25);
        border: 1px solid #5CA6A6;
      }
    }

    &.step-condition-type {
      .step-item-header {
        color:#FF9B71;
        background-color: rgba(#FF9B71, .25);
        border: 1px solid #FF9B71;
      }
    }

    &.step-user-input-type, &.step-sub-input-type {
      .step-item-header {
        color:#717FFF;
        background-color: rgba(#717FFF, .25);
        border: 1px solid #717FFF;
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
