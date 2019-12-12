<template>
  <div :class="{'flow-builder': true, 'flow-disabled': globalError || disabled}" v-if="entryItem" ref="flowBuilder">
    <div class="zoom-element" @mousedown="blockEvent">
      <el-slider
        v-model="scale"
        :min=".1"
        :max="2"
        :step=".1"
      >
      </el-slider>
      <div class="go-to-position" @click="findEntryStep()">
        <svg x="0px" y="0px" fill="#9E4CF9" viewBox="0 0 384 384" style="enable-background:new 0 0 384 384;" xml:space="preserve">
          <path d="M192,136c-30.872,0-56,25.12-56,56s25.128,56,56,56s56-25.12,56-56S222.872,136,192,136z M192,216
            c-13.232,0-24-10.768-24-24s10.768-24,24-24s24,10.768,24,24S205.232,216,192,216z"/>
          <path d="M368,176h-32.944C327.648,109.368,274.632,56.352,208,48.944V16c0-8.832-7.168-16-16-16c-8.832,0-16,7.168-16,16v32.944
            C109.368,56.352,56.352,109.368,48.944,176H16c-8.832,0-16,7.168-16,16c0,8.832,7.168,16,16,16h32.944
            C56.352,274.632,109.368,327.648,176,335.056V368c0,8.832,7.168,16,16,16c8.832,0,16-7.168,16-16v-32.944
            c66.632-7.408,119.648-60.424,127.056-127.056H368c8.832,0,16-7.168,16-16C384,183.168,376.832,176,368,176z M192,304
            c-61.76,0-112-50.24-112-112S130.24,80,192,80s112,50.24,112,112S253.76,304,192,304z"/>
        </svg>
      </div>
    </div>
    <div class="builder-area" ref="builderArea" @click="$store.commit('set', {path: 'existConnection', value: null })">
      <div class="steps-row" v-for="(stepRow, rowIndex) in builder.scheme" :key="rowIndex">
        <template v-for="(stepRowItem, rowItemIndex) in stepRow">
          <div class="step-item empty-blank" v-if="!stepRowItem" :key="rowItemIndex"></div>
          <step-item
            v-else
            :class="{'entry-step': !rowIndex}"
            :step="stepRowItem"
            :flow-name="!rowIndex && entryItem.name"
            @add-step="addStep"
            @delete-step="deleteStep"
            :key="rowItemIndex"
            :campaign-type="entryItem.type"
            :step-row-index="rowIndex"
            :ref="stepRowItem.id"
            :steps="entryItem.steps"
            ></step-item>
        </template>
      </div>
      <!-- <arrows ref="subArrows" class="sub-arrows" :refs="builder" :arrows="subArrows" :scale="scaleValue"></arrows>
      <arrows ref="arrows" :refs="builder" :arrows="arrows" :scale="scaleValue"></arrows> -->
    </div>
  </div>
</template>

<script>
import panzoom from 'panzoom';
import stepItem from './stepItem';
// import arrows from './arrows';
import Vue from 'vue';
import Builder from '../../src/builder'
// import utils from '../utils';
import ObjectId from '../utils/ObjectId';

// let zoomTimeout = null;

export default {
  data() {
    return {
      zoomTool: null,
      scaleValue: 1,
      arrows: [],
      subArrows: [],
      builder: null,
    }
  },

  props: ['entryItem', 'hasWarning', 'disabled'],

  components: {
    stepItem,
    // arrows,
  },

  computed: {
    globalError() {
      const { globalError } = this.$store.state;

      return globalError
    },

    scale: {
      get() {
        const { scaleValue } = this;

        return scaleValue && parseFloat(scaleValue.toFixed(1)) || 1;
      },
      set(value) {
        const { zoomTool, scaleValue } = this;

        if (!zoomTool || scaleValue == value) return;

        clearTimeout(zoomTimeout);

        zoomTimeout = setTimeout(() => {
          this.scaleValue = value;

          this.scaleTo(value / scaleValue);
        }, 100);
      }
    },

    isBroadcast() {
      return entryItem.type === 'broadcast';
    }
  },

  methods: {
    addStep(step, parentElement) {
      const { entryItem } = this;
      const firstElementSettings = step.elements[0];

      switch (firstElementSettings.displaySettings.subType) {
        case 'message':
          step.name = 'New message'

          if (firstElementSettings.displaySettings.type === 'delay') {
            const checkpoint = firstElementSettings.elements.find(element => element.type === 'checkpoint');
            const action = firstElementSettings.elements.find(element => element.type === 'action');

            action.body.checkpointId = checkpoint.id;
          }
          break;
        case 'condition':
          step.name = 'Condition'

          if (firstElementSettings.displaySettings.type === 'timeout') {
            const checkpoint = firstElementSettings.elements.find(element => element.type === 'checkpoint');
            const action = firstElementSettings.elements.find(element => element.type === 'action');

            action.body.checkpointId = checkpoint.id;
          }

          break;
        case 'action':
          step.name = 'Action'
          break;
        case 'trigger':
          step.name = 'Trigger';

          if (!parentElement || !parentElement.displaySettings || !parentElement.displaySettings.subType === 'condition') {
            step.elements.splice(0,0, {
              type: 'checkpoint',
              id: (new ObjectId).toString()
            })
          }

          break;
        case 'user-input':
          step.name = 'User Input'

          if (!parentElement || !parentElement.displaySettings || !['condition', 'trigger'].includes(parentElement.displaySettings.subType)) {
            step.elements[0].elements.splice(0,0, {
              type: 'checkpoint',
              id: (new ObjectId).toString()
            })
          }

          break;
        case 'sub-input':
          step.name = 'Collect'
          break;
      }

      entryItem.steps.push(step);
    },

    deleteStep(step) {
      const { steps } = this.entryItem;
      const userInputElement = step.elements.find(element => element.displaySettings && element.displaySettings.subType == "user-input")

      steps.forEach(stepItem => stepItem.elements.forEach( (element, index) => {
        const actionElement = (matchElement) => {
          if (!matchElement) return;

          const target = matchElement.target || (matchElement.onMatch && matchElement.onMatch.target);
          const failTarget = matchElement.target || (matchElement.onFail && matchElement.onFail.target);

          if ((target !== step.id) && (failTarget !== step.id)) return;


          if (element.type == 'linker') {
            stepItem.elements.splice(index, 1)
          } else {
            Vue.set(matchElement, failTarget === step.id ? 'onFail' : 'onMatch', undefined);
          }

          return true;
        };

        if (element.displaySettings && element.displaySettings.type === 'followers') {
          element.elements.some(actionElement);
        } else {
          return actionElement(utils.getOnMatchElement(element));
        }
      }))

      if (userInputElement) {
        const matchElement = utils.getOnMatchElement(userInputElement);
        const subStep = steps.find(step => step.id === matchElement.onMatch.target);

        steps.splice(steps.indexOf(subStep), 1)
      }

      steps.splice(steps.indexOf(step), 1)
    },

    initZoom() {
      const zoomTool = panzoom(this.$refs.builderArea, {
        maxZoom: 2,
        minZoom: 0.1,
        smoothScroll: false,
        zoomDoubleClickSpeed: 1,
        beforeWheel(event) {
          if (!event.shiftKey) {
            const { x, y } = zoomTool.getTransform();

            zoomTool.moveTo(x - event.deltaX, y - event.deltaY)
          }

          return !event.shiftKey;
        },
        filterKey(event) {
          return true;
        }
      })

      zoomTool.on('zoom', () => {
        this.scaleValue = zoomTool.getTransform().scale;
      })

      this.zoomTool = zoomTool;
    },

    scaleTo(ration) {
      const { zoomTool } = this;
      const { flowBuilder } = this.$refs;
      const flowBuilderRect = flowBuilder.getBoundingClientRect();

      const positionX = (flowBuilderRect.x + flowBuilderRect.width) / 2;
      const positionY = (flowBuilderRect.y + flowBuilderRect.height) / 2;

      zoomTool.smoothZoom(positionX, positionY, ration);
    },

    findEntryStep(stepId, animation) {
      const { zoomTool, entryItem } = this;
      const { flowBuilder } = this.$refs;
      const campaignCard = this.$refs[stepId || entryItem.steps[0].id][0];
      const campaignCardRect = campaignCard.$el.getBoundingClientRect();
      const flowBuilderRect = flowBuilder.getBoundingClientRect();
      const { x, y } = zoomTool.getTransform();

      const positionX = -((campaignCardRect.x + campaignCardRect.width / 2) - x - (flowBuilderRect.x + flowBuilderRect.width) / 2);
      const positionY = -((campaignCardRect.y + campaignCardRect.height / 2) - y - (flowBuilderRect.y + flowBuilderRect.height) / 2);

      if (animation) {
        campaignCard.findAnimation = true;
      }

      zoomTool.moveTo(positionX, positionY);
    },

    //   stepsInOneBranch(endStepId, searchStepId) {
    //     const { arrows, stepsInOneBranch } = this;
    //     const endStepConnection = arrows.find(arrow => arrow.child === endStepId);

    //     if (!endStepConnection) return;

    //     if (endStepConnection.stepId === searchStepId) {
    //       return true
    //     } else {
    //       return stepsInOneBranch(endStepConnection.stepId, searchStepId)
    //     }
    //   },

    //   getStepArrows(stepId) {
    //     const { arrows, subArrows } = this;
    //     const stepArrows = [];

    //     arrows.concat(subArrows).forEach(arrow => {
    //       if (arrow.stepId !== stepId && arrow.child !== stepId) return;

    //       stepArrows.push(arrow);
    //     })

    //     return stepArrows;
    //   }
  },

  created() {
    const { entryItem } = this;
    const builder = new Builder(entryItem);

    this.builder = builder;
  },

  mounted() {
    const { entryItem, $refs } = this;
    const { builderArea } = $refs;

    if (!builderArea || !entryItem) return;

    this.initZoom();
    this.findEntryStep();

    this.$nextTick(() => {
      const { builderArea } = this.$refs;

      builderArea.style.width = `${builderArea.scrollWidth}px`;
      builderArea.style.height = `${builderArea.scrollHeight}px`
    });
  },

  watch:{
    //   entryItem: {
    //     handler: function (entry, oldEntry) {

    //       if (this.$refs.arrows) this.$nextTick(this.$refs.arrows.recalcPathes);
    //       if (this.$refs.subArrows) this.$nextTick(this.$refs.subArrows.recalcPathes);

    //       if (entry) {
    //         if (!oldEntry && this._isMounted) {
    //           this.$nextTick(() => {
    //             this.initZoom();
    //             this.findEntryStep();
    //           });
    //         };

    //         if (this._isMounted) {
    //           this.$nextTick(() => {
    //             const { builderArea } = this.$refs;

    //             builderArea.style.width = `${builderArea.scrollWidth}px`;
    //             builderArea.style.height = `${builderArea.scrollHeight}px`
    //           });
    //         }
    //       }

    //       if (!oldEntry || !entry || entry.id !== oldEntry.id) {
    //         return;
    //       }

    //       entry.isActive = entry.isEnabled && !Boolean(this.hasWarning);
    //       entry.isIncomplete = Boolean(this.hasWarning);
    //     },
    //     deep: true
    //   },
  }
}
</script>

<style lang="scss">
.flow-builder {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  font-family: 'Lato';

  &.flow-disabled {
    opacity: .3;
    pointer-events: none;
  }

  .builder-area {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 10000px;
    height: 10000px;
    overflow: auto;
  }

  .sub-arrows {
    z-index: -1;
  }

  input {
    border-radius: 3px;
    border-color: #D8D8D8;
    outline: navy;
  }

  .steps-row {
    margin-left: 60px;
    display: flex;
    flex-direction: column;
  }

  .zoom-element {
    display: flex;
    align-items: center;
    position: fixed;
    background-color: #fff;
    padding: 0 0 0 10px;
    z-index: 10;
    top: 70px;
    left: calc(50% - 10px);
    width: 230px;
    border: 2px solid #E8E8E8;
    border-radius: 10px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);

    .el-slider {
      flex-grow: 1;
    }

    .go-to-position {
      flex-shrink: 0;
      width: 33px;
      margin: 2px 0 0 10px;
      padding: 0 5px;
      border-left: 2px solid #E8E8E8;
    }
  }

  .hidden-select {
    .el-input{
      width: auto;
    }

    .el-input__inner {
      font-family: sans-serif;
      border: none;
      background-color: transparent;
      padding: 0;
      width: 53px;
      font-size: 12px;
      color: #2c3e50;
    }

    .el-input__suffix {
      display: none;
    }
  }
}

.small-dropdown {
  background: #FFFFFF;
  border: 1px solid #CFCFCF;
  box-sizing: border-box;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  margin: -13px 0 0 20px !important;

  .popper__arrow {
    display: none;
  }

  .el-scrollbar__view {
    padding: 0;
  }

  .el-select-dropdown__item, .el-select-dropdown__item.selected {
    font-size: 11px;
    line-height: 17px;
    height: 17px;
    color: #2D2D2D;
    font-weight: normal;
    padding: 0 5px;
    background-color: #FFF;

    &:hover {
      background-color: #ECECEC;
    }
  }
}
</style>
