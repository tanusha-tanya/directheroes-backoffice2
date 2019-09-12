<template>
  <div class="dh-campaigns">
    <div class="dh-campaigns-controls">
      <div class="dh-campaigns-title">{{title}}</div>
      <div class="dh-new-item-button">
        <plus/><span>New campaign</span>
      </div>
    </div>
    <div class="dh-list" v-if="campaigns">
      <div class="dh-list-item" v-for="campaign in campaigns" :key="campaign.id">
        <star/>
        <div class="dh-campaign-info">
          <div class="dh-campaign-name">{{campaign.name}}</div>
          <div class="dh-campaign-date"><calendar/>{{formatedCampaignDate(campaign)}}</div>
        </div>
        <el-popover placement="bottom" trigger="click">
          <div class="dh-options">
            <div class="dh-option" @click="campaignToDelete = campaign">
              <trash /> Delete
            </div>
          </div>
          <div class="dh-campaign-actions" slot="reference" @click="blockEvent">
            <ellipsis />
          </div>
        </el-popover>
      </div>
    </div>
    <dh-confirm-dialog
        v-model="isDeleteCampaign"
        title="Delete campaign"
        message="Are you sure you want to delete campaign?"
        @success="deleteCampaign">
      </dh-confirm-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import plus from '../assets/plus.svg'
import star from '../assets/star.svg'
import dhConfirmDialog from '../components/dh-confirm-dialog'
import ellipsis from '../assets/ellipsis.svg'
import trash from '../assets/trash.svg'
import calendar from '../assets/schedule.svg'

export default {
  data() {
    return {
      campaignToDelete: false,

    }
  },

  components: {
    plus,
    star,
    trash,
    calendar,
    ellipsis,
    dhConfirmDialog
  },

  props: ['title', 'limit'],

  computed: {
    campaigns() {
      const { limit } = this;
      const { currentAccountData } = this.$store.state;
      let campaigns = null;

      if (!currentAccountData) return null;

      campaigns = currentAccountData.campaigns.filter(campaign => campaign.type == 'regular');

      return limit ? campaigns.slice(0, limit) : campaigns;
    },

    isDeleteCampaign: {
      get() {
        const { campaignToDelete } = this;

        return Boolean(campaignToDelete)
      },
      set(value) {
        this.campaignToDelete = value;
      }
    }
  },

  methods: {
    formatedCampaignDate(campaign) {
      return moment(campaign.createdAt).format("DD MMM YYYY")
    },

    deleteCampaign(campaign) {
      campaign.isArchived = true;
    },
  }
}
</script>

<style lang="scss">
.dh-campaigns {
  .dh-campaigns-title {
    font-size: 18px;
    line-height: 22px;
  }

  .dh-list-item {
    & > svg {
      margin-right: 22px;
    }

    &:hover {
      .dh-campaign-name {
        color: $elementActiveColor;
      }
    }
  }

  .dh-campaign-info {
    flex-grow: 1;
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
  }
}
</style>