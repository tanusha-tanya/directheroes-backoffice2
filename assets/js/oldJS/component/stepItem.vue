<template>
<div
  :class="[{
    'step-item': true,
    'step-founded': findAnimation,
    'step-to-bind': canConnectAsExist,
    'step-is-broken': isInBrokenBranch,
    'step-not-bind': canConnectAsExist === false },
    `step-${ stepType }-type`]"
  @mousedown.stop="" @transitionend="findAnimation = false"
  @mouseover="toggleGlow(true)"
  @mouseout="toggleGlow(false)">
  <div class="step-item-header" :ref="stepType === 'action' && linker && linker.id">
    <span>
      {{flowName || step.name || '&nbsp;'}}
    </span>
    <span>
      <div class="step-delete-button" v-if="(!isEntry && stepType !== 'sub-input') || (stepType === 'user-input' && !hasUserInputMatch)" @click="builder.deleteStep(step)">
        <svg viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.35 16h2.1V8h-2.1v8zm4.2 0h2.1V8h-2.1v8zm-6.3 2h10.5V6H5.25v12zm2.1-14h6.3V2h-6.3v2zm8.4 0V0H5.25v4H0v2h3.15v14h14.7V6H21V4h-5.25z" fill="currentColor" fill-rule="evenodd"/></svg>
      </div>
      <add-step-popup
        :available-list="builder.availableListByElement(step.elements[0])"
        @select="createStep"
        v-if="stepType === 'action'"
        :existing-link="linker"
        :builder="builder"></add-step-popup>
    </span>
  </div>
  <div class="existin-step-connector" v-if="canConnectAsExist" @click="bindAsExistStep">
    <div>
      Click<br>
      to<br>
      bind
    </div>
  </div>
  <component :is="stepType" :is-entry="isEntry" :elements="step.elements" :campaign-type="campaignType" :builder="builder"></component>
  <el-tooltip class="element-warning" effect="light"
    content="Please reattach or delete this branch before you activate this campaign"
    v-if="step.displaySettings && step.displaySettings.hasOwnProperty('columnIndex')">
    <triangle />
  </el-tooltip>
</div>
</template>

<script>
import Vue from 'vue'
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
import triangle from '../assets/triangle.svg'


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
    triangle
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
          let target =  matchElement && (matchElement.target || (matchElement.onMatch && matchElement.onMatch.target) || (matchElement.onFail && matchElement.onFail.target))

          return target;
        }

        if (element.displaySettings && ['followers', 'waitTillCondition'].includes(element.displaySettings.type)) {
          return element.elements.some(actionElement);
        } else {
          return actionElement(utils.getOnMatchElement(element));
        }
      })
    },

    availableList() {
      const { isEntry } = this;
      const { messageTypes } = this.dhAccount.flowBuilderSettings[isEntry ? 'growthTools': 'triggers'];
      const { elements } = this.dhAccount.flowBuilderSettings;

      return elementsPermissions.fromActionStep.concat(messageTypes, elements);
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
      const { builder, step, isInBrokenBranch } = this;
      const { parentOfExistStep } = builder;

      if (!parentOfExistStep || parentOfExistStep.step.id === step.id) return;

      return !(builder.stepsInOneBranch(parentOfExistStep.step.id, step.id) || (isInBrokenBranch && !(step.displaySettings && step.displaySettings.hasOwnProperty('rowIndex'))))
    },

    isInBrokenBranch() {
      const { builder, step } = this;
      /**
       * TODO: Fix it;
       */
      builder.stepInBrokenBranch(step.id)

      return (step.displaySettings && step.displaySettings.hasOwnProperty('rowIndex')) || builder.stepInBrokenBranch(step.id)
    },

    hasUserInputMatch() {
      const { steps } = this;
      const { elements } = this.step;
      const userInputElement = elements.find(element => element.displaySettings.subType === 'user-input');
      const userInputRule = userInputElement.elements.find(element => element.type == 'rule')

      if (userInputRule.onFail) return true;

      const subInputStep = steps.find(step => step.id === userInputRule.onMatch.target);

      return subInputStep.elements.find(element => element.type === 'linker');
    },

    builder() {
      return this.$parent.builder
    },
  },

  methods: {
    createStep(element) {
      const { step, linker, builder } = this;
      const { elements } = step;
      const newLinker ={
        id: (new ObjectId).toString(),
        type: 'linker'
      }

      if (!linker) {
        elements.push(newLinker);
      }

      builder.addStep(linker || newLinker, element);
    },

    goToStep() {
      const { linker, $parent } = this;

      $parent.findEntryStep(linker.target, true)
    },

    bindAsExistStep() {
      const { step, builder } = this;

      builder.connectExistingStep(step)
    },

    removeLinker() {
      const { linker, step } = this;

      step.elements.splice(step.elements.indexOf(linker), 1);
    },

    toggleGlow(status) {
      const { builder, step } = this;
      const arrows = builder.getStepArrows(step.id);

      arrows.forEach(arrow => Vue.set(arrow, 'hover', status))
    }
  },
}
</script>

<style lang="scss">
  .step-item {
    position: relative;
    width: 246px;
    flex-grow: 1;
    margin: 30px 0;
    transition: box-shadow 1s;
    background-color: #fff;

    & > .element-warning {
      pointer-events: all;
      width: 60px;
      top: calc(50% - 30px) !important;
      right: calc(50% - 30px) !important;
      z-index: 1;
    }

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
      pointer-events: all;

      div {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 2px;
      //   animation: scale-element 1s infinite;
      }
    }

    &:not(step-item) {
      flex-shrink: 0;
    }

    &.step-not-bind {
      opacity: .3;
    }

    &.step-is-broken {
      opacity: .7;
      pointer-events: none;
      filter: grayscale(.5);

      .step-delete-button {
        pointer-events: all;
      }
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
      right: -14px;
      top: calc(50% - 14px);
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
