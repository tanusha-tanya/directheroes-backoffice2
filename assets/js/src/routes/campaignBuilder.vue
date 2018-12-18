<template>
  <div class="campaign-builder" v-if="currentCampaign">
    <div class="campaign-builder-controls">
      <span>Campaign Builder</span>
      <div class="campaign-builder-control">
        Activate
        <el-switch v-model="currentCampaign.isEnabled" :width="22"></el-switch
      ></div>
      <div class="campaign-builder-divider"></div>
      <div class="campaign-builder-control trash">
        <img src="../assets/svg/trash.svg"/>
      </div>
    </div>
    <drop 
      :class="{ 'campaign-builder-area': true, dragged }" 
      tag="div"
      @dragover="dragEnter"
      @dragleave="dragLeave"
      @drop="dropHandler"
      >
      <div class="builder-area" :style="{ width, height, transform: `scale(${ scale })`, minHeight: `calc(100% / ${ scale })`, minWidth: `calc(100% / ${ scale })`}">
        <campaign-card :campaign="currentCampaign" :ref="campaignStep.id"></campaign-card>
        <step-card :step="step" v-for="step in steps" :key="step.id" @delete-step="deleteStep"></step-card>
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
  </div>
</template>
<script>
import ObjectId from '../utils/ObjectId'
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
      scale: 1
    }
  },

  components: {
    builderElements,
    campaignCard,
    stepCard,
    Drop,
    arrows
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

              arrows.push({ parent: parentId || item.id, child: item.onMatch.value.stepId});
            })
          break;
          case 'goToStep':
            arrows.push({ parent: step.id, child: element.value.stepId});
          break;
        }
      }))
      
      $store.commit('set', { path: 'arrows', value: arrows })

      return arrows;
    },

    builder() {
      return this;
    }
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

      data.id = ObjId.toString();

      this.currentCampaign.steps.push({
        ...data, 
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
          this.width = `${ this.$el.scrollWidth * this.scale }px`
          this.height = `${ this.$el.scrollHeight * this.scale }px`
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
      }
    }
  }

  .campaign-builder-area {
    position: absolute;
    overflow: auto;
    height: 100%;
    width: 100%;
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
      top: 110px;
      left: calc(50% - 10px);
      width: 200px;
      border: 2px solid #E8E8E8;
      border-radius: 0 0 10px 10px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.16);
    }
  }
}
</style>
