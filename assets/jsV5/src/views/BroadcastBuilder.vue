<template>
  <div class="dh-view dh-campaign-builder">
    <dh-header title="Broadcast Builder">
      <div class="dh-campaign-controls" v-if="currentCampaign && hasSteps">
        <div class="dh-campaign-warning" v-if="currentCampaign && hasWarning" @click="findWarningStep"><triangle/>This flow is incomplete</div>
        <div class="dh-campaign-settings-wrapper" v-if="builder.currentBroadcast">
          <div class="info" v-if="builder.isComplete">
            <div>Broadcast complete</div>
          </div>
          <div class="info" v-else-if="!hasWarning">
            <div class="start-message" v-if="builder.timeToStart">{{ builder.timeToStart }}</div>
            <div class="fail-message" v-if="builder.notStarted">Campaign didn't start</div>
            <div class="start-message" v-else-if="!builder.timeToStart && !builder.isStarted && !builder.notStarted && builder.startAt">Prepare to start</div>
            <div class="start-message" v-if="builder.isStarted">Broadcast was started</div>
            <div v-if="!builder.startAt">Click to set broadcast</div>
          </div>
          <div class="dh-campaign-gear" @click="builder.isSettings = !builder.isSettings">
            <gear/>
          </div>
        </div>
      </div>
    </dh-header>
    <div class="dh-view-content">
      <old-broadcast-builder ref="oldBuilder" :has-warning="hasWarning" :current-broadcast="currentCampaign"></old-broadcast-builder>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import gear from '../assets/gear.svg'

import OldBroadcastBuilder from '../../../js/src/routes/broadcastBuilder'
import utils from '../../../js/src/utils'
import triangle from '../../../js/src/assets/triangle.svg'

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
    dhHeader,
    dhFooter,
    OldBroadcastBuilder,
    gear,
    triangle
  },

  computed: {
    hasWarning() {
      const { currentCampaign } = this;

      if (!currentCampaign) return;

      return utils.hasCampaignWarning(currentCampaign);
    },

    hasSteps() {
      const { steps } = this.currentCampaign;

      return steps && steps.length;
    },

    campaigns() {
      const { currentAccountData } = this.$store.state;

      if (!currentAccountData) return;

      return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
    },

    builder() {
      return this.$refs.oldBuilder
    }
  },

  methods: {
    setCurrentCampaign(route) {
      const { campaignId } = route.params;
      const { campaigns } = this;

      if (!campaignId || !campaigns) return;

      const currentCampaign = campaigns.find(campaign => campaign.id == campaignId);

      if (currentCampaign) {
        this.currentCampaign = currentCampaign;
      }
    },

    findWarningStep() {
      const { hasWarning } = this;
      const { oldBuilder } = this.$refs;

      oldBuilder.findEntryStep(hasWarning.id);
    }
  },

  watch:{
    '$store.state.currentAccountData'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    }
  }
};
</script>

<style lang="scss">
.dh-campaign-builder {
  .dh-view-content {
    padding: 0;
    height: calc(100vh - 64px - 62px);
    overflow: hidden;
  }

  .dh-campaign-gear {
    width: 18px;
    margin-left: 20px;
  }

  .dh-campaign-controls {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: #778CA2;

    .el-switch {
      margin-left: 5px;
    }
  }

  .dh-campaign-warning {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    svg {
      margin-right: 5px;
      width: 20px;
    }
  }

  .dh-campaign-settings-wrapper {
    display: flex;
    align-items: center;

    .info {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-right: 10px;

      & > div::first-letter {
        text-transform: uppercase;
      }

      .start-message {
        color: #67c23a;
      }

      .fail-message {
        color: #ff0048;
      }
    }
  }
}

.dh-campaign-settings {
  .el-switch{
    margin-right: 10px;
  }
}
</style>
