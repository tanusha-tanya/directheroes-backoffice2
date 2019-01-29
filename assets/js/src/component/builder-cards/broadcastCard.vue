<template>
  <builder-card :class="{'broadcast-card': true, disabled: isStarted || notStarted }" :settings="broadcastStep.displaySettings">
    <template slot="header">
      {{ broadcast.name || '&nbsp;'}}
    </template>
    <template slot="header-controls">
      <builder-card-dialogs :step="broadcast" :short="true"></builder-card-dialogs>
    </template>
    <template slot="body">
      <div
        class="element-container"
        v-for="element in broadcastStep.elements"
        :key="element.id"
        >
        <div class="element-title" :ref="element.id">
          <span @click="element.displaySettings.collapsed = !element.displaySettings.collapsed">
            <div class="element-name">{{elementsNames[element.type]}}</div>
            <element-warning :element="element"></element-warning>
            <div class="collapse-toggle" >{{ element.displaySettings.collapsed ? '+' : '-'}}</div>
          </span>
          <div class="remove-element" @click="elementRemove(element)">&times</div>
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
    </template>
  </builder-card>
</template>

<script>
import ObjectId from '../../utils/ObjectId'
import builderCard from "./builderCard.vue";
import { Drop } from 'vue-drag-drop';
import builderCardDialogs from '../builderCardDialogs'
import sendImageAction from '../elements/sendImageAction.vue'
import basicDelay from '../elements/basicDelay.vue'
import sendTextAction from '../elements/sendTextAction.vue'
import elementWarning from '../elementWarning.vue'

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay',
      },
      elementComponents: {
        sendImageAction,
        sendTextAction,
        basicDelay
      },
      dragged: false,
      Drop
    }
  },

  components: {
    builderCard,
    builderCardDialogs,
    elementWarning
  },

  computed: {
    broadcastStep() {
      return this.broadcast.steps.find(step => step.type = 'broadcastEntry')
    },

    isStarted() {
      const { broadcastStep } = this
      return broadcastStep.status.statusText == 'running'
    },

    notStarted() {
      const { isStarted, startAt, broadcastStep } = this;

      return !isStarted && startAt && moment().diff(new Date(startAt), 'minutes') > 1
    }
  },

  props: ['broadcast'],

  methods: {
    dragEnter(data) {
      this.dragged = true;
    },

    dragLeave(data) {
      this.dragged = false;
    },

    dropHandler(data) {
      const element = JSON.parse(JSON.stringify(data))

      element.id = (new ObjectId).toString();

      this.dragged = false;
      this.broadcastStep.elements.push({ ...element, displaySettings: { collapsed: false }});
    },

    elementRemove(element) {
      const { elements } = this.broadcastStep;

      elements.splice(elements.indexOf(element), 1);
    },
  }
}
</script>
<style lang="scss">
  div.broadcast-card {
    background-color: #2A4294;
    box-shadow: 0 0 10px #F5F5F5;
    top: 130px;
    left: 450px;
    
    &.disabled {
      pointer-events: none;
      opacity: .6;
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
      font-size: 24px;

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
  }
</style>