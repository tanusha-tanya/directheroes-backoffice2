<template>
  <div class="accounts-content">
    <div class="account-list">
      <router-link  class="account-card" 
        v-for="account in accounts" 
        :key="account.id"
        :to="{ name: 'account', params: { accountId: account.id } }"
        >
        <div class="account-photo" :style="{'background-image': `url(${ account.profilePicUrl })`}"></div>
        <div class="account-login"> @{{ account.login }}</div>
        <div class="account-follow-info">
          <div>{{ account.followingCount || 0 }}<br/>following</div>
          <div>{{ account.followerCount || 0 }}<br/>followers </div>
        </div>
      </router-link >
    </div>
  </div>
</template>
<script>

export default {
  computed: {
    accounts() {
      return this.$store.state.accounts
    },
  }
}
</script>
<style lang="scss">
.accounts-content {
  padding: 30px 50px;

  .account-list {
    display: flex;
    flex-wrap: wrap;
    margin: -10px;
  }

  .account-card {
    padding: 17px;
    width: 177px;
    height: 222px;
    background: #FFF;
    border: 1px solid #DBDBDB;
    box-shadow: 0px 2px 4px rgba(215, 215, 215, 0.5);
    border-radius: 10px;
    margin: 10px;
    text-align: center;
    text-decoration: none;
    transition: .5s border-width, .5s border-color;

    &:hover {
      border: 2px solid rgba(106, 18, 203, 0.7);
    }

    .account-photo {
      width: 98px;
      height: 98px;
      border-radius: 50px;
      background-size: contain;
      background-position: center;
      margin: 0 auto 15px;
    }

    .account-login {
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: #3C3C3C;
    }

    .account-follow-info {
      display: flex;
      font-size: 13px;
      margin-top: 15px;
      color: #828282;
      justify-content: space-around;
    }
  }
}
</style>