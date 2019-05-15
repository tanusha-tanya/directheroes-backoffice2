<template>
  <div class="account-dashboard">
    <div class="container-area">
      <div  class="account-card">
        <div class="account-photo" :style="{'background-image': `url(${ account.profilePicUrl })`}"></div>
        <div class="account-login"> @{{ account.login }}</div>
        <div class="account-follow-info">
          <div>{{ account.followingCount || 0 }}<br/>following</div>
          <div>{{ account.followerCount || 0 }}<br/>followers </div>
        </div>
      </div>
      <div class="account-info"> 
        <div class="account-name">{{ account.fullName }}<div class="account-post-count"><strong>{{ account.postCount }}</strong> posts</div> </div>
        <div class="account-bio">{{ account.bio }}</div>
        <a class="account-website" :href="account.website" target="_blank">{{ account.website }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    account() {
      return this.$store.state.currentAccount
    }
  }
}
</script>

<style lang="scss">
  .account-dashboard {
    padding: 40px;
    width: 100%;

    .account-card {
      border-right: 1px solid #DBDBDB;
      flex-shrink: 0;
    }

    .container-area {
      width: 800px;
      margin: 0 auto;
      display: flex;
    }

    .account-info {
      padding: 13px 24px 13px 19px;
      flex-grow: 1;
    }

    .account-name {
      font-size: 18px;
      line-height: 22px; 
      color: #3C3C3C;
      display: flex;
      align-items: center;
    }

    .account-post-count {
      font-size: 13px;
      line-height: 1;
      color: #828282;
      margin-left: 15px;
      border-left: 1px solid #828282;
      padding-left: 5px;
    }

    .account-bio {
      margin-top: 13px;
    }
  }
</style>
