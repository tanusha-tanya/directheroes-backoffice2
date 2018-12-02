<template>
  <div class="campaign-builder" v-if="currentCampaign">
    <campaign-card :campaign="currentCampaign" :ref="campaignStep.id"></campaign-card>
    <step-card :step="step" v-for="step in steps" :key="step.id" ref="steps"></step-card>
    <builder-elements></builder-elements>
    <arrows ref="arrows" :refs="$refs" :arrows="arrows"></arrows>
  </div>    
</template>
<script>
import debounce from 'lodash/debounce'
import campaignCard from '../component/builder-cards/campaignCard.vue'
import stepCard from '../component/builder-cards/stepCard.vue'
import arrows from '../component/arrows.vue'
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
    }
  },

  components: {
    builderElements,
    campaignCard,
    stepCard,
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
      const { currentCampaign } = this
      const arrows = [];

      currentCampaign.steps.forEach(step => step.elements.find(element => {
        if (element.type != 'goToStep') return;

        arrows.push({ parent: step.id, child: element.value.stepId});

        return true;
      }))

      return arrows;
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
          this.updateState = false;

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
  },


  watch:{
    '$store.state.accounts'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    },

    currentCampaign: {
      handler: function (campaign, oldCampaign) {
        
        if (!oldCampaign || !campaign || campaign.id !== oldCampaign.id) return;
        
        const { recalcPathes } = this.$refs.arrows;

        this.$nextTick(recalcPathes)
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
}
</style>
