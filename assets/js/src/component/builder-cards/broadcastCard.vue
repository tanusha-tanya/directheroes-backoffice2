<template>
  <builder-card :scale="scale" class="broadcast-card" :settings="broadcastStep.displaySettings">
    <template slot="header">
      {{ broadcast.name || '&nbsp;'}}
    </template>
    <template slot="header-controls">
      <builder-card-dialogs :step="broadcast" :short="true"></builder-card-dialogs>
    </template>
    <template slot="body">
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
          <component :is="elementComponents[triggerElement.type]" :element="triggerElement" :triggers="triggersList" :tag="tag"></component>
        </div>
      </div>
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
import { Drop } from 'vue-drag-drop';
import confirmDialog from '../confirmDialog.vue'
import builderCardDialogs from '../builderCardDialogs'
import sendImageAction from '../elements/sendImageAction.vue'
import basicDelay from '../elements/basicDelay.vue'
import sendTextAction from '../elements/sendTextAction.vue'
import messageCondition from "../elements/messageCondition.vue";
import messageConditionMultiple from "../elements/messageConditionMultiple.vue";
import elementWarning from '../elementWarning.vue'

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay',
        messageConditionMultiple: 'Triggers'
      },
      elementComponents: {
        sendImageAction,
        sendTextAction,
        messageCondition,
        messageConditionMultiple,
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
    elementWarning,
    confirmDialog,
  },

  computed: {
    broadcastStep() {
      return this.broadcast.steps.find(step => step.type = 'broadcastEntry')
    },

    hasTextOrImage() {
      return this.broadcastStep.elements.some(element => ['sendImageAction', 'sendTextAction'].includes(element.type))
    },

    triggerElement() {
      const { elements } = this.broadcastStep;

      return elements.find(element => element.type === 'messageConditionMultiple')
    },

    elementList() {
      const { elements } = this.broadcastStep;

      return elements.filter(element => (element.type !== 'goToStep') && (element.type != 'basicDelay' || (!element.displaySettings || element.displaySettings.visible != false)) && element.type != 'messageConditionMultiple')
    },

    triggersList() {
      const { messageTypes } = this.dhAccount.flowBuilderSettings.triggers;

      return messageTypes;
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

  props: ['broadcast', 'tag', 'scale'],

  methods: {
    dragEnter(data) {
      const { hasTextOrImage } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && !hasTextOrImage) ) return;
      this.dragged = true;
    },

    dragLeave(data) {
      const { hasTextOrImage } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && !hasTextOrImage) ) return;
      this.dragged = false;
    },

    dropHandler(data) {
      const { hasTextOrImage, listElement, broadcastStep } = this;

      if (data.type == "regular" || (data.type == 'messageTextConditionMultiple' && !hasTextOrImage) ) return;

      const element = JSON.parse(JSON.stringify(data))

      element.id = (new ObjectId).toString();

      this.dragged = false;

      if (listElement) {
        broadcastStep.elements.splice(broadcastStep.elements.indexOf(listElement), 0, { ...element, displaySettings: { collapsed: false }})
      } else {
        broadcastStep.elements.push({ ...element, displaySettings: { collapsed: false }});
      }
    },

    handleMouseDown(position) {
      const cardDetails = {}
      cardDetails.x = position.x
      cardDetails.y = position.y
      cardDetails.id = this.broadcastStep.id
      EventBus.$emit('builderCard:mousedown', cardDetails)
    },

    handleMouseUp(position) {
      const cardDetails = {}
      cardDetails.x = position.positionX
      cardDetails.y = position.positionY
      cardDetails.id = this.broadcastStep.id
      EventBus.$emit('builderCard:mouseup', cardDetails)
    },

    elementRemove(element) {
      const { elements } = this.broadcastStep;

      elements.splice(elements.indexOf(this.elementToDelete), 1);
      this.toDeleteElement = null;
    },
  }
}
</script>
<style lang="scss">
  div.broadcast-card {
    background-color: #2A4294;
    box-shadow: 0 0 10px #F5F5F5;
    top: calc(50% + 140px)  !important;
    left: 30px !important;

    .builder-card-drag-handler {
      pointer-events: none;
      cursor: default;
    }

    .builder-card-header {
      font-family: 'AbeatbyKai';
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .builder-card-body {
      min-height: 76px;
      border-color: #2A4294;
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

    .arrow-born {
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
  }
</style>
