<template>
  <builder-card class="step-card" :settings="step.displaySettings" :ref="step.id" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
    <template slot="header">
      {{ step.name || '&nbsp;'}}
    </template>
    <template slot="header-controls">
      <builder-card-dialogs :step="step" @delete-step="$emit('delete-step', step)"></builder-card-dialogs>
    </template>
    <template slot="body">
      <div class="arrow-connect" v-if="$store.state.newPoint && !isParentOfArrow" @click="setArrowConnect"></div>
      <div
        class="element-container"
        v-for="element in elementList"
        :key="element.id"
        >
        <div class="element-title" :ref="element.id">
          <span @click="element.displaySettings.collapsed = !element.displaySettings.collapsed">
            <div class="element-name">{{elementsNames[element.type]}}</div>
            <element-warning :element="element"></element-warning>
            <div class="collapse-toggle" >{{ element.displaySettings.collapsed ? '+' : '-'}}</div>
          </span>
          <div class="remove-element" @click="elementToDelete = element">&times</div>
        </div>
        <div class="element-body" v-if="!element.displaySettings.collapsed">
          <component :is="elementComponents[element.type]" :element="element"></component>
        </div>
      </div>
      <component
        :is="Drop"
        :class="{'add-element': true, 'in-drag':  dragged}"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="dropHandler"
      >+</component>
      <div class="element-container" v-if="listElement">
        <div class="element-title" :ref="listElement.id">
          <span @click="listElement.displaySettings.collapsed = !listElement.displaySettings.collapsed">
            <div class="element-name">{{elementsNames[listElement.type]}}</div>
            <element-warning :element="listElement"></element-warning>
            <div class="collapse-toggle" >{{ listElement.displaySettings.collapsed ? '+' : '-'}}</div>
          </span>
          <div class="remove-element" @click="elementRemove(listElement)">&times</div>
        </div>
        <div class="element-body" v-if="!listElement.displaySettings.collapsed">
          <component :is="elementComponents[listElement.type]" :element="listElement" :tag="tag"></component>
        </div>
      </div>
      <arrow-born :element="step" @connect-arrow="connectArrow" v-if="!listElement && !goToStepElement"></arrow-born>
      <div class="remove-go-to" v-if="!listElement && goToStepElement" @click="removeGoTo">&times</div>
      <confirm-dialog
        v-model="toDeleteElement"
        title="Delete element"
        message="Are you sure you want to delete element?"
        @success="elementRemove"
        >
      </confirm-dialog>
    </template>
  </builder-card>
</template>

<script>
import ObjectId from '../../utils/ObjectId'
import EventBus from '../../utils/event-bus.js'
import builderCard from "./builderCard.vue";
import arrowBorn from '../arrowBorn.vue'
import confirmDialog from '../confirmDialog.vue'
import { Drop } from 'vue-drag-drop';
import builderCardDialogs from '../builderCardDialogs'
import sendImageAction from '../elements/sendImageAction.vue'
import basicDelay from '../elements/basicDelay.vue'
import sendTextAction from '../elements/sendTextAction.vue'
import messageCondition from "../elements/messageCondition.vue";
import messageTextConditionMultiple from '../elements/messageConditionMultiple.vue'
import elementWarning from '../elementWarning.vue'

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay',
        messageTextConditionMultiple: 'List',
        messageCondition: 'Trigger'
      },
      elementComponents: {
        sendImageAction,
        sendTextAction,
        messageCondition,
        messageTextConditionMultiple,
        basicDelay
      },
      dragged: false,
      elementToDelete: null,
      Drop
    }
  },

  components: {
    builderCard,
    builderCardDialogs,
    arrowBorn,
    elementWarning,
    confirmDialog
  },

  props: ['step', 'tag'],

  computed: {
    isParentOfArrow() {
      const { arrows } = this.$store.state
      const connectArrow = arrows.find(arrow => arrow.child == 'toPoint')
      const findChild = childs => {
        if (childs.$refs.hasOwnProperty(connectArrow.parent)) return true

        return (childs.$children || []).find(findChild);
      }

      if (!connectArrow) return;

      return this.step.id == connectArrow.parent || findChild(this)
    },

    listElement() {
      const { elements } = this.step;

      return elements.find(element => element.type === 'messageTextConditionMultiple')
    },

    goToStepElement() {
      const { elements } = this.step;

      return elements.find(element => element.type === 'goToStep')
    },

    elementList() {
      const { elements } = this.step;

      return elements.filter(element => (element.type !== 'goToStep') && (element.type != 'basicDelay' || (!element.displaySettings || element.displaySettings.visible != false)) && element.type != 'messageTextConditionMultiple')
    },

    toDeleteElement: {
      get() {
        return Boolean(this.elementToDelete)
      },

      set(value) {
        this.elementToDelete = value;
      }
    }
  },

  methods: {
    dragEnter(data) {
      const { goToStepElement } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && goToStepElement) ) return;
      this.dragged = true;
    },

    dragLeave(data) {
      const { goToStepElement } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && goToStepElement) ) return;
      this.dragged = false;
    },

    dropHandler(data) {
      const { goToStepElement, listElement, step } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && goToStepElement) ) return;

      const element = JSON.parse(JSON.stringify(data))

      element.id = (new ObjectId).toString();

      this.dragged = false;

      if (listElement) {
        step.elements.splice(step.elements.indexOf(listElement), 0, { ...element, displaySettings: { collapsed: false }})
      } else {
        step.elements.push({ ...element, displaySettings: { collapsed: false }});
      }
    },

    elementRemove() {
      const { elements } = this.step;

      elements.splice(elements.indexOf(this.elementToDelete), 1);
      this.toDeleteElement = null;
    },

    setArrowConnect() {
      const { $store, step } = this;
      const { arrows } = $store.state;

      $store.commit('set', {
        path: 'arrowConnectData',
        value: {
          parent: arrows[arrows.length - 1].parent,
          child: step.id
        }
      })
    },

    connectArrow(value) {
      const { elements } = this.step;

      elements.push({
        type: 'goToStep',
        id: (new ObjectId).toString(),
        value: {
          stepId: value.child
        }
      })

      this.$store.commit('set', {path: 'arrowConnectData', value: null});
    },

    handleMouseDown(position) {
      const cardDetails = {}
      cardDetails.x = position.x
      cardDetails.y = position.y
      cardDetails.id = this.step.id
      EventBus.$emit('builderCard:mousedown', cardDetails)
    },

    handleMouseUp(position) {
      const cardDetails = {}
      cardDetails.x = position.positionX
      cardDetails.y = position.positionY
      cardDetails.id = this.step.id
      EventBus.$emit('builderCard:mouseup', cardDetails)
    },

    removeGoTo() {
      const { elements } = this.step;
      const { goToStepElement } = this;

      elements.splice(elements.indexOf(goToStepElement), 1);
    }
  }
}
</script>
<style lang="scss">
  @keyframes scale-element {
    from {transform: scale(1)}
    50% {transform: scale(1.5)}
    to {transform: scale(1)}
  }
  div.step-card {
    border-color: #2E9E7B;
    background-color: #2E9E7B;
    box-shadow: 0 0 10px #F5F5F5;
    top: 130px;
    left: 450px;

    .builder-card-header {
      font-family: 'AbeatbyKai';
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .builder-card-body {
      min-height: 76px;
      border-color: #E8E8E8;
    }

    .add-element {
      width: 100%;
      color: #DDDDDD;
      border: 1px dashed #DDDDDD;
      border-radius: 4px;
      text-align: center;
      line-height: normal;
      font-size: 24px;
      margin-bottom: 6px;

      &.in-drag {
        border-color: #96B5FF;
        color: #96B5FF;
      }
    }

    .arrow-connect {
      height: 20px;
      width: 20px;
      border: 2px solid #2E9E7B;
      border-radius: 10px;
      position: absolute;
      top: calc(50% - 10px);
      left: -10px;
      background-color: #fff;
      animation: scale-element 1s infinite;

      &:hover {
        background-color: #2E9E7B;
      }
    }

    .arrow-born, .remove-go-to {
      position: absolute;
      z-index: 2;
      right: -7px;
      font-size: 15px;
      top: calc(50% - 11px);

      &:hover {
        border-color: #666;
        color: #666;
      }
    }

    .remove-go-to {
      color: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 15px;
      width: 15px;
      font-size: 16px;
      border-radius: 7px;
      background-color: #fff;
      border: 1px solid #ddd;
      line-height: 10px;
      cursor: pointer;
    }

    .element-container {
      border: 1px solid #DDDDDD;
      border-radius: 4px;
      margin-bottom: 6px;

      .element-title {
        background: linear-gradient(180deg, #FAFAFA 0%, #F2F2F2 98.27%);
        border-bottom: 1px solid #DDDDDD;
        border-radius: 4px 4px 0 0;
        position: relative;
        cursor: pointer;

        .element-name {
          flex-grow: 1;
        }

        span {
          padding: 10px 10px 10px 21px;
          font-family: 'AbeatbyKai';
          font-size: 16px;
          color: #A9A9A9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        &.is-collapsed {
          border-bottom: none;
          border-radius: 4px;
        }

        .remove-element {
          opacity: 0;
          color: #ddd;
          height: 15px;
          width: 15px;
          font-size: 16px;
          position: absolute;
          z-index: 2;
          border-radius: 7px;
          background-color: #fff;
          border: 1px solid #ddd;
          line-height: 16px;
          text-align: center;
          left: calc(50% - 7px);
          top: -7px;
          cursor: pointer;

          &:hover {
            color: #000
          }
        }

        .collapse-toggle {
          margin: 0 11px;
          width: 9px;
        }
      }

      .element-body {
        min-height: 70px;
      }

       &:hover .remove-element{
        opacity: 1;
      }
    }

    .message-condition {
      padding: 10px;
    }

    .remove-step {
      padding: 10px;
      text-transform: uppercase;
      text-align: center;
      cursor: pointer;
      color:#dcdfe6;
      transition: color .3s;

      &:hover {
        color: #000;
      }
    }
  }
</style>
