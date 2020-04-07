<template>
  <div class="dh-campaigns" >
    <template v-if="currentAccountData">
      <div class="dh-campaigns-controls">
        <div class="dh-campaigns-title">{{title}}</div>
        <tariff-wrapper class="dh-new-item-button" @click.native="isAddCampaign = true" :is-enabled="limitIsAvailable">
          <plus/><span>New campaign</span>
        </tariff-wrapper>
      </div>
      <div class="dh-list" v-if="campaigns && campaigns.length">
        <router-link :to="{ name: 'accountCampaign', params:{ campaignId: campaign.id }}" class="dh-list-item" v-for="campaign in campaigns" :key="campaign.id">
          <star/>
          <div class="dh-campaign-info">
            <div class="dh-campaign-name">
              <el-tooltip
                class="campaign-warning"
                effect="light"
                content="The flow is incomplete, please fix all warnings before activating it"
                v-if="hasWarning(campaign)"
              >
                <triangle/>
              </el-tooltip>
              <div v-else :class="{'dh-campaign-active-indicator':true, 'dh-campaign-active': campaign.isActive}">
              </div>
              {{campaign.name}}
            </div>
            <div class="dh-campaign-date"><calendar/>{{formatedCampaignDate(campaign)}}</div>
          </div>
          <div class="dh-campaign-toggle" @click.prevent="">
            <template v-if="campaign.isActive">
              <el-switch :value="campaign.isActive" @change="campaignToDeactivate = campaign"></el-switch>
            </template>
            <template v-else>
              <el-tooltip
                effect="light"
                content="Please reopen campaign to reactivate this flow"
                >
                <el-switch :value="campaign.isActive"></el-switch>
              </el-tooltip>
            </template>
          </div>
          <el-popover popper-class="dh-campaign-action-popover" placement="bottom" trigger="click">
            <div class="dh-options">
              <div class="dh-option" @click="campaignToDelete = campaign">
                <trash /> Delete
              </div>
              <div class="dh-option" @click="prepareToRename(campaign)">
                <task /> Rename
              </div>
              <tariff-wrapper class="dh-option" @click.native="prepareToClone(campaign)" :is-enabled="limitIsAvailable">
                <duplicated /> Clone
              </tariff-wrapper>
              <div class="dh-option" @click="$router.push({ name: 'accountCampaignStatistics', params: { campaignId: campaign.id } })">
                <chart /> Campaign perfomance
              </div>
            </div>
            <div class="dh-campaign-actions" slot="reference" @click="blockEvent">
              <ellipsis />
            </div>
          </el-popover>
        </router-link>
      </div>
      <div class="dh-info" v-else>
        <span>
          <strong>You don't have any campaigns</strong>
          Create a new campaign from scratch <br/>
          <span v-if="!title"> or use one of our templates</span>
        </span>
      </div>
      <template v-if="!title && campaignTemplates && campaignTemplates.length">
        <div class="dh-campaigns-title dh-campaign-templates-title">Templates</div>
        <div class="dh-list">
          <div class="dh-list-item dh-campaign-template" v-for="campaign in campaignTemplates" :key="campaign.id" @click="prepareToClone(campaign, true)">
            <shapes/>
            <div class="dh-campaign-name">
              {{campaign.name}}
            </div>
          </div>
        </div>
      </template>
      <dh-confirm-dialog
        v-model="isDeleteCampaign"
        title="Delete campaign"
        message="Are you sure you want to delete campaign?"
        @success="deleteCampaign">
      </dh-confirm-dialog>
      <el-dialog
        :visible.sync="isCampaignAction"
        :title="campaignActionTitle"
        custom-class="dh-campaign-add-dialog"
        append-to-body
        width="554px"
        >
        <div class="dh-campaign-add-title" v-if="templateName"><strong>Template:</strong>{{templateName}}</div>
        <div class="dh-campaign-add-input">
          <input class="dh-input" v-model="newCampaignName" placeholder="Enter Campaign name">
        </div>
        <template slot="footer">
          <button class="dh-button" :disabled="!newCampaignName || [campaignToRename && campaignToRename.name, campaignToClone && campaignToClone.name].includes(newCampaignName)" @click="actionCampaign">{{campaignActionButton}}</button>
          <button class="dh-button dh-reset-button" @click="isCampaignAction = false">Close</button>
        </template>
      </el-dialog>
      <dh-deactivate-dialog v-model="isDeactivateCampaign" v-if="campaignToDeactivate" :campaign-name="campaignToDeactivate.name" @success="deactivateCampaign"></dh-deactivate-dialog>
    </template>
    <loader v-else/>
  </div>
</template>

<script>
import moment from 'moment'
import plus from '../assets/plus.svg'
import star from '../assets/star.svg'
import dhConfirmDialog from '../components/dh-confirm-dialog'
import dhDeactivateDialog from '../components/dh-deactivate-dialog'
import nocampaign from '../assets/nocampaign.svg'
import ellipsis from '../assets/ellipsis.svg'
import trash from '../assets/trash.svg'
import task from '../assets/task.svg'
import duplicated from '../assets/duplicated.svg'
import chart from '../assets/chart.svg'
import calendar from '../assets/schedule.svg'
import shapes from '../assets/template.svg'
import loader from './dh-loader'
import TariffWrapper from './dh-tariff-wrapper'

import ObjectId from '../../oldJS/utils/ObjectId'
import utils from '../../oldJS/utils'
import triangle from '../../oldJS/assets/triangle.svg'

export default {
  data() {
    return {
      campaignToRename: null,
      campaignToDelete: null,
      campaignToClone: null,
      campaignToDeactivate: null,
      isAddCampaign: false,
      newCampaignName: '',
      templateName: '',
    }
  },

  components: {
    plus,
    star,
    trash,
    calendar,
    ellipsis,
    dhConfirmDialog,
    dhDeactivateDialog,
    loader,
    nocampaign,
    triangle,
    task,
    chart,
    duplicated,
    TariffWrapper,
    shapes
  },

  props: ['title', 'limit'],

  computed: {
    allCampaigns() {
      const { currentAccountData } = this;

      if (!currentAccountData) return null;

      return currentAccountData.campaigns.filter(campaign => campaign.type == 'regular' && !campaign.isArchived);
    },

    campaigns() {
      const { limit, allCampaigns } = this;
      let campaigns = null;

      if (!allCampaigns) return null;

      campaigns = allCampaigns;

      campaigns.reverse();

      return limit ? campaigns.sort((a, b) => b.isActive - a.isActive).slice(0, limit) : campaigns;
    },

    currentAccountData() {
      const { currentAccountData } = this.$store.state;

      return currentAccountData
    },

    campaignTemplates() {
      const { campaignTemplates } = this.$store.state;

      return campaignTemplates
    },

    isCampaignAction: {
      get() {
        const { isAddCampaign, campaignToRename, campaignToClone } = this;

        return Boolean(isAddCampaign || campaignToRename || campaignToClone);
      },
      set() {
        this.campaignToRename = null;
        this.campaignToClone = null;
        this.isAddCampaign = false;
      }
    },

    campaignActionTitle() {
      const { isAddCampaign, campaignToRename, campaignToClone } = this;

      if (isAddCampaign) {
        return 'Create New Campaign'
      } else if (campaignToRename) {
        return 'Rename'
      } else if (campaignToClone) {
        if (campaignToClone.name) {
          return 'Clone'
        } else {
          return 'Create from template'
        }
      }
    },

    campaignActionButton() {
      const { isAddCampaign, campaignToRename, campaignToClone } = this;

      if (isAddCampaign) {
        return 'Create'
      } else if (campaignToRename) {
        return 'Rename Campaign'
      } else if (campaignToClone) {
        if (campaignToClone.name) {
          return 'Clone Campaign'
        } else {
          return 'Create'
        }
      }
    },

    isDeleteCampaign: {
      get() {
        const { campaignToDelete } = this;

        return Boolean(campaignToDelete)
      },
      set(value) {
        this.campaignToDelete = value;
      }
    },

    isDeactivateCampaign: {
      get() {
        const { campaignToDeactivate } = this;

        return Boolean(campaignToDeactivate)
      },
      set(value) {
        this.campaignToDeactivate = value;
      }
    },

    limitIsAvailable() {
      const { getTariffParameter, allCampaigns } = this;
      const liveChatTariff = getTariffParameter('campaign_flow_limit');

      return liveChatTariff && allCampaigns.length < liveChatTariff.total
    }
  },

  methods: {
    formatedCampaignDate(campaign) {
      return moment(campaign.createdAt).format("DD MMM YYYY")
    },

    deleteCampaign() {
      const { campaignToDelete } = this;

      campaignToDelete.isArchived = true;
      this.campaignToDelete = false;
    },

    createCampaign() {
      const { newCampaignName, $store } = this;
      const { currentAccount, currentAccountData } = $store.state;

      const connectStepId = (new ObjectId).toString();

      const newCampaign = {
        id: (new ObjectId).toString(),
        igAccountId: currentAccount.id,
        createdAt: Date.now(),
        type: 'regular',
        isEnabled: false,
        isActive: false,
        isIncomplete: true,
        isArchived: false,
        name: newCampaignName,
        steps: [
        ],
      }

      currentAccountData.campaigns.push(newCampaign);

      this.isAddCampaign = false;
      this.newCampaignName = '';

      this.$router.push({ name: 'accountCampaign', params: { campaignId: newCampaign.id, accountId: currentAccount.id } })
    },

    prepareToRename(campaign) {
      this.newCampaignName = campaign.name;
      this.campaignToRename = campaign;
    },

    prepareToClone(campaign, isTemplate) {
      const campaignCopy = JSON.parse(JSON.stringify(campaign));

      if (isTemplate) {
        this.templateName = campaignCopy.name;
        campaignCopy.name = '';
      }

      this.newCampaignName = campaignCopy.name;
      this.campaignToClone = campaignCopy;
    },

    actionCampaign() {
      const {
        isAddCampaign,
        campaignToRename,
        campaignToClone,
        createCampaign,
        renameCampaign,
        cloneCampaign
      } = this;

      if (isAddCampaign) {
        createCampaign()
      } else if (campaignToRename) {
        renameCampaign()
      } else if (campaignToClone) {
        cloneCampaign()
      }
    },

    renameCampaign() {
      const { newCampaignName, campaignToRename } = this;

      campaignToRename.name = newCampaignName;

      this.campaignToRename = null;
    },

    cloneCampaign() {
      const { newCampaignName, campaignToClone, $store, templateName, $router } = this;
      const { currentAccountData } = $store.state;

      campaignToClone.name = newCampaignName;
      campaignToClone.id = (new ObjectId).toString(),
      campaignToClone.createdAt = Date.now(),
      campaignToClone.isEnabled = false,
      campaignToClone.isActive = false

      currentAccountData.campaigns.push(campaignToClone);

      if (templateName) {
        $router.push({ name: 'accountCampaign', params: { campaignId: campaignToClone.id } })
      }

      this.campaignToClone = null;
    },

    hasWarning(campaign) {
      if (!campaign) return;

      return utils.hasCampaignWarning(campaign);
    },

    deactivateCampaign() {
      this.campaignToDeactivate.isEnabled = false;
      this.campaignToDeactivate.isActive = false;
      this.isDeactivateCampaign = false;
    }
  },

  watch: {
    campaignToClone(newCampaign) {
      if (newCampaign) return;

      this.templateName = '';
      this.newCampaignName = '';
    }
  }
}
</script>

<style lang="scss">
.dh-campaigns {
  .dh-loader {
    min-height: 50vh;
  }

  .dh-campaign-templates-title {
    text-align: center;
    margin-top: 30px;
  }

  .dh-info {
    margin-top: 20px;
  }

  .dh-list-item {
    svg {
      width: 20px;
    }
  }

  .dh-campaign-template {
    height: 50px;

    .dh-campaign-name {
      font-size: 16px;
    }

    svg {
      width: 20px;
      color: #778CA2;
    }
  }
}

.dh-campaign-add-dialog {
  .dh-campaign-add-input {
    input {
      width: 100%;
    }
  }

  .dh-campaign-add-title {
    margin-bottom: 20px;

    strong {
      margin-right: 10px;
    }
  }
}

.dh-campaign-action-popover {
  .dh-disabled-by-tariff {
    &:after {
      margin-left: auto;
    }
  }
}
</style>
