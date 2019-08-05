<template>
  <div class="flow-builder" v-if="entryItem">
    <div class="builder-area" ref="builderArea">
      <div class="steps-row" v-for="(stepRow, rowIndex) in stepRows" :key="rowIndex">
        <template v-for="(stepRowItem, rowItemIndex) in stepRow">
          <div class="step-item empty-blank" v-if="typeof stepRowItem === 'string'" :key="rowItemIndex"></div>
          <step-item
            v-else
            :class="{'entry-step': !rowIndex}"
            :step="stepRowItem"
            :flow-name="!rowIndex && entryItem.name"
            @add-step="addStep"
            :key="rowItemIndex"
            :ref="stepRowItem.id"
            ></step-item>
        </template>
      </div>
      <arrows ref="arrows" :refs="builder" :arrows="arrows" :scale="scaleValue"></arrows>
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom';
import stepItem from './stepItem';
import arrows from './arrows.vue'

export default {
  data() {
    return {
      scaleValue: 1,
      arrows: [],
    }
  },

  props: ['entryItem'],

  components: {
    stepItem,
    arrows
  },

  computed: {
    stepRows() {
      const { steps } = this.entryItem;
      const stepRows = [];
      const arrows =[];
      let levelIndex = 0;

      console.log('rows');

      steps.forEach((step, index) => {
        if (!index) {
          stepRows.push([step]);
          levelIndex = 1;
        } else {
          stepRows.some((stepRow, rowIndex) => stepRow.some((stepRowItem, rowItemIndex) => {
            if (stepRowItem !== step.id) return;

            levelIndex = rowIndex + 1;
            stepRows[rowIndex].splice(rowItemIndex, 1, step);

            return true;
          }))
        }

        const linkElements = step.elements.filter(element => element.type === 'rule' || element.type === 'linker').map(element => {
          let target = null;

          switch(element.type) {
            case 'rule':
              target = (element.onMatch && element.onMatch.target) || 'empty';
            break;
            case 'linker':
              target = element.target;
          }

          arrows.push({parent: element.id, child: target});

          return target;
        })

        if (!linkElements.length) return;

        if (!stepRows[levelIndex]) {
          stepRows.push(linkElements)
        } else {
          stepRows[levelIndex].push(...linkElements)
        }
      });

      this.arrows = arrows;

      return stepRows
    },

    builder() {
      return this
    }
  },

  methods: {
    addStep(step) {
      const { entryItem } = this;

      entryItem.steps.push(step);
    },
  }
}
</script>

<style lang="scss">
.flow-builder {
  position: relative;
  width: 100%;
  height: 100%;

  .builder-area {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  .steps-row {
    margin-left: 60px;
    display: flex;
    flex-direction: column;
  }
}
</style>
