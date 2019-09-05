<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-dashboard-ig-account" v-if="account">
        <div class="dh-dashboard-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
        </div>
        <div class="dh-dashboard-ig-account-info">
          <div class="dh-dashboard-ig-account-main">
            <div class="dh-dashboard-ig-account-name">{{ account.login }}</div>
            <div class="dh-dashboard-ig-account-data">
              <span><strong>{{ account.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ account.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ account.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-dashboard-ig-account-bio">
            {{ account.bio }}
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
  .dh-dashboard-ig-account {
    padding: 31px 36px 35px 27px;
    border-radius: 4px;
    background-color: $sectionBG;
    min-height: 198px;
    display: flex;
    align-items: flex-start;
  }

  .dh-dashboard-userpic {
    width: 110px;
    height: 110px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
    margin-right: 42px;
  }

  .dh-dashboard-ig-account-info {
    flex-grow: 1;
  }

  .dh-dashboard-ig-account-main {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .dh-dashboard-ig-account-name {
    line-height: 22px;
    font-size: 18px
  }

  .dh-dashboard-ig-account-data  span {
    font-weight: 300;
    margin-left: 15px;
  }

  .dh-campaigns {
    margin-top: 46px;
  }
}
</style>