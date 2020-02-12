<template>
  <div class="dh-view dh-campaign-builder">
    <dh-header title="Broadcast Builder">
      <div class="dh-campaign-controls-wrapper" v-if="currentCampaign && hasSteps">
        <span></span>
        <div class="dh-campaign-controls" >
          <div class="dh-campaign-warning" v-if="hasWarning" @click="findWarningStep"><triangle/>This flow is incomplete</div>
          <div class="dh-campaign-settings-wrapper" v-if="builder">
            <div class="info" v-if="builder.broadcastRuntime && builder.broadcastRuntime.status === 'completed'">
              <div>Broadcast complete</div>
            </div>
            <div class="info" v-else-if="!hasWarning">
              <template v-if="builder.broadcastRuntime && builder.startAt">
                <div class="start-message" v-if="builder.broadcastRuntime.status === 'scheduled'">{{timeToStart(builder.startAt)}}</div>
                <!-- <div class="fail-message" v-else-if="builder.notStarted">Campaign didn't start</div> -->
                <!-- <div class="start-message" v-else-if="!builder.timeToStart && !builder.isStarted && !builder.notStarted && builder.startAt">Prepare to start</div> -->
                <div class="start-message" v-else-if="builder.broadcastRuntime.status === 'running' && !builder.broadcastRuntime.sentMessages">Preparing to start</div>
                <div class="start-message" v-else-if="builder.broadcastRuntime.status === 'running'">Broadcast was started</div>
              </template>
              <div v-if="!builder.startAt">Click to set broadcast</div>
              <div v-else-if="!builder.broadcastRuntime">Getting status info</div>
            </div>
            <div class="dh-campaign-gear" @click="toggleBuilderSettings">
              <gear/>
            </div>
          </div>
        </div>
        <div class="dh-campaign-test">
          <button class="dh-button dh-small" :disabled="hasWarning" @click="isTestCampaign = true">Test broadcast</button>
        </div>
      </div>
    </dh-header>
    <div class="dh-view-content">
      <old-broadcast-builder ref="oldBuilder" :has-warning="hasWarning" :current-broadcast="currentCampaign"></old-broadcast-builder>
    </div>
    <dh-footer></dh-footer>
    <dh-campaign-test-dialog v-model="isTestCampaign" v-if="isTestCampaign" :campaign-id="currentCampaign.id"></dh-campaign-test-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaignTestDialog from '../components/dh-campaign-test-dialog'
import gear from '../assets/gear.svg'

import OldBroadcastBuilder from '../../oldJS/routes/broadcastBuilder'
import utils from '../../oldJS/utils'
import triangle from '../../oldJS/assets/triangle.svg'

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
      isTestCampaign: false,
      currentCampaign: null,
      builder: null,
    }
  },

  components: {
    dhHeader,
    dhFooter,
    OldBroadcastBuilder,
    dhCampaignTestDialog,
    gear,
    triangle,
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

      this.$nextTick(() => {
        this.builder = this.$refs.oldBuilder;
      })
    },

    findWarningStep() {
      const { hasWarning } = this;
      const { oldBuilder } = this.$refs;

      oldBuilder.findEntryStep(hasWarning.id);
    },

    toggleBuilderSettings() {
      const { builder } = this;

      builder.isSettings = !builder.isSettings;
    },

    timeToStart(startAt) {
      return `${moment().from(new Date(startAt), true)} to start`
    },
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

  .dh-campaign-controls-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
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
