<template>
  <builder-card class="step-card" :settings="step.displaySettings" :ref="step.id">
    <template slot="header">{{ step.name }}</template>
    <template slot="body">
      <div class="arrow-connect" v-if="$store.state.newPoint"></div>
      <div class="element-container" v-for="element in step.elements" :key="element.id">
        <div class="element-title">
          {{elementsNames[element.type]}}
          <div @click="elementRemove(element)">&times</div>
          <div v-if="false" class="collapse-toggle" >{{ element.displaySettings.collapsed ? '+' : '-'}}</div>
        </div>
        <div class="element-body" v-if="!element.displaySettings.collapsed">
          <component :is="elementComponents[element.type]" :element="element" :ref="element.id"></component>
        </div>
      </div> 
      <component 
        :is="Drop" 
        :class="{'add-element': true, 'in-drag':  dragged}"
        @dragenter="dragEnter"
        @dragleave="dragLeave"
        @drop="dropHandler"
      >+</component>
      <div class="remove-step" @click="$emit('delete-step', step)">remove step</div>
    </template>
  </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import { Drop } from 'vue-drag-drop';
import sendImageAction from '../elements/sendImageAction.vue'
import sendTextAction from '../elements/sendTextAction.vue'
import messageCondition from "../elements/messageCondition.vue";
import messageConditionMultiple from '../elements/messageConditionMultiple.vue'

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay',
        messageConditionMultiple: 'List',
        messageCondition: 'Trigger'
      },
      elementComponents: {
        sendImageAction,
        sendTextAction,
        messageCondition,
        messageConditionMultiple
      },
      dragged: false,
      Drop
    }
  },

  components: {
    builderCard,
  },

  props: ['step'],

  methods: {
    dragEnter(data) {
      if (data.type == "regular") return;
      this.dragged = true;
    },

    dragLeave(data) {
      if (data.type == "regular") return;
      this.dragged = false;
    },

    dropHandler(data) {
      if (data.type == "regular") return;

      data.id = this.utils.uuidv4();

      this.dragged = false;
      this.step.elements.push({ ...data, displaySettings: { collapsed: false }});
    },

    elementRemove(element) {
      const { elements } = this.step;

      elements.splice(elements.indexOf(element), 1);
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
    top: 130px;
    left: 450px;

    .builder-card-header {
      font-family: 'AbeatbyKai';
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

    .element-container {
      border: 1px solid #DDDDDD;
      border-radius: 4px;
      margin-bottom: 6px;

      .element-title {
        background: linear-gradient(180deg, #FAFAFA 0%, #F2F2F2 98.27%);
        font-family: 'AbeatbyKai';
        font-size: 16px;
        padding: 10px 11px 10px 21px;
        color: #A9A9A9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #DDDDDD;
        border-radius: 4px 4px 0 0;
        cursor: pointer;

        &.is-collapsed {
          border-bottom: none;
          border-radius: 4px;
        }
      }

      .element-body {
        min-height: 70px;
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