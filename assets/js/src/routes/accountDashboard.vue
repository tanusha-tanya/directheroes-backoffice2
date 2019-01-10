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
      border-right: 1px solid #DBDBDB
    }

    .container-area {
      width: 800px;
      margin: 0 auto;
    }
  }
</style>
