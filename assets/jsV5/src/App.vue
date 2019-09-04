<template>
  <div class="dh-application">
    <div class="dh-navigation">
      <router-link class="dh-logo" :to="{ name: 'accounts'}"><dh-logo/></router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <dashboard/>
        </div>
        Dashboard
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <campaigns/>
        </div>
        Campaigns
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <broadcast/>
        </div>
        Broadcsat
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <livechat/>
        </div>
        Live chat
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <audience/>
        </div>
        Audience
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <schedule/>
        </div>
        Schedule
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <tutorials/>
        </div>
        Tutorials
      </router-link>
      <router-link :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
        <div class="dh-navigation-button-ico">
          <support/>
        </div>
        Support
      </router-link>
    </div>
    <div class="dh-content"></div>
  </div>
</template>

<script>
import dhLogo from './assets/logo.svg'
import dashboard from './assets/dashboard.svg'
import campaigns from './assets/campaigns.svg'
import broadcast from './assets/broadcast.svg'
import livechat from './assets/livechat.svg'
import audience from './assets/audience.svg'
import schedule from './assets/schedule.svg'
import tutorials from './assets/tutorials.svg'
import support from './assets/support.svg'

export default {
  components: {
    dhLogo,
    dashboard,
    campaigns,
    broadcast,
    livechat,
    audience,
    schedule,
    tutorials,
    support,
  },

  computed: {
    account() {
      const { state } = this.$store;

      return state.currentAccount || { id: 0 };
    },

    hasAccounts() {
      const { state } = this.$store;

      return state.accounts.length;
    },

    isfullSideBar() {
      const { state } = this.$store;

      return state.isfullSideBar;
    }
  },
}
</script>

<style lang="scss">
@import './styles/fonts.scss';
@import './styles/common.scss';

body {
  margin: 0;
  height: 100vh;
  background-color: $mainBGColor;
  font: normal 14px Rubik, sans-serif;
  color: $mainTextColor;

  * {
    box-sizing: border-box;
  }
}

.dh-application {
  height: 100%;
  display: flex;

  .dh-navigation {
    width: 242px;
    background-color: $sectionBG;
    height: 100%;
    border-right: 1px solid #D8D8D8;
  }

  .dh-logo {
    width: 100%;
    display: block;
    padding: 22px 35px 12px 35px;
  }

  .dh-navigation-button {
    display: flex;
    align-items: center;
    text-decoration: none;
    text-transform: uppercase;
    color: $elementsColor;
    border-left: 2px solid transparent;
    padding: 21px 28px 22px 26px;
    letter-spacing: .3px;
    line-height: 17px;

    &.router-link-exact-active {
      font-weight: 500;
      border-color: $elementActiveColor;
      background-color: $mainBGColor;
    }
  }

  .dh-navigation-button-ico {
    margin-right: 18px;
  }

  .dh-content {
    height: 100%;
    max-height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
