<template>
  <div class="dh-campaigns" >
    <template v-if="currentAccountData">
      <div class="dh-campaigns-controls">
        <div class="dh-campaigns-title">{{title}}</div>
        <div class="dh-new-item-button" @click="isAddCampaign = true">
          <plus/><span>New campaign</span>
        </div>
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
          <el-popover placement="bottom" trigger="click">
            <div class="dh-options">
              <div class="dh-option" @click="campaignToDelete = campaign">
                <trash /> Delete
              </div>
              <div class="dh-option" @click="prepareToRename(campaign)">
                <task /> Rename
              </div>
              <div class="dh-option" @click="prepareToClone(campaign)">
                <duplicated  /> Clone
              </div>
            </div>
            <div class="dh-campaign-actions" slot="reference" @click="blockEvent">
              <ellipsis />
            </div>
          </el-popover>
        </router-link>
      </div>
      <div class="dh-info" v-else>
        <nocampaign/>
        <span>
          <strong>No campaigns found?</strong>
          Try creating a new campaign from scratch or<br>
          view one of our tutorials.
        </span>
      </div>
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
import calendar from '../assets/schedule.svg'
import loader from './dh-loader'

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
    duplicated
  },

  props: ['title', 'limit'],

  computed: {
    account() {
      return this.$store.state.currentAccount
    },

    campaigns() {
      const { limit, currentAccountData } = this;
      let campaigns = null;

      if (!currentAccountData) return null;

      campaigns = currentAccountData.campaigns.filter(campaign => campaign.type == 'regular' && !campaign.isArchived);

      campaigns.reverse();

      return limit ? campaigns.sort((a, b) => b.isActive - a.isActive).slice(0, limit) : campaigns;
    },

    currentAccountData() {
      const { currentAccountData } = this.$store.state;

      return currentAccountData
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
        return 'Clone'
      }
    },

    campaignActionButton() {
      const { isAddCampaign, campaignToRename, campaignToClone } = this;

      if (isAddCampaign) {
        return 'Create'
      } else if (campaignToRename) {
        return 'Rename Campaign'
      } else if (campaignToClone) {
        return 'Clone Campaign'
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

    prepareToClone(campaign) {
      this.newCampaignName = campaign.name;
      this.campaignToClone = campaign;
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
      const { newCampaignName, campaignToClone, $store } = this;
      const { currentAccountData } = $store.state;
      const newCampaign = JSON.parse(JSON.stringify(campaignToClone));

      newCampaign.name = newCampaignName;
      newCampaign.id = (new ObjectId).toString(),
      newCampaign.createdAt = Date.now(),
      newCampaign.isEnabled = false,
      newCampaign.isActive = false

      currentAccountData.campaigns.push(newCampaign);

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
  }
}
</script>

<style lang="scss">
.dh-campaigns {
  .dh-loader {
    min-height: 50vh;
  }

  .dh-campaigns-title {
    font-size: 18px;
    line-height: 22px;
  }

  .dh-list-item {
    align-items: center;

    & > svg {
      margin-right: 22px;
    }

    &:hover {
      .dh-campaign-name {
        color: $elementActiveColor;
      }
    }
  }

  .dh-campaign-toggle {
    margin-right: 20px;
    // .el-switch {
    //   pointer-events: none;
    // }
  }

 .dh-campaign-active-indicator {
   width: 7px;
   height: 7px;
   border-radius: 7px;
   background-color: $elementsColor;
   display: inline-block;
   vertical-align: middle;

   &.dh-campaign-active {
     background-color: $successColor;
   }
 }

  .dh-campaign-info {
    flex-grow: 1;
  }

  .dh-info {
    margin-top: 10px;

    strong {
      color: $mainTextColor;
      font-weight: normal;
      display: block;
      margin-bottom: 10px;
    }
  }

  .dh-campaign-name {
    svg {
      width: 14px;
    }
  }

  .dh-campaign-date {
    display: flex;
    align-items: center;
    margin-top: 4px;

    svg {
      margin-right: 6px;
    }
  }

  .dh-campaign-actions {
    cursor: pointer;
    margin-top: -5px;
  }
}

.dh-campaign-add-dialog {
  .dh-campaign-add-input {
    input {
      width: 100%;
    }
  }
}
</style>