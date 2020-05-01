<template>
  <div class="dh-view dh-campaign-builder">
    <dh-header title="Campaign Builder">
      <div class="dh-campaign-controls">
        <div class="dh-campaign-warning" v-if="currentCampaign && hasWarning" @click="findWarningStep"><triangle/>This flow is incomplete</div>
        <div class="dh-campaign-settings-wrapper" v-if="currentCampaign && hasSteps">
          <div class="dh-campaign-control" >
            Activate
            <template v-if="hasWarning">
              <el-tooltip
                effect="light"
                content="Please clear all warnings first"
                >
                <el-switch v-model="currentCampaign.isActive" :disabled="true"></el-switch>
              </el-tooltip>
            </template>
            <template v-else>
              <div class="dh-campaign-activate-button" @click="toggleActivation">
                <el-switch v-model="currentCampaign.isActive" ></el-switch>
              </div>
            </template>
          </div>
          <div class="dh-campaign-gear" @click="previewSettings">
            <info/>
          </div>
        </div>
        <el-dialog
          :visible.sync="isActivateCampaign"
          title="Campaign activation settings"
          custom-class="dh-campaign-activate-dialog"
          append-to-body
          width="554px"
          v-if="currentCampaign && hasSteps"
          >
          <div class="dh-campaign-settings">
            <div class="dh-options">
              <div class="dh-option">
                <span>Allow Re-entering campaign <dh-question-mark :title="helpTriggerText.allowReEnter.title" :message="helpTriggerText.allowReEnter.message"></dh-question-mark></span>
                <el-switch v-model="allowReEnter" :disabled="isPreview"></el-switch>
              </div>
              <div class="dh-option">
                <span>Non-subscribers only <dh-question-mark :title="helpTriggerText.nonSubscribersOnly.title" :message="helpTriggerText.nonSubscribersOnly.message"></dh-question-mark></span>
                <el-switch v-model="nonSubscribersOnly" :disabled="isPreview"></el-switch>
              </div>
              <div class="dh-option">
                <span>Approve message requests <dh-question-mark :title="helpTriggerText.allowReEnter.title" :message="helpTriggerText.allowReEnter.message" v-if="false"></dh-question-mark></span>
                <el-switch v-model="approvePendingToGeneral" :disabled="isPreview"  active-text="To General" inactive-text="To Primary"></el-switch>
              </div>
              <div class="dh-option" v-if="false">
                <div class="dh-half-size">Schedule campaign start</div>
                <div class="dh-option-controls dh-half-size">
                  <el-radio v-model="isDateStart" :label="false" :disabled="isPreview">Start campaign now</el-radio><br>
                  <el-radio v-model="isDateStart" :label="true" :disabled="isPreview">Schedule campaign</el-radio>
                  <el-date-picker
                    v-model="startAt"
                    type="datetime"
                    time-arrow-control
                    :clearable="false"
                    :disabled="!isDateStart || isPreview"
                    prefix-icon="el-icon-date"
                    :picker-options="startOptions"
                    format="dd MMM yyyy HH:mm"
                    placeholder="Select date and time">
                  </el-date-picker>
                </div>
              </div>
              <div class="dh-option" v-if="false">
                <div class="dh-half-size">Schedule campaign close</div>
                <div class="dh-option-controls dh-half-size">
                  <el-radio v-model="isDateClose" :label="false" :disabled="isPreview">Manual deactivation</el-radio><br>
                  <el-radio v-model="isDateClose" :label="true" :disabled="isPreview">Schedule deactivation</el-radio>
                  <el-date-picker
                    v-model="closeAt"
                    type="datetime"
                    time-arrow-control
                    :clearable="false"
                    :disabled="!isDateClose || isPreview"
                    :picker-options="closeOptions"
                    prefix-icon="el-icon-date"
                    format="dd MMM yyyy HH:mm"
                    placeholder="Select date and time">
                  </el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <template slot="footer">
            <button v-if="false" class="dh-button" @click="createCampaign">Create</button>
            <button class="dh-button" v-if="isPreview" @click="isActivateCampaign = false">Close</button>
            <button class="dh-button" v-else @click="activateCampaign" :disabled="(isDateStart && !startAt) || (isDateClose && !closeAt)">Activate Campaign</button>
          </template>
        </el-dialog>
        <dh-deactivate-dialog v-model="isDeactivateCampaign" v-if="currentCampaign" :campaign-name="currentCampaign.name" @success="deactivateCampaign"></dh-deactivate-dialog>
      </div>
    </dh-header>
    <el-tooltip
      v-if="currentCampaign && currentCampaign.isActive && !reChecked"
      popper-class="dh-button-error"
      :value="Boolean(error)"
      placement="left"
      :content="error"
      :manual="true">
      <dh-button class="dh-button-recheck" type="reset" :loading="inRecheck" @click="recheckCampaignThreads">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 0.5C6.0625 0.5 5.16602 0.6875 4.31055 1.0625C3.50195 1.41406 2.78711 1.91211 2.16602 2.55664C1.54492 3.20117 1.07031 3.94531 0.742188 4.78906L1.7793 5.21094C2.04883 4.50781 2.44141 3.88672 2.95703 3.34766C3.47266 2.80859 4.07031 2.38672 4.75 2.08203C5.46484 1.77734 6.21484 1.625 7 1.625C7.89062 1.625 8.73438 1.83008 9.53125 2.24023C10.3047 2.63867 10.9492 3.18359 11.4648 3.875H9.25V5H13.1875V1.0625H12.0625V2.80273C11.4297 2.08789 10.6855 1.52539 9.83008 1.11523C8.92773 0.705078 7.98438 0.5 7 0.5ZM12.2207 9.28906C11.9512 9.99219 11.5586 10.6133 11.043 11.1523C10.5273 11.6914 9.92969 12.1133 9.25 12.418C8.53516 12.7227 7.78516 12.875 7 12.875C6.09766 12.875 5.24805 12.6699 4.45117 12.2598C3.68945 11.8613 3.04492 11.3164 2.51758 10.625H4.75V9.5H0.8125V13.4375H1.9375V11.6973C2.57031 12.4121 3.31445 12.9688 4.16992 13.3672C5.06055 13.7891 6.00391 14 7 14C7.9375 14 8.83398 13.8125 9.68945 13.4375C10.498 13.0859 11.2129 12.5879 11.834 11.9434C12.4551 11.2988 12.9297 10.5547 13.2578 9.71094L12.2207 9.28906Z" fill="currentColor"/>
        </svg>
        Re-check threads
      </dh-button>
    </el-tooltip>
    <div class="dh-view-content">
      <old-campaign-builder ref="oldBuilder" :has-warning="hasWarning" :current-campaign="currentCampaign"></old-campaign-builder>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import moment from 'moment'
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhQuestionMark from '../components/dh-question-mark'
import dhDeactivateDialog from '../components/dh-deactivate-dialog'
import info from '../assets/info.svg'

import ObjectId from '../../oldJS/utils/ObjectId'
import OldCampaignBuilder from '../../oldJS/routes/campaignBuilder'
import { allowReEnterElement, messageRequestOnlyElement, nonSubscribersOnlyElement } from '../../oldJS/elements/settings'
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
      currentCampaign: null,
      isActivateCampaign: false,
      isDeactivateCampaign: false,
      isPreview: false,
      helpTriggerText: {
        allowReEnter: {
          title: 'Help: Allow Re-Entering Campaigin Settings',
          message: 'The "Allow Re-entering campaign setting" gives you and your<br>contacts/subscribers the ability to re-enter this exact campaign.<br> If for some reason they trigger the growth tool entry step again,<br> the campaign will restart for them at the beginning.<br><br> Note: If they re-trigger the entry step, mid campaign, it will force the contact to start again.<br><br> ••USED UNIQUE ENTRY TRIGGERS TO AVOID ANY CONFUSION••',
        },
        nonSubscribersOnly: {
          title: 'Help: Non-Subscribers only Settings',
          message: 'The "Non-subscribers only" setting gives you the ability to ONLY allow<br> new contacts into your list.<br><br> Existing contacts from additional campaigns would not have the ability<br> to enter a campaign that had "Non-subscribers on" setting turned on'
        },
      },
      isDateStart: false,
      isDateClose: false,
      campaignSettings: {},
      startOptions: {
        disabledDate: this.startDisabledDate
        // disabledDate(time) {
        //   const { closeAt } = this.campaignSettings
        //   // console.log(mo);

        //   return time.getTime() < Date.now();
        // }
      },
      closeOptions: {
        disabledDate: this.closeDisabledDate
        // disabledDate(time) {
        //   // const { startAt } = this.campaignSettings

        //   // console.log(moment(startAt).toDate());


        //   return time.getTime() < Date.now();
        // }
      },
      inRecheck: false,
      error: null,
      reChecked: false,
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
    account() {
      const { currentAccount } = this.$store.state;

      return currentAccount
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
          elements: [newAllowReEnter]
        }

        entryStep.elements.splice(0,0, settings);
      }

      if (!settings.elements) {
        settings.elements = [];
      }

      return entryStep && settings;
    },

    allowReEnter: {
      get() {
        const { settings } = this;

        return !Boolean(settings.elements.find(element => element.condition.entity === "campaign" && element.condition.field === "entered"))
      },

      set(value) {
        const { elements } = this.settings;

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

    nonSubscribersOnly: {
      get() {
        const { settings } = this;

        return Boolean(settings.elements.find(element => element.condition.entity === "contact" && element.condition.field === "subscribed"));
      },

      set(value) {
        const { elements } = this.settings;

        if (value) {
          const nonSubscribersOnly = JSON.parse(JSON.stringify(nonSubscribersOnlyElement));

          nonSubscribersOnly.id = (new ObjectId).toString();

          elements.push(nonSubscribersOnly);
        } else {
          const nonSubscribersOnly = elements.find(element => element.condition.entity === "contact" && element.condition.field === "subscribed")

          elements.splice(elements.indexOf(nonSubscribersOnly), 1)
        }
      }
    },

    startAt: {
      get() {
        const { startAt } = this.campaignSettings;

        return startAt
      },
      set(value) {
        const { campaignSettings } = this;

        Vue.set(campaignSettings, 'startAt', moment(value).utc().format());
        campaignSettings.startAtSetAt = moment().utc().format();

      }
    },

    closeAt: {
      get() {
        const { closeAt } = this.campaignSettings;

        return closeAt;
      },
      set(value) {
        const { campaignSettings } = this;

        Vue.set(campaignSettings, 'closeAt', moment(value).utc().format());
        campaignSettings.closeAtSetAt = moment().utc().format();
      }
    },

    approvePendingToGeneral: {
      get() {
        const { currentCampaign } = this;

        if(!currentCampaign.settings) {
          Vue.set(currentCampaign, 'settings', {});
        }

        return Boolean(currentCampaign.settings.approvePendingToGeneral);
      },

      set(value) {
        const { currentCampaign } = this;

        Vue.set(currentCampaign.settings, 'approvePendingToGeneral', value);
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
      const { currentCampaign, activateOptions, campaignSettings } = this;

      currentCampaign.isEnabled = true;
      currentCampaign.settings = campaignSettings;

      this.isActivateCampaign = false;
    },

    toggleActivation() {
      const { currentCampaign } = this;

      this.isPreview = false;

      if (currentCampaign.isActive) {
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
    },

    startDisabledDate(time) {
      const { closeAt } = this.campaignSettings

      return closeAt ? (time.getTime() < Date.now() || time.getTime() > moment(closeAt).toDate()) : time.getTime() < Date.now();
    },

    closeDisabledDate(time) {
      const { startAt } = this.campaignSettings;

      return time.getTime() < (startAt ? moment(startAt).toDate() : Date.now());
    },

    recheckCampaignThreads() {
      const { currentCampaign, currentAccount } = this;
      this.inRecheck = true;

      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/thread/recheck-campaigns`,
        method: 'post',
        data: {
          accountId: currentAccount.id,
          threadIdList: [],
          depth: '-1day',
          campaignId: currentCampaign.id
        }
      }).then(({ data }) => {
        this.reChecked = true;     
      }).catch(error => {
        const { response } = error;
        let errorMessage = error.message;

        if (response && response.data && response.data.request) {
          const { statusMessage } = response.data.request;

          errorMessage = statusMessage;
        }

        this.error = errorMessage;
        console.dir(error)
      }).finally(() => {
        this.inRecheck = false;
      })
    }
  },

  watch:{
    '$store.state.currentAccountData'() {
      if (this.currentCampaign) return;

      this.setCurrentCampaign(this.$route);
    },

    isActivateCampaign(value) {
      const { allowReEnter, nonSubscribersOnly, activateOptions, currentCampaign } = this;

      if (!value) return;

      this.campaignSettings = currentCampaign.settings || {
        startAt: '',
        startAtSetAt: '',
        closeAt: '',
        closeAtSetAt: '',
      };

      this.isDateStart = Boolean(this.startAt);
      this.isDateClose = Boolean(this.closeAt);
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
    cursor: pointer;

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

  .dh-button-recheck {
    position: absolute !important;
    right: 28px;
    top: 82px;
    background-color: $white;
    box-shadow: 0px 2px 16px rgba(153, 155, 168, 0.12);
    border-radius: 4px;
    z-index: 10;

    svg {
      margin: -3px 10px 0 0;
    }

    &:focus {
      background-color: $white;

      &.dh-button--loading {
        color: transparent;
      }
    }
  }
}

.dh-campaign-settings {
  .el-switch{
    margin-right: 10px;
  }

  .el-radio {
    margin-bottom: 5px;
    .el-radio__label {
      text-transform: none;
      font-weight: normal;
    }
  }
}

.el-dialog.dh-campaign-activate-dialog {
  .dh-option {
    padding: 0;
    margin-bottom: 10px;
    align-items: center;

    .dh-half-size {
      max-width: 50%;
      flex-grow: 1;
    }

    .dh-two-third-size {
      max-width: 60%;
      flex-grow: 1;
    }

    .dh-one-third-size {
      max-width: 30%;
      flex-grow: 1;
    }

    .el-switch {
      width: 50%;
      justify-content: center;
    }

    & > span {
      width: 50%;
    }
  }

  .el-date-editor {
    width: 100%;
  }

  .el-dialog__footer {
    justify-content: flex-end;
  }
}
</style>
