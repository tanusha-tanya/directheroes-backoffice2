<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-ig-account" v-if="account">
        <div class="dh-ig-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
        </div>
        <div class="dh-ig-account-info">
          <div class="dh-ig-account-main">
            <div class="dh-ig-account-name">{{ account.login }}</div>
            <div class="dh-ig-account-data">
              <span><strong>{{ account.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ account.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ account.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-ig-account-bio" v-html="account.bio && account.bio.replace(/\n/g, '<br>')">
          </div>
        </div>
      </div>
      <dh-campaigns title="Campaigns" :limit="5">
      </dh-campaigns>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaigns from '../components/dh-campaigns'

export default {
  components: {
    dhHeader,
    dhFooter,
    dhCampaigns
  },

  computed: {
    account() {
      const { currentAccount } = this.$store.state;

      return currentAccount
    }
  },
}
</script>

<style lang="scss">
.dh-dashboard-view {
  .dh-campaigns {
    margin-top: 46px;
  }
}
</style>