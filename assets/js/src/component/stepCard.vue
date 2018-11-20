<template>
    <builder-card class="step-card" :settings="step.displaySettings">
      <template slot="header">{{ step.name }}</template>
      <template slot="body">
        <div class="step-element" v-for="element in step.elements">
          {{elementsNames[element.type]}}
          <div>+</div>
        </div>
        <component 
          :is="Drop" 
          :class="{'add-element': true, 'in-drag':  dragged}"
          @dragenter="dragged = true"
          @dragleave="dragged = false"
          @drop="dropHandler"
        >+</component>
      </template>
    </builder-card>
</template>
<script>
import builderCard from "./builderCard.vue";
import { Drop } from 'vue-drag-drop';

export default {
  data() {
    return {
      elementsNames: {
        sendTextAction: 'Text',
        sendImageAction: 'Image',
        basicDelay: 'Delay'
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
    dropHandler(data) {
      this.dragged = false;
      this.step.elements.push(data);
    }
  }
}
</script>
<style lang="scss">
  div.step-card {
    border-color: #2E9E7B;
    background-color: #2E9E7B;

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

    .step-element {
      background: linear-gradient(180deg, #FAFAFA 0%, #F2F2F2 98.27%);
      border: 1px solid #DDDDDD;
      box-sizing: border-box;
      border-radius: 4px;
      font-family: 'AbeatbyKai';
      font-size: 16px;
      padding: 10px 21px;
      margin-bottom: 6px;
      color: #A9A9A9;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>