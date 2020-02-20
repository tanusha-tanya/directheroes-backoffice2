<template>
  <div class="dh-application">
    <div class="dh-navigation">
      <router-link class="dh-logo" :to="{ name: 'accounts'}"></router-link>
      <div class="dh-navigation-scroll">
        <div class="dh-navigation-scroll-up" v-if="canScrollUp"><arrow /></div>
        <span></span>
        <div class="dh-navigation-scroll-down" v-if="canScrollDown"><arrow /></div>
      </div>
      <div class="dh-navigation-menu" ref="menuNavigation" @scroll="checkScrollButtons">
        <div class="dh-accounts-tool" @click="isShowList = !isShowList">
          <div :class="{'dh-accounts-tool-button': true , 'dh-disabled': isFirstLoad }">
            <div class="dh-accounts-tool-ico">
              <instagram/>
            </div>
            Instagram accounts
          </div>
          <div :class="{'dh-accounts-wrapper': true,  'dh-accounts-show': isShowList }" @click.stop="">
            <div class="dh-accounts-tool-list">
              <div class="dh-search-input" v-if="accountList.length > 5">
                <search />
                <input type="text" class="dh-input" placeholder="Type name to search"  v-model="searchName">
              </div>
              <router-link :to="{ name: 'accounts', query:{ action: accountItem.id }}" class="dh-account-item" v-for="accountItem in filteredAccountList" :key="accountItem.id">
                <div class="dh-account-userpic" :style="{'background-image': `url(${ accountItem.profilePicUrl  })`}">
                </div>
                <span>
                  {{accountItem.fullName}}
                  <div :class="{'dh-account-login': true, 'dh-account-logged': accountItem.isLoggedIn}">
                    @{{accountItem.login}}
                  </div>
                </span>
              </router-link>
              <router-link class="dh-account-button" :to="{ name: 'accounts'}">
                <div class="dh-account-button-ico">
                  <users/>
                </div>
                All Accounts
              </router-link>
              <router-link class="dh-account-button" :to="{ name: 'accounts', query:{ action: 'new' }}">
                <div class="dh-account-button-ico">
                  <userplus/>
                </div>
                Connect account
              </router-link>
            </div>
          </div>
        </div>
        <router-link v-if="account.id" class="dh-navigation-button dh-dashboard-button" :to="{ name: 'accountHome', params: { accountId: account.id}}">
          <div class="dh-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
          </div>
          <span>
            {{account.fullName}}&nbsp;
            <div :class="{'dh-account-login': true, 'dh-account-logged': account.isLoggedIn}">
              @{{account.login}}
            </div>
          </span>
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'accountCampaignList', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <campaigns/>
          </div>
          Campaigns
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'accountBroadcastList', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <broadcast/>
          </div>
          Broadcast
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'livechat', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <livechat/>
          </div>
          Live chat
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'audience', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <audience/>
          </div>
          Audience
        </router-link>
        <router-link v-if="false" :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <schedule/>
          </div>
          Schedule
        </router-link>
        <router-link :class="{'dh-navigation-button': true }" :to="{ name: 'affiliate' }">
          <div class="dh-navigation-button-ico">
            <affiliate/>
          </div>
          Partner Program
        </router-link>
        <router-link v-if="hasTutorialAccess" class="dh-navigation-button" :to="{ name: 'tutorials' }">
          <div class="dh-navigation-button-ico">
            <tutorials/>
          </div>
          Tutorials
        </router-link>
        <router-link class="dh-navigation-button" :to="{ name: 'trainings' }">
          <div class="dh-navigation-button-ico">
            <training/>
          </div>
          Trainings
        </router-link>
        <a class="dh-navigation-button dh-easy-webinar" :href="`${ dh.easywebinarLink }/oneclick-registration?attendee_name=${ dh.userName }&attendee_email=${ dh.userName }`">
          <div class="dh-navigation-button-ico">
            <easywebinar/>
          </div>
          Join the Training!
        </a>
        <router-link v-if="false" :class="{'dh-navigation-button': true, 'dh-disabled': !account.id }" :to="{ name: 'accountHome', params: { accountId: account.id}}">
          <div class="dh-navigation-button-ico">
            <support/>
          </div>
          Support
        </router-link>
      </div>
    </div>
    <div class="dh-content" v-if="dhAccount">
      <router-view ></router-view>
      <el-dialog
        :visible.sync="showWebinarPopup"
        width="554px"
        append-to-body
        class="dh-webinar-dialog"
        title="Announcing weekly live training"
        :destroy-on-close="true"
        @close="hidePopup"
      >
        Get the most out of direct heroes, join our weekly webinars with Jeff MacPhearson CEO and Founder of Direct Heroes. <br><br>
        We show you high converting flows, showcase some of the top performing Direct Heroes. And answer questions each week.<br><br>
        Register now using the link in lefthand menu.
        <template slot="footer">
          <button class="dh-button" @click="hidePopup">Ok</button>
        </template>
      </el-dialog>
    </div>
    <loader v-else-if="isFirstLoad"></loader>
    <div class="dh-init-error" v-else>
      <span>
        This page failed to load. <br />
        Please reload it, or contact support if problem persists
      </span>
    </div>
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
import instagram from './assets/instagram.svg'
import search from './assets/search.svg'
import arrow from './assets/arrow.svg'
import tutorials from './assets/tutorials.svg'
import training from './assets/training.svg'
import users from './assets/users.svg'
import userplus from './assets/userplus.svg'
import support from './assets/support.svg'
import affiliate from './assets/affiliate.svg'
import loader from './components/dh-loader'
import easywebinar from '../oldJS/assets/svg/youtube.svg'

export default {
  data() {
    return {
      showWebinarPopup: !localStorage.getItem('webinarInfoViewed'),
      isShowList: false,
      searchName: '',
      canScrollUp: false,
      canScrollDown: false
    }
  },

  components: {
    dhLogo,
    dashboard,
    campaigns,
    broadcast,
    livechat,
    instagram,
    audience,
    schedule,
    tutorials,
    support,
    loader,
    affiliate,
    training,
    easywebinar,
    users,
    search,
    userplus,
    arrow
  },

  computed: {
    dh() {
      return window.dh
    },

    account() {
      const { state } = this.$store;

      return state.currentAccount || { id: 0 };
    },

    hasAccounts() {
      const { state } = this.$store;

      return state.accounts.length;
    },

    isFullSideBar() {
      const { state } = this.$store;

      return state.isfullSideBar;
    },

    isFirstLoad() {
      const { state } = this.$store;

      return state.isFirstLoad;
    },

    hasTutorialAccess() {
      const accessList = ['kalum@adoku.ca']
      const { dhAccount } = this;

      return dhAccount && accessList.includes(dhAccount.username);
    },

    accountList() {
      const { accounts } = this.$store.state;

      return accounts
    },

    filteredAccountList() {
      let { accountList, searchName } = this;

      searchName = searchName.toLowerCase()

      return accountList.filter(account => account.login.toLowerCase().includes(searchName) || account.fullName.toLowerCase().includes(searchName)).slice(0,5)
    },

    checkScrollButtons() {
      const { menuNavigation } = this.$refs;

      this.canScrollUp = menuNavigation.scrollLeft;
      this.canScrollDown = menuNavigation.scrollWidth > menuNavigation.offsetWidth &&
      menuNavigation.scrollLeft < menuNavigation.scrollWidth - menuNavigation.offsetWidth;

      console.log(menuNavigation);
    }
  },

  methods: {
    hidePopup() {
      this.showWebinarPopup = false;
      localStorage.setItem('webinarInfoViewed', true)
    }
  },

  mounted() {
    const { checkScrollButtons } = this;

    this.$nextTick(checkScrollButtons);
  }
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

  .zEWidget-launcher {
    right: 160px !important;
    bottom: -5px !important;
  }
}

.dh-application {
  height: 100%;
  display: flex;

  .dh-navigation {
    width: 242px;
    background-color: $sectionBG;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid $borderColor;
    position: relative;

    .dh-account-userpic {
      flex-shrink: 0;
      margin-right: 12px;
      box-shadow: 0 0 3px 0#778CA2;
    }

    .dh-account-login {
      display: flex;
      align-items: center;
      line-height: normal;

      &:before {
        display: inline-block;
        content: '';
        height: 5px;
        width: 5px;
        background-color: $failColor;
        border-radius: 100%;
        margin-right: 3px;
      }

      &.dh-account-logged {
        &:before {
          background-color: $successColor;
        }
      }
    }
  }

  .dh-navigation-scroll {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    top: 64px;
    bottom: 0;
    width: 0;

    div {
      width: 242px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #9E4CF9;
      color: #fff;
    }

    .dh-navigation-scroll-up {
      border-radius: 0 0 5px 5px;

      svg {
        transform: rotate(180deg)
      }
    }

    .dh-navigation-scroll-down {
      border-radius: 5px 5px 0 0;
    }

    svg {
      width: 20px;
    }
  }

  .dh-search-input {
    padding: 10px 10px 10px 27px;
    svg {
      flex-shrink: 0;
    }
  }

  .dh-navigation-menu {
    height: calc(100% - 64px);
    overflow: auto;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    overflow: -moz-scrollbars-none;

    &::-webkit-scrollbar {
      display: none;
      width: 0 !important
    }
  }

  .dh-logo {
    width: 100%;
    height: 64px;
    background-image: url(./assets/logo.png);
    background-position: center;
    background-size: 70%;
    background-repeat: no-repeat;
    display: block;
    padding: 20px 35px 11px 35px;
  }

  .dh-navigation-button, .dh-accounts-tool-button {
    display: flex;
    align-items: center;
    text-decoration: none;
    text-transform: uppercase;
    color: $elementsColor;
    border-left: 2px solid transparent;
    padding: 21px 28px 22px 26px;
    letter-spacing: .3px;
    line-height: 17px;
    max-height: 65px;

    .dh-account-userpic {
      width: 25px;
      height: 25px;
      border: none;
    }

    &.router-link-exact-active, &.router-link-active:not(.dh-dashboard-button) {
      font-weight: 500;
      border-color: $elementActiveColor;
      background-color: $mainBGColor;
    }
  }

  .dh-dashboard-button {
    font-size: 12px;

    .dh-account-login {
      font-weight: normal;
      font-size: 9px;
    }
  }

  .dh-easy-webinar {
    svg {
      width: 19px;
    }
  }

  .dh-accounts-tool {
    .dh-accounts-tool-button {
      padding: 20px;
      cursor: pointer;
      white-space: nowrap;
    }

    .dh-accounts-tool-ico {
      margin: 0 11px 0 5px;

      svg {
        width: 24px;
      }
    }
  }

  .dh-accounts-wrapper {
    background-color: #F8FAFB;
    box-shadow: inset 13px 0 13px 2px #E8ECEF;
    overflow: hidden;
    max-height: 0;
    transition: max-height .6s linear;

    &.dh-accounts-show {
      max-height: 500px;
    }
  }

  .dh-accounts-tool-list {
    padding: 5px 0;
  }

  .dh-account-item {
    color: $elementsColor;
    letter-spacing: .3px;
    line-height: 17px;
    font-size: 12px;
    padding: 7px 25px;
    text-transform: uppercase;
    display: flex;
    text-decoration: none;
    align-items: center;
    white-space: nowrap;

    cursor: pointer;

    .dh-account-login {
      font-size: 8px;
    }

    .dh-account-userpic {
      width: 19px;
      height: 19px;
      margin-right: 14px;
      border: none;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .dh-account-button {
    color: $elementsColor;
    letter-spacing: .3px;
    line-height: 17px;
    font-size: 12px;
    padding: 7px 25px;
    height: 40px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    cursor: pointer;
    text-decoration: none;

    .dh-account-button-ico {
      width: 19px;
      height: 19px;
      margin-right: 15px;
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

  .dh-init-error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 24px;
  }
}

.dh-webinar-dialog {
  .el-dialog__footer {
    display: flex;
    justify-content: flex-end !important;
  }
}
</style>
