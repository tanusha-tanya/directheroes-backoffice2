<template>
  <div class="dh-view dh-subscriber-info-view">
    <dh-header title="Profile"></dh-header>
    <div class="dh-view-content">
      <div class="dh-subscriber-info" v-if="thread">
        <div class="dh-ig-account">
          <div class="dh-ig-account-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl  })`}">
          </div>
          <div class="dh-ig-account-info">
            <div class="dh-ig-account-main">
              <div class="dh-ig-account-name">{{ thread.contactProfile.fullName }}</div>
              <div class="dh-ig-account-data">
                <span><strong>{{ thread.contactProfile.postCount || 0 }}</strong> posts</span>
                <span><strong>{{ thread.contactProfile.followerCount || 0 }}</strong> followers</span>
                <span><strong>{{ thread.contactProfile.followingCount || 0 }}</strong> following</span>
              </div>
            </div>
            <div class="dh-ig-account-user-name">@{{ thread.contactProfile.username }}</div>
            <div class="dh-ig-account-bio" v-html="thread.contactProfile.bio && thread.contactProfile.bio.replace(/\n/g, '<br>')">
            </div>
          </div>
        </div>
        <div class="dh-ig-account-user-tags">
          <div class="dh-ig-account-title">User Tags</div>
        </div>
      </div>
      <div class="dh-campaigns-controls">
        <div class="dh-campaigns-title">Campaigns</div>
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
        </router-link>
      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import moment from 'moment'

import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaigns from '../components/dh-campaigns'
import star from '../assets/star.svg'
import calendar from '../assets/schedule.svg'

import utils from '../../oldJS/utils'

export default {
  data() {
    return {
      thread: {
        campaignList: [
          { id: "5dc7f93027b2c57422eea171", name: "1234"}
        ],
        contactProfile: {
          followerCount: 13,
          followingCount: 7,
          fullName: "Valerie Dosberg",
          id: 73698,
          instagramId: 4712640,
          isVerified: false,
          postCount: 0,
          profilePicUrl: "https://scontent-atl3-1.cdninstagram.com/vp/708c9ea302273281d974a0227d27cfc9/5E8545CD/t51.2885-19/s150x150/16230420_1892738037679566_5412512550854066176_a.jpg?_nc_ht=scontent-atl3-1.cdninstagram.com",
          username: "dosberg",
        },
        id: 588414,
        isSubscribed: true,
        lastMessageAt: 1574112944,
        subscribedAt: 1574093002,
        subscriberId: 1268722,
        username: "insta.eksperten",
      }
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhCampaigns,
    star,
    calendar,
  },

  computed: {
    campaigns() {
      const { currentAccountData } = this.$store.state;
      const { thread } = this;

      if (!currentAccountData || !thread) return;

      return thread.campaignList.map(campaign => currentAccountData.campaigns.find(accountCampaign => campaign.id === accountCampaign.id))
    },
  },

  methods: {
    hasWarning(campaign) {
      if (!campaign) return;

      return utils.hasCampaignWarning(campaign);
    },

    formatedCampaignDate(campaign) {
      return moment(campaign.createdAt).format("DD MMM YYYY")
    },


  }
}
</script>

<style lang="scss">
.dh-subscriber-info-view {
  .dh-subscriber-info {
    display: flex;
    width: 100%;
  }

  .dh-ig-account {
    margin-right: 31px;
    flex-grow: 1;
  }

  .dh-ig-account-user-tags {
    padding: 31px 36px 35px 27px;
    border-radius: 4px;
    background-color: #fff;
    min-width: 300px;
    flex-shrink: 0;
  }

  .dh-ig-account-title {
    font-size: 20px;
    line-height: 24px;
  }

  .dh-campaigns-controls {
    margin-top: 46px;
  }
}
</style>