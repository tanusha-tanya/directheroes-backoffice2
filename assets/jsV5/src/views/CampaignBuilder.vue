<template>
  <div class="dh-view dh-campaign-builder">
    <dh-header title="Campaign Builder">
      <div class="dh-campaign-controls">
        <div class="dh-campaign-warning" v-if="currentCampaign && hasWarning" @click="findWarningStep"><triangle/>This flow is incomplete</div>
        <div class="dh-campaign-settings-wrapper">
          <div class="dh-campaign-control" v-if="currentCampaign" >
            Activate
            <template v-if="hasWarning">
              <el-tooltip
                effect="light"
                content="Please clear all warnings first"
                >
                <el-switch v-model="currentCampaign.isEnabled" :disabled="true"></el-switch>
              </el-tooltip>
            </template>
            <template v-else>
              <el-switch v-model="currentCampaign.isEnabled" ></el-switch>
            </template>
          </div>
          <el-popover placement="bottom" trigger="hover" v-if="currentCampaign" popper-class="dh-campaign-settings">
            <div class="dh-options">
              <div class="dh-option" v-if="hasSteps">
                <el-switch v-model="allowReEnter" ></el-switch> Allow Re-entering campaign
              </div>
              <div class="dh-option" v-if="hasSteps">
                <el-switch v-model="messageRequestOnly" ></el-switch> Trigger message request only
              </div>
              <div class="dh-option" v-if="hasSteps">
                <el-switch v-model="nonSubscribersOnly" ></el-switch> Non-subscribers only
              </div>
            </div>
            <div class="dh-campaign-gear" slot="reference">
              <gear/>
            </div>
          </el-popover>
        </div>
      </div>
    </dh-header>
    <div class="dh-view-content">
      <old-campaign-builder ref="oldBuilder" :has-warning="hasWarning" :current-campaign="currentCampaign"></old-campaign-builder>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import gear from '../assets/gear.svg'

import ObjectId from '../../../js/src/utils/ObjectId'
import OldCampaignBuilder from '../../../js/src/routes/campaignBuilder'
import { allowReEnterElement, messageRequestOnlyElement, nonSubscribersOnlyElement } from '../../../js/src/elements/settings'
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
    OldCampaignBuilder,
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

    settings() {
      const { currentCampaign } = this;
      const entryStep = currentCampaign.steps.find(step => step.displaySettings.isEntry);
      let settings = entryStep.elements.find(element => element.displaySettings.subType === 'settings');

      if (!settings) {
        settings = {
          type: 'group',
          displaySettings: {
            subType: 'settings'
          },
          elements: []
        }

        entryStep.elements.splice(0,0, settings);
      }

      return entryStep && settings;
    },

    allowReEnter: {
      get() {
        const { settings } = this;

        return !Boolean(settings.elements.find(element => element.condition.entity === "campaign" && element.condition.field === "entered"))
      },

      set(value) {
        const { elements } = this. settings;

        if (!value) {
          const newAllowReEnter = JSON.parse(JSON.stringify(allowReEnterElement));

          newAllowReEnter.id = (new ObjectId).toString();

          elements.push(newAllowReEnter);
        } else {
          const allowReEnter = elements.find(element => element.condition.entity === "campaign" && element.condition.field === "entered")

          elements.splice(elements.indexOf(allowReEnter), 1)
        }
      }
    },

    messageRequestOnly: {
      get() {
        const { settings } = this;

        return Boolean(settings.elements.find(element => element.condition.entity === "message" && element.condition.field === "isRequest"));
      },

      set(value) {
        const { elements } = this. settings;

        if (value) {
          const newMessageRequestOnly = JSON.parse(JSON.stringify(messageRequestOnlyElement));

          newMessageRequestOnly.id = (new ObjectId).toString();

          elements.push(newMessageRequestOnly);
        } else {
          const messageRequestOnly = elements.find(element => element.condition.entity === "message" && element.condition.field === "isRequest")

          elements.splice(elements.indexOf(messageRequestOnly), 1)
        }
      }
    },

    nonSubscribersOnly: {
      get() {
        const { settings } = this;

        return Boolean(settings.elements.find(element => element.condition.entity === "contact" && element.condition.field === "subscribed"));
      },

      set(value) {
        const { elements } = this. settings;

        if (value) {
          const nonSubscribersOnly = JSON.parse(JSON.stringify(nonSubscribersOnlyElement));

          nonSubscribersOnly.id = (new ObjectId).toString();

          elements.push(nonSubscribersOnly);
        } else {
          const nonSubscribersOnly = elements.find(element => element.condition.entity === "contact" && element.condition.field === "subscribed")

          elements.splice(elements.indexOf(nonSubscribersOnly), 1)
        }
      }
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
  }
}

.dh-campaign-settings {
  .el-switch{
    margin-right: 10px;
  }
}
</style>
