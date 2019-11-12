<template>
<div :class="[{'step-item': true, 'step-founded': findAnimation, 'step-to-bind': canConnectAsExist, 'step-not-bind': canConnectAsExist === false }, `step-${ stepType }-type`]" @mousedown.stop="" @transitionend="findAnimation = false">
  <div class="step-item-header" :ref="stepType === 'action' && linker && linker.id">
    <span>
      {{flowName || step.name || '&nbsp;'}}
    </span>
    <span>
      <div class="step-delete-button" v-if="(!isEntry && !hasChilds && stepType !== 'sub-input') || (stepType === 'user-input' && !hasUserInputMatch)" @click="$emit('delete-step', step)">
        <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.35 16h2.1V8h-2.1v8zm4.2 0h2.1V8h-2.1v8zm-6.3 2h10.5V6H5.25v12zm2.1-14h6.3V2h-6.3v2zm8.4 0V0H5.25v4H0v2h3.15v14h14.7V6H21V4h-5.25z" fill="currentColor" fill-rule="evenodd"/></svg>
      </div>
      <add-step-popup :available-list="availableList" @add-step="createStep" v-if="stepType === 'action' && !linker"></add-step-popup>
      <existing-step-popup @find-step="goToStep" @unbind-step="removeLinker" v-if="linker && linker.displaySettings">
        <div class="existing-step-element">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 192.689 192.689" style="enable-background:new 0 0 192.689 192.689;" xml:space="preserve">
            <path d="M188.527,87.755l-83.009-84.2c-4.692-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.54,75.61
              l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179c4.704,4.74,12.319,4.74,17.011,0l82.997-84.2
              C193.05,100.375,193.062,92.327,188.527,87.755z" fill="currentColor"/>
            <path d="M104.315,87.755l-82.997-84.2c-4.704-4.74-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l74.528,75.61
              l-74.54,75.61c-4.704,4.74-4.704,12.439,0,17.179s12.319,4.74,17.011,0l82.997-84.2C108.838,100.375,108.85,92.327,104.315,87.755
              z" fill="currentColor"/>
          </svg>
        </div>
      </existing-step-popup>
    </span>
  </div>
  <div class="existin-step-connector" v-if="canConnectAsExist" @click="bindAsExistStep">
    <div>
      Click<br>
      to<br>
      bind
    </div>
  </div>
  <component :is="stepType" :is-entry="isEntry" :elements="step.elements" :campaign-type="campaignType" @add-step="addElementStep"></component>
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
import existingStepPopup from './existingStepPopup';

export default {
  data() {
    return {
      findAnimation: false
    }
  },

  props: ['steps', 'step', 'flowName', 'stepRowIndex', 'campaignType'],

  components: {
    message,
    action,
    condition,
    trigger,
    addStepPopup,
    userInput,
    subInput,
    existingStepPopup
  },

  computed: {
    stepType() {
      const { step } = this;
      const firstElement = step.elements.find(element => !['group', 'checkpoint'].includes(element.type) || (element.displaySettings && element.displaySettings.subType !== 'settings'));
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

    canConnectAsExist() {
      const { stepRowIndex, $store } = this;
      const { existConnection } = $store.state;

      return existConnection && stepRowIndex > existConnection.stepRowIndex
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

      if (element.type === 'linker') {
        this.$nextTick(() => {
          const { $store, step, stepRowIndex } = this;

          element.id = (new ObjectId).toString(),

          $store.commit('set', { path: 'existConnection', value: {
            step,
            element,
            stepRowIndex
          } })
        });

        return;
      }

      if (element.type === 'group') {
        element.elements.forEach(element => {
          element.id = (new ObjectId).toString()
        })

        if (element.displaySettings.type === 'delay') {
          const { elements } = element;
          const checkpoint = elements.find(element => element.type === 'checkpoint');
          const action = elements.find(element => element.type === 'action');

          action.body.checkpointId = checkpoint.id
        }
      }

      elements.push({
        id: (new ObjectId).toString(),
        type: 'linker',
        target: step.id
      })

      this.$emit('add-step', step);
    },

    goToStep() {
      const { linker, $parent } = this;

      $parent.findEntryStep(linker.target, true)
    },

    bindAsExistStep() {
      const { step, $store } = this;
      const { existConnection } = $store.state;

      console.log(step);

      existConnection.element.target = step.id;
      existConnection.step.elements.push(existConnection.element);

      $store.commit('set', {path: 'existConnection', value: null })
    },

    removeLinker() {
       const { linker, step } = this;

      step.elements.splice(step.elements.indexOf(linker), 1);
    },

    addElementStep(event, parentElement) {
      this.$emit('add-step', event, parentElement);
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
    transition: box-shadow 1s;

    .existin-step-connector {
      position: absolute;
      cursor: pointer;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 2px solid #6A12CB;
      background-color: rgba(#fff, .6);
      color: #6A12CB;
      z-index: 6;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;

      div {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
        animation: scale-element 1s infinite;
      }
    }

    &:not(step-item) {
      flex-shrink: 0;
    }

    &.step-not-bind {
      opacity: .3;
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

    &.step-founded {
      box-shadow: 0 0 20px #9E4CF9;
    }

    .existing-step-element {
      position: absolute;
      right: -14px;
      top: calc(50% - 14px);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #ccc;
      background-color: #fff;
      padding: 6px 5px 6px 7px;
      color:#ccc;

      &:hover {
        color: #6A12CB;
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

    .drag-handler {
      position: absolute;
      left: 2px;
      top: calc(50% + 9px - 5px);
      color: #D8D8D8;
      width: 13px;
      height: 10px;
      opacity: 0;
      background-image: url(../../oldJS/assets/drag.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
