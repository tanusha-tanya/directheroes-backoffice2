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
        <div class="dh-campaign-test" v-if="false">
          <button class="dh-button dh-small" :disabled="hasWarning" @click="isTestCampaign = true">Test broadcast</button>
        </div>
        <span></span>
      </div>
    </dh-header>
    <div class="dh-view-content">
      <old-broadcast-builder ref="oldBuilder" :has-warning="hasWarning" :current-broadcast="currentCampaign"></old-broadcast-builder>
    </div>
    <dh-footer></dh-footer>
    <el-dialog
      :visible.sync="isTestCampaign"
      title="Test Broadcast"
      width="554px"
      append-to-body
      class="dh-campaign-test-dialog"
    >
      <div class="dh-campaign-test-body">
        <el-select
          v-model="selectedSubscriber"
          remote
          filterable
          placeholder="Please enter a subscriber name"
          :remote-method="getSubscribers"
          :loading="searching">
          <el-option
            v-for="subscriber in subscribers"
            :key="subscriber.id"
            :label="subscriber.username"
            :value="subscriber.id">
            <div class="dh-subscriber-item">
              <div class="dh-subscriber-userpic" :style="{'background-image': `url(${ subscriber.contactProfile.profilePicUrl })`}"></div>
              <div class="dh-subscriber-info">
                <div class="dh-subscriber-name">{{subscriber.contactProfile.fullName}}</div>
                <div class="dh-subscriber-login">@{{subscriber.contactProfile.username}}</div>
              </div>
            </div>
          </el-option>
        </el-select>
      </div>
      <template slot="footer">
        <span></span>
        <button class="dh-button dh-reset-button" :disabled="sending" @click="isTestCampaign = false">Cancel</button>
      </template>
  </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
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
      sending: false,
      subscribers: [],
      searching: false,
      currentCampaign: null,
      builder: null,
      selectedSubscriber: null,
      source: null,
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
    accountId() {
      return this.$route.params.accountId
    },

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

    getSubscribers(keyword) {
      const { source, accountId } = this;
      const CancelToken = axios.CancelToken;

      this.searching = true;

      if (source) {
        source.cancel('Lalala')
      }

      this.source = CancelToken.source();

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ accountId }/audience`,
        method: 'post',
        data: {
          usernameQuery: keyword,
          subscribed: 'all',
          paging: {
            page: 1,
            totalPageCount: 1
          }
        },
        cancelToken: this.source.token
      })
      .then(({ data }) => {
        this.searching = false;

        this.subscribers = data.response.body.threadList;
      }).catch(()=> {});
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

.dh-subscriber-item {
  display: flex;
  align-items: center;

  .dh-subscriber-userpic {
    width: 30px;
    height: 30px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    margin-right: 16px;
  }

  .dh-subscriber-info {
    line-height: normal;
    color: #252631;
    margin-top: 2px;
  }

  .dh-subscriber-login {
    color: #98A9BC;
    font-size: 12px;
  }
}

.dh-campaign-test-dialog {
  .el-select {
    width: 100%;
    .el-input {
      .el-input__inner {
        background-color: $sectionBG;
        border: 1px solid $borderColor;
        border-radius: 4px;
        padding: 14px 19px 16px 17px;
        line-height: 17px;
        font-weight: 500;
        color: $inputTextColor;
        outline: none;
      }

      &.is-focus {
        .el-input__inner {
          border-color: #9E4CF9;
        }
      }
    }
  }
}
</style>
