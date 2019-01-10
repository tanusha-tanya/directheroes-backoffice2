<template>
  <div class="campaign-builder">
    <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-list"> 
        <el-select 
          size="small"
          :value="currentCampaign && currentCampaign.id"
          @change="selectCampaign"
          placeholder="Select Add new campaign"
        >
          <el-option 
            v-for="campaign in campaigns" 
            :label="campaign.name" :value="campaign.id" 
            :key="campaign.id"
            >
          </el-option>
          <el-option 
            label="+ Add new campaign" 
            value="new"
            >
          </el-option>
        </el-select>
      </div>
      <div class="campaign-builder-control" v-if="currentCampaign">
        Activate
        <el-switch v-model="currentCampaign.isEnabled" :width="22"></el-switch
      ></div>
      <div class="campaign-builder-divider" v-if="currentCampaign"></div>
      <div class="campaign-builder-control trash" v-if="currentCampaign" @click="deleteCampaign">
        <img src="../assets/svg/trash.svg"/>
      </div>
    </div>
    <drop
      :class="{ 'campaign-builder-area': true, dragged }"
      tag="div"
      v-if="currentCampaign"
      @dragover="dragEnter"
      @dragleave="dragLeave"
      @drop="dropHandler"
      ref="campaignBuilder"
      >
      <div class="builder-area" :style="{ width, height, transform: `scale(${ scale })`, minHeight: `${ 100 / scale }%`, minWidth: `${ 100 / scale }%`}">
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
      </div>
    </drop>
    <el-dialog
      :visible.sync="isAddCampaign"
      title="Create New Campaign"
      class="campaign-dialog"
      width="321px"
      append-to-body
      :show-close="false"
      >
      <input v-model="newCampaignName" placeholder="Enter Campaign name"/>
      <template slot="footer">
        <button @click="createCampaign">Create</button>
        <button class="cancel" @click="isAddCampaign = false">Close</button>
      </template>
    </el-dialog>
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
      isAddCampaign: false,
      newCampaignName: ''
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

    campaigns() {
      return this.$store.state.currentAccount.campaignList
    }
  },

  methods: {
    setCurrentCampaign(route) {
      let { campaignId } = route.params;
      const { campaignList } = this.$store.state.currentAccount;

      if (!campaignList || !campaignList.length) {
        this.isAddCampaign = true;
        return
      };

      if (!campaignId) {
        campaignId = campaignList[0].id;
      };

      if (!campaignId) return;

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

    createCampaign() {
      const { currentAccount } = this.$store.state;

      this.$store.dispatch('createCampaign', {
        name: this.newCampaignName
      }).then(({ data }) => {
        const { campaign } = data;
        
        this.isAddCampaign = false;
        this.newCampaignName = '';

        this.$router.push({ name: 'accountCampaign', params: { campaignId: campaign.id, accountId: currentAccount.id } })
      })
      
    },

    selectCampaign(campaignId) {
      const { currentAccount } = this.$store.state;

      if (campaignId == 'new') {
        this.isAddCampaign = true;
        return;
      }
      
      this.$router.push({ name: 'accountCampaign', params: {campaignId,  accountId: currentAccount.id }})
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

          this.width = `${ campaignBuilder.$el.scrollWidth * this.scale }px`
          this.height = `${ campaignBuilder.$el.scrollHeight * this.scale }px`
        }, 100)

        if (this.$refs.arrows) this.$nextTick(this.$refs.arrows.recalcPathes);

        if (!oldCampaign || !campaign || campaign.id !== oldCampaign.id) return;

        this.saveCampaign();
      },
      deep: true
    },
  }
}
</script>
<style lang="scss">
.campaign-builder {
  flex-grow: 1;
  position: relative;

  .campaign-builder-controls {
    display: flex;
    padding: 8px 5px 7px 13px;
    align-items: center;
    background-color: #fff;
    color: #A9A9A9;

    span {
      font-size: 24px;
      line-height: 24px;
    }

    .campaign-list {
      flex-grow: 1;
      text-align: center;

      .el-select {
        width: 100%;
        max-width: 300px;
      }
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
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    transition: background-color .4s;

    &.dragged {
      background-color:#E2E2E2
    }

    .builder-area {
      position: absolute;
      top: 0;
      left: 0;
      min-width: 100%;
      min-height: 100%;
      transform-origin: left top;
    }

    .zoom-element {
      position: fixed;
      background-color: #fff;
      padding: 0 10px;
      z-index: 10;
      top: 100px;
      left: calc(50% - 10px);
      width: 200px;
      border: 2px solid #E8E8E8;
      border-radius: 0 0 10px 10px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);
    }
  }
}

.el-dialog__wrapper.campaign-dialog {
    
  .el-dialog {
    border-radius: 5px;
    padding: 20px;
  }

  .el-dialog__header {
    padding: 0;
    font-size: 18px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
  }

  .el-dialog__body {
    padding: 0;

    input:not(.el-input__inner) {
      width: 100%;
      margin: 20px 0;
      font-size: 15px;
      line-height: 18px;
      padding: 4px 10px 6px;
      border: 1px solid #DBDBDB;

      &::placeholder {
        color: #A9A9A9;
        text-align: center;
      }
    }
  }

  .el-dialog__footer {
    padding: 0;

    button {
      background-color: #6A12CB;
      border-radius: 5px;
      line-height: 16px;
      font-weight: normal;
      padding: 7px 20px;

      &.cancel {
        background-color: transparent;
        color: #000;
      }
    }
  }
}
</style>
