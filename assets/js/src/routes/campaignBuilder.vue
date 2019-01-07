<template>
  <div class="campaign-builder" v-if="currentCampaign">
    <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-builder-control">
        Activate
        <el-switch v-model="currentCampaign.isEnabled" :width="22"></el-switch
      ></div>
      <div class="campaign-builder-divider"></div>
      <div class="campaign-builder-control trash" @click="deleteCampaign">
        <img src="../assets/svg/trash.svg"/>
      </div>
    </div>
    <drop
      :class="{ 'campaign-builder-area': true, dragged }"
      tag="div"
      @dragover="dragEnter"
      @dragleave="dragLeave"
      @drop="dropHandler"
      ref="campaignBuilder"
      >
      <div class="builder-area" :style="{ width, height, transform: `scale(${ scale })`, minHeight: `5000px`, minWidth: `5000px`}">
        <campaign-card :campaign="currentCampaign" :ref="campaignStep.id"></campaign-card>
        <step-card :step="step" v-for="step in steps" :key="step.id" :ref="step.id" @delete-step="deleteStep"></step-card>
        <arrows ref="arrows" :refs="builder" :arrows="arrows" :scale="scale"></arrows>
      </div>
      <builder-elements></builder-elements>
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
</template>
<script>
import ObjectId from '../utils/ObjectId'
import EventBus from '../utils/event-bus'
import Collision from '../utils/collision'
import debounce from 'lodash/debounce'
import campaignCard from '../component/builder-cards/campaignCard.vue'
import stepCard from '../component/builder-cards/stepCard.vue'
import arrows from '../component/arrows.vue'
import { Drop } from 'vue-drag-drop';
import builderElements from '../component/builderElements.vue'
import Vue from 'vue';

export default {
  beforeRouteEnter(to, from, next) {
    next(accountCampaign => {
      accountCampaign.setCurrentCampaign(to);
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.currentCampaign = null;

    this.setCurrentCampaign(to);
    next();
  },

  data() {
    return {
      currentCampaign: null,
      dragged: false,
      width: '100%',
      height: '100%',
      scale: 1,
      originalPosition: null,
    }
  },

  components: {
    builderElements,
    campaignCard,
    stepCard,
    Drop,
    arrows
  },

  mounted() {
    EventBus.$on('builderCard:mousedown', (cardDetails) => {
      this.originalPosition = cardDetails
    });

    EventBus.$on('builderCard:mouseup', (cardSettings) => {
      this.handleCollision(cardSettings);
    });
  },

  computed:{
    steps() {
      return this.currentCampaign.steps.filter(step => step.type == 'regular')
    },

    campaignStep() {
      return this.currentCampaign.steps.find(step => step.type = 'campaignEntry')
    },

    arrows() {
      const { currentCampaign, $store } = this
      const arrows = [];

      currentCampaign.steps.forEach(step => step.elements.find(element => {
        const { collapsed } = step.displaySettings
        const { collapsed: elementCollapsed } = element.displaySettings || {}
        const parentId = collapsed ? step.id : elementCollapsed ? element.id : null

        switch(element.type) {
          case 'messageConditionMultiple':
          case 'messageTextConditionMultiple':
            element.value.conditionList.forEach(item => {
              if (!item.onMatch || item.onMatch.type !== 'goToStep' || !item.onMatch.value.stepId ) return;

              arrows.push({ parent: parentId || item.id, child: item.onMatch.value.stepId });
            })
          break;
          case 'goToStep':
            arrows.push({ parent: step.id, child: element.value.stepId });
          break;
        }
      }))

      $store.commit('set', { path: 'arrows', value: arrows })

      return arrows;
    },

    builder() {
      return this;
    },
  },

  methods: {
    setCurrentCampaign(route) {
      const { campaignId } = route.params;
      const { campaignList } = this.$store.state.currentAccount;

      if (!campaignList || !campaignId) return;

      const currentCampaign = campaignList.find(campaign => campaign.id == campaignId);

      currentCampaign.steps.forEach(step => {
        if (step.displaySettings) return;

        Object.assign(step, {
          displaySettings: {
            positionX: null,
            positionY: null,
            collapsed: false
          }
        })
      })

      if (currentCampaign) {
        this.currentCampaign = currentCampaign;
      } else {
        this.$store.dispatch('getCampaignTemplates', { campaign:currentCampaign })
          .then(({ data }) => {
            this.currentCampaign = data.campaign;
          });
      }
    },

    saveCampaign: debounce(function() {
      this.$store.dispatch('saveCampaign', this.currentCampaign)
        .then(({ data }) => {
          this.$message.success({
            message: 'Success saved',
            duration: 3000,
            center: true
          });
        })
        .catch(() => {
          this.$message.error({
            message: 'Error saved',
            duration: 3000,
            center: true
          })
        });
    }, 3000),

    dragEnter(data) {
     if (data.type != "regular") return;

      this.dragged = true;
    },

    dragLeave(data) {
      if (data.type != "regular") return;

      this.dragged = false;
    },

    dropHandler(data, event) {
      const ObjId = new ObjectId;
      this.dragged = false;

      if (data.type != "regular") return;
      
      const step = JSON.parse(JSON.stringify(data))

      step.id = ObjId.toString();

      this.currentCampaign.steps.push({
        ...step, 
        displaySettings:{ 
          positionX: (event.offsetX - 20) / this.scale, 
          positionY: (event.offsetY - 20) / this.scale, 
          collapsed: false
        }
      });
    },

    deleteStep(step) {
      const { steps } = this.currentCampaign;

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

    removePoint() {
      this.$store.commit('set', {path: 'newPoint', value: null});
    },

    deleteCampaign() {
      this.$store.dispatch('deleteCampaign', this.currentCampaign)
        .then(({ data }) => {
          const { currentAccount } = this.$store.state;
          const { campaignList } = currentAccount;

          if (!campaignList.length) {
            this.$router.replace({ name: 'accountCurrent', params: { accountId: currentAccount.id } })
          } else {
            this.$router.replace({ name: 'accountCampaign', params: { campaignId: campaignList[0].id, accountId: currentAccount.id } })
          }

        })
    },

    resetDraggedCardToOriginalPos() {
      const draggedCard = this.currentCampaign.steps.find(dragged => dragged.id === this.originalPosition.id);
      draggedCard.displaySettings.positionX = this.originalPosition.x;
      draggedCard.displaySettings.positionY = this.originalPosition.y;
    },

  /**
   * compare currently dragged card position with all other campaign cards
   * if they collide, move dragged card back to its original position
   */
    handleCollision(cardSettings) {
      const draggedCard = this.$refs[cardSettings.id][0] || this.$refs[cardSettings.id]
      const draggedCardHeight = draggedCard.$el.clientHeight
      const draggedCardWidth = draggedCard.$el.clientWidth

      // compare current position with campaign positions
      this.currentCampaign.steps.forEach((step) => {
        const card = this.$refs[step.id][0] || this.$refs[step.id];
        const cardHeight = card.$el.clientHeight;
        const cardWidth = card.$el.clientWidth;
        const collision = new Collision(cardSettings, step, cardWidth, cardHeight, draggedCardHeight, draggedCardWidth);

        if (this.originalPosition.id !== step.id && collision.check()) {
          this.resetDraggedCardToOriginalPos();
        }
      })
      return true;
    },

    findCampaignCard() {
      const campaignCard = this.$refs[this.campaignStep.id];
      const { $el } = this.$refs.campaignBuilder;
      console.log($el.clientWidth/ 2);
      
      $el.scrollTop = (campaignCard.$el.offsetTop - $el.clientHeight / 2) + campaignCard.$el.clientHeight / 2;
      $el.scrollLeft = (campaignCard.$el.offsetLeft - $el.clientWidth / 2) + campaignCard.$el.clientWidth / 2;

    },

    scrollBuilder(event) {
      console.log('scroll'); 
    }
  },

  watch:{
    '$store.state.accounts'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    },

    '$store.state.newPoint'(newValue, oldValue) {
      if (oldValue && newValue) return;

      this.$el[newValue ? 'addEventListener' : 'removeEventListener']('mousemove', this.arrowPoint)
      this.$el[newValue ? 'addEventListener' : 'removeEventListener']('click', this.removePoint)
    },

    currentCampaign: {
      handler: function (campaign, oldCampaign) {
        setTimeout(() => {
          const { campaignBuilder } = this.$refs
          
          this.width = `${ campaignBuilder.$el.scrollWidth }px`
          this.height = `${ campaignBuilder.$el.scrollHeight }px`

          if (!campaign) return;

          const { displaySettings } = campaign;

          campaignBuilder.$el.scrollTop = (displaySettings && displaySettings.scrollTop) || campaignBuilder.$el.scrollHeight / 2
          campaignBuilder.$el.scrollLeft = (displaySettings && displaySettings.scrollTop) || campaignBuilder.$el.scrollWidth / 2 
        
          this.scale = (displaySettings && displaySettings.scale) || 1;
        
          if (!oldCampaign) {
            campaignBuilder.$el.addEventListener('scroll', event => {
              const { scrollTop, scrollLeft } = event.target;

              
              if (displaySettings && displaySettings.scrollTop == scrollTop && displaySettings.scrollLeft == scrollLeft) return;

              // if (!campaign.hasOwnProperty('displaySettings')) {
              //   Vue.set(campaign, 'displaySettings', {})
              // }
              
              // Vue.set(campaign.displaySettings, 'scrollTop', scrollTop);
              // Vue.set(campaign.displaySettings, 'scrollTop', scrollTop);
            })
          }
        }, 100)

        if (this.$refs.arrows) this.$nextTick(this.$refs.arrows.recalcPathes);

        if (!oldCampaign || !campaign || campaign.id !== oldCampaign.id) return;

        this.saveCampaign();
      },
      deep: true
    },

    scale(value, oldValue) {
      const { currentCampaign } = this;
      
      if (!value) return;

      if (!currentCampaign.hasOwnProperty('displaySettings')) {
        Vue.set(currentCampaign, 'displaySettings', {})
      }

      Vue.set(currentCampaign.displaySettings, 'scale', value);
    }
  }
}
</script>
<style lang="scss">
.campaign-builder {
  .campaign-builder-controls {
    display: flex;
    padding: 13px 5px 13px 13px;
    align-items: center;
    background-color: #fff;
    color: #A9A9A9;

    span {
      font-size: 24px;
      line-height: 24px;
      flex-grow: 1;
    }

    .campaign-builder-divider {
      border-left: 1px solid #A9A9A9;
      height: 34px;
      margin: 0 10px 0 38px;
    }

    .campaign-builder-control {
      font-size: 18px;

      .el-switch {
        margin-left: 14px;

        .el-switch__core {
          height: 14px;
          background-color: transparent;
          border: 2px solid #2E69F7;

          &:after {
            border: 2px solid #2E69F7;
            width: 4px;
            height: 4px;
            left: 2px;
          }
        }

        &.is-checked .el-switch__core:after {
          left:100%;
          margin-left: -10px;
        }
      }

      &.trash {
        padding: 8px;
        cursor: pointer;
      }
    }
  }

  .campaign-builder-area {
    position: absolute;
    overflow: auto;
    height: calc(100% - 60px);
    width: 100%;
    transition: background-color .4s;

    &.dragged {
      background-color:#E2E2E2
    }

    .builder-area {
      position: absolute;
      top: 0;
      left: 0;
      min-width: 5000px;
      min-height: 5000px;
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
      border-radius: 0 0 10px 10px;
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
}
</style>
