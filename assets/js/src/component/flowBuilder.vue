<template>
  <div class="flow-builder">
      <drop
        :class="{ 'flow-builder-area': true, dragged }"
        tag="div"
        v-if="currentEntryItem"
        @dragover="dragEnter"
        @dragleave="dragLeave"
        @drop="dropHandler"
        ref="flowBuilder"
        >
        <div class="builder-wrap" style="position:absolute">
          <div class="builder-area" :style="{ left, top, transform: `scale(${ scale })`, minHeight: `5000px`, minWidth: `5000px`, transformOrigin: transformOrigin}" ref="builderArea">
            <campaign-card :campaign="currentEntryItem" :ref="entryStep.id" v-if="entryType == 'campaignEntry'"></campaign-card>
            <broadcast-card :class="{ disabled }" :broadcast="currentEntryItem" :ref="entryStep.id" v-else></broadcast-card>
            <step-card :class="{ disabled }" :step="step" v-for="(step, index) in steps" :key="step.id" :ref="step.id" :tag="index + 1" @delete-step="deleteStep"></step-card>
            <arrows ref="arrows" :refs="builder" :arrows="arrows" :scale="scale"></arrows>
          </div>
        </div>
        <builder-elements v-if="!disabled"></builder-elements>
        <div class="zoom-element">
          <el-slider
            v-model="scale"
            :min=".5"
            :max="1.5"
            :step=".1"
          >
          </el-slider>
          <div class="go-to-position" @click="findCampaignCard">
            <svg x="0px" y="0px" fill="#409EFF" viewBox="0 0 384 384" style="enable-background:new 0 0 384 384;" xml:space="preserve">
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
      </drop>
    </div>
  </div>
</template>
<script>
import ObjectId from '../utils/ObjectId'
import EventBus from '../utils/event-bus'
import Collision from '../utils/collision'
import debounce from 'lodash/debounce'
import campaignCard from './builder-cards/campaignCard.vue'
import stepCard from './builder-cards/stepCard.vue'
import broadcastCard from './builder-cards/broadcastCard.vue'
import arrows from './arrows.vue'
import { Drop } from 'vue-drag-drop';
import builderElements from './builderElements.vue'

export default {
  data() {
    return {
      dragged: false,
      width: '100%',
      height: '100%',
      scale: 1,
      originalPosition: null,
      transformOrigin: null,
      left: 0,
      top: 0,
    }
  },

  components: {
    builderElements,
    broadcastCard,
    campaignCard,
    stepCard,
    Drop,
    arrows
  },

  props:['entryType', 'currentEntryItem', 'disabled', 'hasWarning'],

  // mounted() {
  //   EventBus.$on('builderCard:mousedown', (cardDetails) => {
  //     this.originalPosition = cardDetails
  //   });

  //   EventBus.$on('builderCard:mouseup', (cardSettings) => {
  //     this.handleCollision(cardSettings);
  //   });
  // },

  computed:{
    steps() {
      return this.currentEntryItem.steps.filter(step => step.type == 'regular')
    },

    entryStep() {
      return this.currentEntryItem.steps.find(step => step.type = this.entryType)
    },

    arrows() {
      const { arrows } = this.$store.state;

      return arrows;
    },

    builder() {
      return this;
    },
  },

  methods: {
    saveCampaign: debounce(function() {
      this.$store.dispatch('saveCampaign', this.currentEntryItem)
        // .then(({ data }) => {
        //   this.$message.success({
        //     message: 'Success saved',
        //     duration: 3000,
        //     center: true
        //   });
        // })
        .catch(() => {
          this.$message.error({
            message: 'Could not save data',
            duration: 3000,
            center: true
          })
        });
    }, 3000),

    dragEnter(data) {
     if (!data || data.type != "regular") return;

      this.dragged = true;
    },

    dragLeave(data) {
      if (!data || data.type != "regular") return;

      this.dragged = false;
    },

    dropHandler(data, event) {
      const ObjId = new ObjectId;
      this.dragged = false;

      if (!data || data.type != "regular") return;

      const step = JSON.parse(JSON.stringify(data))

      step.id = ObjId.toString();

      this.currentEntryItem.steps.push({
        ...step,
        displaySettings:{
          positionX: (event.offsetX - 20) / this.scale,
          positionY: (event.offsetY - 20) / this.scale,
          collapsed: false
        }
      });
    },

    deleteStep(step) {
      const { steps } = this.currentEntryItem;

      steps.splice(steps.indexOf(step),1)
    },

    arrowPoint(event) {
      this.$store.commit('set', {
        path: 'newPoint',
        value: {
          top: event.clientY,
          left: event.clientX,
          height: 0,
          width: 0
        }
      })
    },

    getArrows() {
      const { currentEntryItem, $store } = this
      const arrows = [];

      currentEntryItem.steps.forEach(step => step.elements.find(element => {
        const { collapsed } = step.displaySettings
        const { collapsed: elementCollapsed } = element.displaySettings || {}
        const parentId = collapsed ? step.id : elementCollapsed ? element.id : null

        switch(element.type) {
          case 'messageConditionMultiple':
            element.value.conditionList.forEach(item => {
              if (!item.onMatch || item.onMatch.type !== 'goToStep' || !item.onMatch.value.stepId ) return;

              if (!currentEntryItem.steps.find(step => step.id === item.onMatch.value.stepId)) {
                delete item.onMatch;
                return
              }

              arrows.push({ parent: parentId || item.id, child: item.onMatch.value.stepId });
            })
          break;
          case 'goToStep':
            arrows.push({ parent: step.id, child: element.value.stepId });
          break;
        }
      }))

      $store.commit('set', { path: 'arrows', value: arrows })
    },

    removePoint() {
      this.$store.commit('set', {path: 'newPoint', value: null});
    },

    findCampaignCard() {
      const campaignCard = this.$refs[this.entryStep.id];
      const { $el } = this.$refs.flowBuilder;
      let scrollTimeoutId = null

      $el.scrollTop = (campaignCard.$el.offsetTop - $el.clientHeight / 2) + campaignCard.$el.clientHeight / 2;
      $el.scrollLeft = (campaignCard.$el.offsetLeft - $el.clientWidth / 2) + campaignCard.$el.clientWidth / 2;

      $el.addEventListener('transitionend', (event) => {
        console.log(event);

      })
      // this.calcScalePosition();
    },

    calcScalePosition() {
      const { scale } = this;
      const { flowBuilder, builderArea } = this.$refs;

      if (!flowBuilder || !builderArea) return;

      const flowRect = flowBuilder.$el.getBoundingClientRect();
      const builderRect = builderArea.getBoundingClientRect();

      const x = Math.abs(builderRect.x + flowRect.x) + flowRect.width / 2;
      const y = Math.abs(builderRect.y + flowRect.y) + flowRect.height / 2;

      console.log(builderRect, x, y);

      this.transformOrigin = `${ x * 100 / builderRect.width }% ${ x  * 100 / builderRect.height }%`
    }

    // resetDraggedCardToOriginalPos() {
    //   const draggedCard = this.currentEntryItem.steps.find(dragged => dragged.id === this.originalPosition.id);
    //   draggedCard.displaySettings.positionX = this.originalPosition.x;
    //   draggedCard.displaySettings.positionY = this.originalPosition.y;
    // },


  /**
   * compare currently dragged card position with all other campaign cards
   * if they collide, move dragged card back to its original position
   */
    // handleCollision(cardSettings) {
    //   const draggedCard = this.$refs[cardSettings.id][0] || this.$refs[cardSettings.id]
    //   const draggedCardHeight = draggedCard.$el.clientHeight
    //   const draggedCardWidth = draggedCard.$el.clientWidth

    //   // compare current position with campaign positions
    //   this.currentEntryItem.steps.forEach((step) => {
    //     const card = this.$refs[step.id][0] || this.$refs[step.id];
    //     const cardHeight = card.$el.clientHeight;
    //     const cardWidth = card.$el.clientWidth;
    //     const collision = new Collision(cardSettings, step, cardWidth, cardHeight, draggedCardHeight, draggedCardWidth);

    //     if (this.originalPosition.id !== step.id && collision.check()) {
    //       this.resetDraggedCardToOriginalPos();
    //     }
    //   })
    //   return true;
    // }
  },

  mounted() {
    if (!this.currentEntryItem) return;

    this.findCampaignCard();
  },

  watch:{
    '$store.state.newPoint'(newValue, oldValue) {
      if (oldValue && newValue) return;

      this.$el[newValue ? 'addEventListener' : 'removeEventListener']('mousemove', this.arrowPoint)
      this.$el[newValue ? 'addEventListener' : 'removeEventListener']('click', this.removePoint)
    },

    scale() {
      this.calcScalePosition();
    },

    currentEntryItem: {
      handler: function (entry, oldEntry) {
        setTimeout(() => {
          const { flowBuilder } = this.$refs

          this.width = `${ flowBuilder.$el.scrollWidth * this.scale }px`
          this.height = `${ flowBuilder.$el.scrollHeight * this.scale }px`
        }, 100)

        if (this.$refs.arrows) this.$nextTick(this.$refs.arrows.recalcPathes);

        if (entry) {
          this.getArrows();

          if (!oldEntry && this._isMounted) {
            this.$nextTick(() => {
              this.findCampaignCard();
            });
          };
        }

        if (!oldEntry || !entry || entry.id !== oldEntry.id) {
          return;
        }

        entry.isActive = entry.isEnabled && !this.hasWarning;
        entry.isIncomplete = this.hasWarning;

        this.saveCampaign();
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
.flow-builder {
  position: relative;
  width: 100%;

  .flow-builder-area {
    position: absolute;
    overflow: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: background-color .4s;

    &.dragged {
      background-color:#E2E2E2
    }

    .builder-area {
      position: relative;
      top: 0;
      left: 0;
      min-width: 5000px;
      min-height: 5000px;
      // transform-origin: left top;
      // margin: 450px;
      border: 2px dashed #E2E2E2;
      transition: transform 300ms linear 0s;
    }

    .zoom-element {
      display: flex;
      align-items: center;
      position: fixed;
      background-color: #fff;
      padding: 0 0 0 10px;
      z-index: 10;
      top: 110px;
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
  }

  .builder-card {
    &.disabled {
      pointer-events: none;
      opacity: .6;
    }
  }
}
</style>
