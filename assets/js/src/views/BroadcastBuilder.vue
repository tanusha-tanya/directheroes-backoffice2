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
                <div class="start-message" v-else-if="builder.broadcastRuntime.status === 'running' && !builder.broadcastRuntime.sentMessages">Preparing to start</div>
                <div class="fail-message" v-else-if="builder.broadcastRuntime.status === 'interrupted'">Broadcast was interrupted</div>
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
        <div class="dh-campaign-test" v-if="canTestBroadcast">
          <button class="dh-button dh-small" :disabled="hasWarning" @click="isTestCampaign = true">Test broadcast</button>
        </div>
        <div class="dh-campaign-interrupt" v-if="canCancelBroadcast">
           <el-tooltip
            popper-class="dh-button-error"
            :value="Boolean(error)"
            placement="left"
            :content="error"
            :manual="true">
            <dh-button class="dh-button-interrupt" size="small" type="outline" :loading="inInterrupt" @click="isInterruptWarning = true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0.9375C6.67578 0.9375 5.44531 1.27148 4.30859 1.93945C3.20703 2.58398 2.33398 3.45703 1.68945 4.55859C1.02148 5.69531 0.6875 6.92578 0.6875 8.25C0.6875 9.57422 1.02148 10.8047 1.68945 11.9414C2.33398 13.043 3.20703 13.916 4.30859 14.5605C5.44531 15.2285 6.67578 15.5625 8 15.5625C9.32422 15.5625 10.5547 15.2285 11.6914 14.5605C12.793 13.916 13.666 13.043 14.3105 11.9414C14.9785 10.8047 15.3125 9.57422 15.3125 8.25C15.3125 6.92578 14.9785 5.69531 14.3105 4.55859C13.666 3.45703 12.793 2.58398 11.6914 1.93945C10.5547 1.27148 9.32422 0.9375 8 0.9375ZM8 2.0625C9.125 2.0625 10.168 2.34375 11.1289 2.90625C12.0547 3.45703 12.793 4.19531 13.3438 5.12109C13.9062 6.08203 14.1875 7.125 14.1875 8.25C14.1875 9 14.0586 9.72656 13.8008 10.4297C13.543 11.0977 13.1797 11.707 12.7109 12.2578L4.08008 3.45117C4.61914 3.00586 5.22266 2.66602 5.89062 2.43164C6.55859 2.18555 7.26172 2.0625 8 2.0625ZM3.28906 4.24219L11.9199 13.0488C11.3809 13.4941 10.7773 13.8398 10.1094 14.0859C9.44141 14.3203 8.73828 14.4375 8 14.4375C6.875 14.4375 5.83203 14.1562 4.87109 13.5938C3.94531 13.043 3.20703 12.3047 2.65625 11.3789C2.09375 10.418 1.8125 9.375 1.8125 8.25C1.8125 7.5 1.94141 6.77344 2.19922 6.07031C2.45703 5.40234 2.82031 4.79297 3.28906 4.24219Z" fill="currentColor"/>
              </svg>
              Stop broadcast
            </dh-button>
          </el-tooltip>
        </div>
      </div>
    </dh-header>
    <div class="dh-view-content">
      <old-broadcast-builder ref="oldBuilder" :has-warning="hasWarning" :current-broadcast="currentCampaign"></old-broadcast-builder>
    </div>
    <dh-footer></dh-footer>
    <dh-campaign-test-dialog v-model="isTestCampaign" v-if="isTestCampaign" :campaign-id="currentCampaign.id"></dh-campaign-test-dialog>
    <el-dialog
      v-if="currentCampaign"
      :visible.sync="isInterruptWarning"
      width="554px"
      append-to-body
      class="dh-deactivate-dialog"
    >
      <template slot="title">
        <div class="el-dialog__title">
          Are you sure you wish to stop<br><strong>{{currentCampaign.name}}</strong> broadcast?
        </div>
      </template>
      <div class="dh-deactivate-body">
        By deactivating your broadcast, the remaining contacts that are in the message queue will no longer receive your message.<br/><br/>
        You will not be able to reactivate this broadcast at anytime to continue the queued messages and this interrupted broadcast will still count against your monthly broadcasts quota.<br/><br/>
        Please note, when you deactivate your broadcast, all campaigns you have active will continue to send messages out.<br/><br/>
        Are you sure you want to deactivate this broadcast?
      </div>
      <template slot="footer">
        <button class="dh-button dh-danger-button" @click="interruptBroadcast">Yes, Deactivate Broadcast</button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
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
      inInterrupt: false,
      error: null,
      isInterruptWarning: false,
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

    canTestBroadcast() {
      const { builder } = this;

      return builder && ((!builder.broadcastRuntime && !builder.startAt) || !['running', 'interrupted', 'completed'].includes(builder.broadcastRuntime.status))
    },

    canCancelBroadcast() {
      const { builder } = this;

      return builder && builder.broadcastRuntime && builder.broadcastRuntime.status === 'running';
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

    interruptBroadcast() {
      const { builder } = this;
      const { campaignId, accountId } = this.$route.params;

      this.isInterruptWarning = false;
      this.inInterrupt = true;
      this.error = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/campaign/cancel`,
        method: 'post',
        data: {
          campaignId,
          accountId: parseInt(accountId)
        }
      })
        .then(({ data }) => {
          //builder.broadcastRuntime = data.response.body;
        })
        .catch(error => {
          const { response } = error;
          let errorMessage = error.message;

          if (response && response.data && response.data.request) {
            const { statusMessage } = response.data.request;

            errorMessage = statusMessage;
          }

          this.error = errorMessage;
          console.dir(error)
        })
        .finally(() => {
          this.inInterrupt = false;
        })
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

  .dh-button-interrupt {
    svg {
      margin-right: 5px;
      margin-top: -2px;
    }
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
