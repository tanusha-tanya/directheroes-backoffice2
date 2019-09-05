<template>
<div class="dh-view dh-broadcast-view">
  <dh-header title="Broadcast"></dh-header>
  <div class="dh-view-content">
    <div class="dh-campaigns-controls">
      <span></span>
      <div class="dh-new-item-button">
        <plus/><span>New broadcast</span>
      </div>
    </div>
    <div class="dh-campaigns-list" v-if="broadcasts">
      <div class="dh-campaign" v-for="campaign in broadcasts" :key="campaign.id">
        <div class="dh-campaign-name">{{campaign.name}}</div>
        <div class="dh-campaign-actions" @click="deleteCampaign(campaign)">
        <ellipsis/>
        </div>
      </div>
    </div>
  </div>
  <dh-footer></dh-footer>
</div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import plus from '../assets/plus.svg'
import ellipsis from '../assets/ellipsis.svg'

export default {
  components: {
    dhHeader,
    dhFooter,
    ellipsis,
    plus
  },

  computed: {
    broadcasts() {
      const { currentAccountData } = this.$store.state;

      if (!currentAccountData) return null;

      return currentAccountData.campaigns.filter(campaign => campaign.type == 'broadcast' && !campaign.isArchived);
    }
  },

  methods: {
    deleteCampaign(campaign) {
      campaign.isArchived = true;
    },
  }
}
</script>

<style lang="scss">
.dh-broadcast-view {
  .dh-campaign-name {
    flex-grow: 1;
  }
}
</style>