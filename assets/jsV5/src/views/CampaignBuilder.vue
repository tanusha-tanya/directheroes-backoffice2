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
              <div class="dh-campaign-activate-button" @click="toggleActivation">
                <el-switch v-model="currentCampaign.isEnabled" ></el-switch>
              </div>
            </template>
          </div>
          <div class="dh-campaign-gear" v-if="currentCampaign" @click="previewSettings">
            <info/>
          </div>
        </div>
        <el-dialog
          :visible.sync="isActivateCampaign"
          title="Campaign activation settings"
          custom-class="dh-campaign-activate-dialog"
          append-to-body
          width="554px"
          >
          <div class="dh-campaign-settings">
            <div class="dh-options">
              <div class="dh-option">
                <span>Allow Re-entering campaign <dh-question-mark :title="helpTriggerText.allowReEnter.title" :message="helpTriggerText.allowReEnter.message"></dh-question-mark></span>
                <el-switch v-model="activateOptions.allowReEnter" :disabled="isPreview"></el-switch>
              </div>
              <div class="dh-option">
                <span>Trigger message request only <dh-question-mark v-if="false"></dh-question-mark></span>
                <el-switch v-model="activateOptions.messageRequestOnly" :disabled="isPreview"></el-switch>
              </div>
              <div class="dh-option">
                <span>Non-subscribers only <dh-question-mark :title="helpTriggerText.nonSubscribersOnly.title" :message="helpTriggerText.nonSubscribersOnly.message"></dh-question-mark></span>
                <el-switch v-model="activateOptions.nonSubscribersOnly" :disabled="isPreview"></el-switch>
              </div>
            </div>
          </div>
          <template slot="footer">
            <button v-if="false" class="dh-button" @click="createCampaign">Create</button>
            <button class="dh-button" v-if="isPreview" @click="isActivateCampaign = false">Close</button>
            <button class="dh-button" v-else @click="activateCampaign">Activate Campaign</button>
          </template>
        </el-dialog>
        <dh-deactivate-dialog v-model="isDeactivateCampaign" v-if="currentCampaign" :campaign-name="currentCampaign.name" @success="deactivateCampaign"></dh-deactivate-dialog>
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
import dhQuestionMark from '../components/dh-question-mark'
import dhDeactivateDialog from '../components/dh-deactivate-dialog'
import info from '../assets/info.svg'

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
      isActivateCampaign: false,
      isDeactivateCampaign: false,
      isPreview: false,
      activateOptions: {
        allowReEnter: false,
        nonSubscribersOnly: false,
        messageRequestOnly: false,
      },
      helpTriggerText: {
        allowReEnter: {
          title: 'Help: Allow Re-Entering Campaigin Settings',
          message: 'The "Allow Re-entering campaign setting" gives you and your<br>contacts/subscribers the ability to re-enter this exact campaign.<br> If for some reason they trigger the growth tool entry step again,<br> the campaign will restart for them at the beginning.<br><br> Note: If they re-trigger the entry step, mid campaign, it will force the contact to start again.<br><br> ••USED UNIQUE ENTRY TRIGGERS TO AVOID ANY CONFUSION••',
        },
        nonSubscribersOnly: {
          title: 'Help: Non-Subscribers only Settings',
          message: 'The "Non-subscribers only" setting gives you the ability to ONLY allow<br> new contacts into your list.<br><br> Existing contacts from additional campaigns would not have the ability<br> to enter a campaign that had "Non-subscribers on" setting turned on'
        },
        messageRequestOnly: {

        }
      }
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhQuestionMark,
    dhDeactivateDialog,
    OldCampaignBuilder,
    info,
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
        const newAllowReEnter = JSON.parse(JSON.stringify(allowReEnterElement));
        const nonSubscribersOnly = JSON.parse(JSON.stringify(nonSubscribersOnlyElement));

        nonSubscribersOnly.id = (new ObjectId).toString();
        newAllowReEnter.id = (new ObjectId).toString();

        settings = {
          type: 'group',
          displaySettings: {
            subType: 'settings'
          },
          elements: [newAllowReEnter, nonSubscribersOnly]
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
    },

    activateCampaign() {
      const { currentCampaign, activateOptions } = this;

      this.allowReEnter = activateOptions.allowReEnter;
      this.nonSubscribersOnly = activateOptions.nonSubscribersOnly;

      currentCampaign.isEnabled = true;

      this.isActivateCampaign = false;
    },

    toggleActivation() {
      const { currentCampaign } = this;

      this.isPreview = false;

      if (currentCampaign.isEnabled) {
        this.isDeactivateCampaign = true;
      } else {
        this.isActivateCampaign = true;
      }
    },

    deactivateCampaign() {
      this.currentCampaign.isEnabled = false;
      this.isDeactivateCampaign = false;
    },

    previewSettings() {
      this.isPreview = true;
      this.isActivateCampaign = true;
    }
  },

  watch:{
    '$store.state.currentAccountData'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    },

    isActivateCampaign(value) {
      const { allowReEnter, nonSubscribersOnly, messageRequestOnly, activateOptions } = this;

      if (!value) return

      activateOptions.allowReEnter = allowReEnter;
      activateOptions.nonSubscribersOnly = nonSubscribersOnly;
      activateOptions.messageRequestOnly = messageRequestOnly;
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

  .dh-campaign-control {
    display: flex;
    align-items: center;
  }

  .dh-campaign-activate-button {
    .el-switch {
      pointer-events: none;
    }
  }
}

.dh-campaign-settings {
  .el-switch{
    margin-right: 10px;
  }
}

.el-dialog.dh-campaign-activate-dialog {
  .dh-option {
    padding: 0;
    margin-bottom: 10px;

    span {
      width: 70%;
    }
  }

  .el-dialog__footer {
    justify-content: flex-end;
  }
}
</style>
