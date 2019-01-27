<template>
  <div id="app">
    <dh-header></dh-header>
    <div class="content">
      <div class="side-bar">
        <router-link v-if="account" class="side-bar-item avatar" :to="{ name: 'accountHome' }">
          <div class="account-avatar" :style="{'background-image': `url(${ account.profilePicUrl })`}"></div>
        </router-link>
        <router-link class="side-bar-item" :to="{ name: 'accounts' }">
          <img :src="home"/>
        </router-link>
        <router-link v-if="account" class="side-bar-item" :to="{ name: 'accountCampaign', params: { accountId: account.id } }">
          <img :src="socialBuffer"/>
        </router-link>
        <router-link v-if="account" class="side-bar-item" :to="{ name: 'audience' }">
          <img :src="people"/>
        </router-link>
        <router-link class="side-bar-item" :to="{ name: 'video-help' }">
          <img :src="youtube"/>
        </router-link>
      </div>
      <div class="content-container" v-if="dhAccount">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './sections/header.vue'
import home from './assets/svg/home.svg'
import people from './assets/svg/people.svg'
import socialBuffer from './assets/svg/social-buffer.svg'
import youtube from './assets/svg/youtube.svg'

export default {
  name: 'app',

  data() {
    return {
      home,
      people,
      socialBuffer,
      youtube
    }
  },

  components: {
    'dh-header': Header
  },

  computed: {
    account() {
      return this.$store.state.currentAccount;
    },

    accounts() {
      return this.$store.state.accounts.length;
    }
  },


}
</script>

<style lang="scss">
.content {
  display: flex;
  height: calc(100% - 50px);

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

    img {
      max-height: 30px;
      max-width: 30px;
    }
  }

  .account-avatar {
    width: 27px;
    height: 27px;
    border-radius: 50px;
    background-size: contain;
    background-position: center;
  }

  .content-container {
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;
  }
}
</style>
