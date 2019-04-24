<template>
  <div id="app">
    <dh-header></dh-header>
    <div class="content">
      <div class="side-bar">
        <router-link v-if="account" class="side-bar-item avatar" :to="{ name: 'accountHome' }">
          <div class="account-avatar" :style="{'background-image': `url(${ account.profilePicUrl })`}"></div><span class="side-bar-title">Account</span>
        </router-link>
        <router-link class="side-bar-item" :to="{ name: 'accounts' }">
          <img :src="home"/><span class="side-bar-title">Dashboard</span>
        </router-link>
        <router-link v-if="account" class="side-bar-item" :to="{ name: 'accountCampaignList', params: { accountId: account.id } }">
          <img :src="socialBuffer"/><span class="side-bar-title">Campaign</span>
        </router-link>
        <router-link  v-if="account && dhAccount && dhAccount.features.broadcast" class="side-bar-item" :to="{ name: 'accountBroadcastList', params: { accountId: account.id } }">
          <img :src="broadcast"/><span class="side-bar-title">Broadcast</span>
        </router-link>
        <router-link v-if="account" class="side-bar-item" :to="{ name: 'audience' }">
          <img :src="people"/><span class="side-bar-title">Audience</span>
        </router-link>
        <router-link class="side-bar-item" :to="{ name: 'video-help' }" v-if="dhAccount && dhAccount.features.igCourse">
          <img :src="youtube"/><span class="side-bar-title"> IG Course</span>
        </router-link>
        <router-link class="side-bar-item" :to="{ name: 'book-help' }">
          <img :src="pdf"/><span class="side-bar-title">Documents</span>
        </router-link>
      </div>
      <div class="content-container" v-if="dhAccount">
        <router-view></router-view>
      </div>
      <div class="loading-content" v-else-if="$store.state.firstLoad">
        <div class="pre-loader"></div>
      </div>
      <div class="error-loading" v-else>
        This page failed to load. <br />
        Please reload it, or contact support if problem persists
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
import pdf from './assets/svg/pdf.svg'
import broadcast from './assets/svg/broadcast.svg'

export default {
  name: 'app',

  data() {
    return {
      home,
      people,
      socialBuffer,
      youtube,
      broadcast,
      pdf,
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
    height: 100%;
    background-color: #fff;
    flex-shrink: 0;
    width: 50px;
    transition: .6s width .8s;

    &:hover {
      width: 150px;
      transition: .6s width .3s;

      .side-bar-title {
        opacity: 1;
        transition: .6s opacity .8s;
      }
    }
  }

  .side-bar-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 50px;
    padding: 10px;
    text-decoration: none;
    overflow: hidden;

    &:not(.avatar) {
      box-shadow: 0px 2px 13px rgba(207, 207, 207, 0.5);
    }

    &:hover .side-bar-title{
      color: #434890;
    }

    .side-bar-title {
      font-size: 18px;
      line-height: 22px;
      color: #3C3C3C;
      margin-left: 10px;
      opacity: 0;
      transition: .6s opacity .1s;
    }

    img {
      max-height: 30px;
      max-width: 30px;
      width: 30px;
      flex-shrink: 0;
    }
  }

  .account-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50px;
    background-size: contain;
    background-position: center;
    flex-shrink: 0;
  }

  .content-container {
    flex-grow: 1;
    max-height: 100%;
    overflow: auto;
  }

  .error-loading {
    height: 100%;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 24px;
    line-height: normal;
  }
}
</style>
