<template>
  <drop 
    :class="{'campaign-builder': true, dragged}" 
    v-if="currentCampaign" 
    tag="div"
    @dragover="dragEnter"
    @dragleave="dragLeave"
    @drop="dropHandler"
    @click="removePoint"
  >
    <campaign-card :campaign="currentCampaign" :ref="campaignStep.id"></campaign-card>
    <step-card :step="step" v-for="step in steps" :key="step.id" @delete-step="deleteStep"></step-card>
    <builder-elements></builder-elements>
    <arrows ref="arrows" :refs="builder" :arrows="arrows"></arrows>
  </drop>    
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
      dragged: false
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
        
        switch(element.type) {
          case 'messageConditionMultiple':
          case 'messageTextConditionMultiple':
            element.value.conditionList.forEach(item => {
              if (!item.onMatch || item.onMatch.type !== 'goToStep' || !item.onMatch.value.stepId ) return;

              arrows.push({ parent: collapsed ? step.id : item.id , child: item.onMatch.value.stepId});
            })
          break;
          case 'goToStep':
            arrows.push({ parent: step.id, child: element.value.stepId});
          break;
        }
      }))

      $store.commit('set', { path: 'arrows', value: arrows});

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
          positionX: event.offsetX - 20, 
          positionY: event.offsetY - 20, 
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
  position: absolute;
  overflow: auto;
  height: 100%;
  width:100%;
  transition: background-color .4s;

  &.dragged {
    background-color:#E2E2E2
  }
}
</style>
