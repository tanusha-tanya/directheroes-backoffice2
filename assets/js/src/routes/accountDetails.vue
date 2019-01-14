<template>
  <div class="account-content" v-if="currentAccount">
    <div class="side-bar">
      <router-link class="side-bar-item avatar" :to="{ name: 'accountHome' }">
        <div class="account-avatar" :style="{'background-image': `url(${ currentAccount.profilePicUrl })`}"></div>
      </router-link>
      <router-link class="side-bar-item" :to="{ name: 'accounts' }">
        <img :src="home"/>
      </router-link>
       <router-link class="side-bar-item" :to="{ name: 'accountCampaign', params: { accountId: currentAccount.id } }">
        <img :src="socialBuffer"/>
      </router-link>
      <router-link class="side-bar-item" :to="{ name: 'audience' }">
        <img :src="people"/>
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import home from '../assets/svg/home.svg'
import people from '../assets/svg/people.svg'
import socialBuffer from '../assets/svg/social-buffer.svg'

export default {
  beforeRouteEnter(to, from, next) {
    next(accountComponent => {
      accountComponent.selectAccount(to);
    });
  },

  beforeRouteUpdate(to, from, next) {
    this.selectAccount(to);
    next();
  },

  data() {
    return {
      home,
      people,
      socialBuffer
    }
  },

  methods: {
    selectAccount(route) {
      const { $store } = this
      const { accounts } = $store.state
      const { accountId } = route.params

      if (!accountId) return;
      
      $store.commit('selectAccount', accounts.find(account => account.id == accountId))
    }
  },
  computed: {
    currentAccount() {
      return this.$store.state.currentAccount;
    },
  },

  watch: {
    '$store.state.accounts'() {
      if (this.currentAccount) return;

      this.selectAccount(this.$route);
    },
  }
}
</script>
<style lang="scss">
.account-content {
  height: calc(100vh - 50px);
  display: flex;
  
  .side-bar {
    width: 50px;
    height: 100%;
    background-color: #fff;
    flex-shrink: 0;
  }

  .side-bar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;

    &:not(.avatar) {
      box-shadow: 0px 2px 13px rgba(207, 207, 207, 0.5);
    }
  }

  .account-avatar {
    width: 27px;
    height: 27px;
    border-radius: 50px;
    background-size: contain;
    background-position: center;
  }
}
</style>
