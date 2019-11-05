<template>
  <builder-card :scale="scale" :deltaPosition="deltaPosition" class="step-card" :settings="step.displaySettings" :ref="step.id" @mousedown="handleMouseDown" @mouseup="handleMouseUp">
    <template slot="header">
      {{ step.name || '&nbsp;'}}
    </template>
    <template slot="header-controls">
      <element-warning :element="step"></element-warning>
      <builder-card-dialogs :step="step" @delete-step="$emit('delete-step', step)"></builder-card-dialogs>
    </template>
    <template slot="body">
      <div class="arrow-connect" v-if="$store.state.newPoint && !isParentOfArrow" @click="setArrowConnect"></div>
      <draggable :list="elementList" handle=".drag-handler" @change="replaceElements">
        <div
          class="element-container"
          v-for="element in elementList"
          :key="element.id"
          >
          <div class="element-title" :ref="element.id">
            <span @click="element.displaySettings.collapsed = !element.displaySettings.collapsed">
              <div class="drag-handler" @click.prevent>
                <svg viewBox="0 0 380 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <path d="M160,153.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V153.3z" fill="currentColor"/>
                  <path d="M288,153.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V153.3z" fill="currentColor"/>
                  <path d="M160,281.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V281.3z" fill="currentColor"/>
                  <path d="M288,281.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V281.3z" fill="currentColor"/>
                  <path d="M160,409.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V409.3z" fill="currentColor"/>
                  <path d="M288,409.3c0,3.7-3,6.7-6.7,6.7h-50.5c-3.7,0-6.7-3-6.7-6.7v-50.5c0-3.7,3-6.7,6.7-6.7h50.5c3.7,0,6.7,3,6.7,6.7V409.3z" fill="currentColor"/>
                </svg>
              </div>
              <div class="element-name">{{elementsNames[element.devType || element.type]}}</div>
              <element-warning :element="element"></element-warning>
              <div class="collapse-toggle" >{{ element.displaySettings.collapsed ? '+' : '-'}}</div>
            </span>
            <div class="remove-element" @click="elementToDelete = element">&times</div>
          </div>
          <div class="element-body" v-if="!element.displaySettings.collapsed">
            <component :is="elementComponents[element.devType || element.type]" :element="element"></component>
          </div>
        </div>
      </draggable>
      <component
        :is="Drop"
        :class="{'add-element': true, 'in-drag':  dragged}"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="dropHandler"
      >Drop elements here</component>
      <div class="element-container" v-if="triggerElement">
        <div class="element-title" :ref="triggerElement.id">
          <span @click="triggerElement.displaySettings.collapsed = !triggerElement.displaySettings.collapsed">
            <div class="element-name">{{elementsNames[triggerElement.type]}}</div>
            <element-warning :element="triggerElement"></element-warning>
            <div class="collapse-toggle" >{{ triggerElement.displaySettings.collapsed ? '+' : '-'}}</div>
          </span>
          <div class="remove-element" @click="elementToDelete = triggerElement">&times</div>
        </div>
        <div class="element-body" v-if="!triggerElement.displaySettings.collapsed">
          <component :is="elementComponents[triggerElement.type]" :element="triggerElement" :tag="tag" :triggers="triggersList" list-name="List"></component>
        </div>
      </div>
      <arrow-born :element="step" @connect-arrow="connectArrow" v-if="!triggerElement && !goToStepElement"></arrow-born>
      <div class="remove-go-to" v-if="!triggerElement && goToStepElement" @click="removeGoTo">&times</div>
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
import draggable from 'vuedraggable'
import ObjectId from '../../utils/ObjectId'
import EventBus from '../../utils/event-bus.js'
import builderCard from "./builderCard.vue";
import arrowBorn from '../arrowBorn.vue'
import confirmDialog from '../confirmDialog.vue'
import { Drop } from 'vue-drag-drop';
import builderCardDialogs from '../builderCardDialogs'
import sendImageAction from '../elements/sendImageAction.vue'
import callWebhookAction from '../elements/callWebhookAction.vue'
import subscriptionControl from '../elements/subscriptionControl.vue'
import basicDelay from '../elements/basicDelay.vue'
import sendTextAction from '../elements/sendTextAction.vue'
import messageCondition from "../elements/messageCondition.vue";
import manualElement from "../elements/manualElement.vue";
import messageConditionMultiple from "../elements/messageConditionMultiple.vue";
import elementWarning from '../elementWarning.vue'

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay',
        messageConditionMultiple: 'Triggers',
        subscriptionControl: 'Subscription',
        manualElement: 'Manual',
        callWebhookAction: 'Zapier'
      },
      elementComponents: {
        sendImageAction,
        sendTextAction,
        messageConditionMultiple,
        basicDelay,
        subscriptionControl,
        manualElement,
        callWebhookAction
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
    confirmDialog,
    draggable,
  },

  props: ['step', 'tag', 'scale', 'deltaPosition'],

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

    triggerElement() {
      const { elements } = this.step;

      return elements.find(element => element.type === 'messageConditionMultiple')
    },

    goToStepElement() {
      const { elements } = this.step;

      return elements.find(element => element.type === 'goToStep')
    },

    triggersList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return messageTypes;
    },

    elementList() {
      const { elements } = this.step;

      return elements.filter(element => (element.type !== 'goToStep') && (element.type != 'basicDelay' || (!element.displaySettings || element.displaySettings.visible != false)) && element.type != 'messageConditionMultiple')
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

      if (data.type == "regular" || (data.type == 'messageConditionMultiple' && goToStepElement) ) return;
      this.dragged = true;
    },

    dragLeave(data) {
      const { goToStepElement } = this;

      if (data.type == "regular" || (data.type == 'messageConditionMultiple' && goToStepElement) ) return;
      this.dragged = false;
    },

    dropHandler(data) {
      const { goToStepElement, triggerElement, step } = this;

      if (data.type == "regular" || (data.type == 'messageConditionMultiple' && goToStepElement) ) return;

      const element = JSON.parse(JSON.stringify(data))

      element.id = (new ObjectId).toString();

      this.dragged = false;

      if (triggerElement) {
        step.elements.splice(step.elements.indexOf(triggerElement), 0, { ...element, displaySettings: { collapsed: false }})
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
      const parentId = arrows[arrows.length - 1].parent;

      $store.commit('set', {
        path: 'arrowConnectData',
        value: {
          parent: arrows[arrows.length - 1].parent,
          child: step.id
        }
      })

      $store.state.arrows.push({parent: parentId, child: step.id });
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
    },

    replaceElements(event) {
      const { elementList, step } = this;
      const { elements } = step;
      const { moved } = event;

      if (!moved) return;

      const newIndex = elements.indexOf(elementList[moved.newIndex]);
      const oldIndex = elements.indexOf(elementList[moved.oldIndex])

      elements.splice(oldIndex, 1)
      elements.splice(newIndex, 0, elementList[moved.oldIndex])
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
    top: calc(50% + 190px);
    left: 445px;

    .builder-card-header {
      font-family: 'AbeatbyKai';
      display: flex;
      justify-content: space-between;
      align-items: center;

      .element-warning {
        margin-right: 10px;
      }
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
      font-size: 16px;
      padding: 6px;
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
      transition: transform .3s;
    }

    .arrow-born:hover {
      transform: scale(1.2);
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

      &:hover {
        border-color: #666;
        color: #666;
      }
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

        .drag-handler {
          position: absolute;
          left: 4px;
          top: 6px;

          &:hover {
            color:#000;
          }

          svg {
            width: 15px;
          }
        }

        .element-warning {
          width: 14px;
        }

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
