<template>
  <div class="dh-application">
    <div class="dh-navigation">
      <router-link class="dh-logo" :to="{ name: 'accounts'}"></router-link>
      <div class="dh-navigation-scroll">
        <div class="dh-navigation-scroll-up" v-if="canScrollUp" @click="scrollMenu('up')"><arrow /></div>
        <span></span>
        <div class="dh-navigation-scroll-down" v-if="canScrollDown" @click="scrollMenu('down')"><arrow /></div>
      </div>
      <div class="dh-navigation-menu" ref="menuNavigation" @scroll="checkScrollButtons">
        <div class="dh-accounts-tool" @click="isShowList = !isShowList">
          <div :class="{'dh-accounts-tool-button': true, 'dh-disabled': isFirstLoad, 'dh-accounts-open': isShowList }">
            <div class="dh-accounts-arrow">
              <arrow/>
            </div>
            <div class="dh-accounts-tool-ico">
              <instagram/>
            </div>
            Instagram accounts
          </div>
          <div :class="{'dh-accounts-wrapper': true, 'dh-accounts-show': isShowList }" @click.stop="" @transitionend="checkScrollButtons">
            <div class="dh-accounts-tool-list">
              <div class="dh-search-input" v-if="accountList.length > 5">
                <search />
                <input type="text" autocomplete="off" class="dh-input" placeholder="Type name to search"  v-model="searchName">
              </div>
              <div :class="{'dh-accounts-list': true, 'dh-accounts-in-search': searchName}">
                <router-link :to="{ name: 'accounts', query:{ action: accountItem.id }}" :class="{'dh-account-item': true, 'dh-account-logged': accountItem.isLoggedIn}" v-for="accountItem in filteredAccountList" :key="accountItem.id">
                  <div class="dh-account-userpic" :style="{'background-image': `url(${ accountItem.profilePicUrl  })`}">
                  </div>
                  <span>
                    @{{accountItem.login}}
                  </span>
                </router-link>
                <div class="dh-no-accounts" v-if="searchName && !filteredAccountList.length">
                  No match
                </div>
              </div>
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
        <router-link v-if="account.id" :class="{'dh-navigation-button': true, 'dh-dashboard-button': true, 'dh-account-logged': account.isLoggedIn}" :to="{ name: 'accountHome', params: { accountId: account.id}}">
          <div class="dh-account-userpic" :style="{'background-image': `url(${ account.profilePicUrl  })`}">
          </div>
          <span>
            @{{account.login}}
          </span>
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'accountCampaignList', params: { accountId: account.id}}">
          <dh-permission-wrapper :code="permission.CAMPAIGN">
            <div class="dh-navigation-button-ico">
              <campaigns/>
            </div>
            Campaigns
          </dh-permission-wrapper>
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'accountBroadcastList', params: { accountId: account.id}}">
          <dh-permission-wrapper :code="permission.BROADCAST">
            <div class="dh-navigation-button-ico">
              <broadcast/>
            </div>
            Broadcast
          </dh-permission-wrapper>
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'livechat', params: { accountId: account.id}}">
           <dh-permission-wrapper class="dh-permission-livechat" :code="permission.LIVE_CHAT">
            <tariff-wrapper :is-enabled="isLiveChatInTariff">
              <div class="dh-navigation-button-ico">
                <livechat/>
              </div>
              Live chat
            </tariff-wrapper>
           </dh-permission-wrapper>
        </router-link>
        <router-link v-if="account.id" class="dh-navigation-button" :to="{ name: 'audience', params: { accountId: account.id}}">
          <dh-permission-wrapper :code="permission.AUDIENCE">
            <div class="dh-navigation-button-ico">
              <audience/>
            </div>
            Audience
          </dh-permission-wrapper>
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
import TariffWrapper from './components/dh-tariff-wrapper'
import easywebinar from '../oldJS/assets/svg/youtube.svg'
import dhPermissionWrapper from './components/dh-permission-wrapper'
import utils from "../oldJS/utils"

export default {
  data() {
    return {
      showWebinarPopup: !localStorage.getItem('webinarInfoViewed'),
      isShowList: false,
      searchName: '',
      canScrollUp: false,
      canScrollDown: false,
      filteredAccountList: [],
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
    TariffWrapper,
    users,
    search,
    userplus,
    arrow,
    dhPermissionWrapper
  },

  computed: {
    dh() {
      return window.dh
    },

    permission() {
      return utils.permission;
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

    isLiveChatInTariff() {
      const { getTariffParameter } = this;
      const liveChatTariff = getTariffParameter('live_chat')

      return liveChatTariff && liveChatTariff.enabled
    },

    accountList() {
      const { accounts } = this.$store.state;

      return accounts
    },
  },

  methods: {
    hidePopup() {
      this.showWebinarPopup = false;
      localStorage.setItem('webinarInfoViewed', true)
    },

    checkScrollButtons() {
      const { menuNavigation } = this.$refs;

      if (!menuNavigation) return;

      this.canScrollUp = menuNavigation.scrollTop;
      this.canScrollDown = menuNavigation.scrollHeight > menuNavigation.offsetHeight &&
      menuNavigation.scrollTop < menuNavigation.scrollHeight - menuNavigation.offsetHeight;
    },

    scrollMenu(direction) {
      const { menuNavigation } = this.$refs;

      if(direction == 'up') {
        menuNavigation.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      } else {
        menuNavigation.scrollTo({
          top: menuNavigation.scrollHeight,
          behavior: "smooth"
        })
      }
    },

    filterAccountList() {
      let sortedList = JSON.parse(localStorage.getItem(`${ this.dhAccount.id }-igs`) || '[]') ;
      let { accountList, searchName } = this;

      sortedList = sortedList.filter(sortedAccount => accountList.find(account => account.id === sortedAccount))

      accountList.forEach(account => {
        if (sortedList.includes(account.id)) return;

        sortedList.push(account.id)
      })

      searchName = searchName.toLowerCase();

      accountList = sortedList.map(sortedAccount => accountList.find(account => account.id === sortedAccount));

      localStorage.setItem(`${ this.dhAccount.id }-igs`, JSON.stringify(sortedList));

      this.filteredAccountList = accountList.filter(account => account.login.toLowerCase().includes(searchName.toLowerCase())).slice(0,5)
    },
  },

  mounted() {
    const { checkScrollButtons } = this;

    this.$nextTick(checkScrollButtons);
  },

  watch: {
    isShowList() {
      const { checkScrollButtons, filterAccountList } = this;

      filterAccountList()

      this.$nextTick(checkScrollButtons);
    },

    '$route.name'() {
      this.searchName = '';
      this.isShowList = false;
    },

    searchName() {
      const { filterAccountList } = this;

      filterAccountList()
    }
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
    // right: 160px !important;
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

    .dh-search-input {
      padding: 10px 10px 10px 27px;
      svg {
        flex-shrink: 0;
      }
    }

    .dh-account-userpic {
      flex-shrink: 0;
      margin-right: 12px;
      box-shadow: 0 0 3px 0#778CA2;
    }

    .dh-enabled-by-tariff {
      display: flex;
      align-items: center;
    }

    .dh-disabled-by-tariff {
      width: 100%;
      justify-content: flex-start;

      &:after {
        margin-left: auto;
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
    z-index: 45;

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

    &:hover {
      color: #9E4CF9;
    }

    &.dh-disabled {
      .dh-disabled-by-tariff {
        &:after {
          display: none;
        }
      }
    }

    &.router-link-exact-active, &.router-link-active:not(.dh-dashboard-button) {
      border-color: $elementActiveColor;
      background-color: $mainBGColor;
      color: #9E4CF9;
    }
  }

  .dh-dashboard-button {
    font-size: 12px;

    &.dh-account-logged {
      .dh-account-userpic {
        &:after {
          bottom: -1px !important;
          right: -1px !important;
        }
      }
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
      position: relative;
      cursor: pointer;
      white-space: nowrap;

      .dh-accounts-arrow {
        width: 10px;
        flex-shrink: 0;
        position: absolute;
        left: 10px;
        top: calc(50% - 2px);
        margin-top: -9px;
        transform: rotate(-90deg);
        color: #778CA2;
        transition: transform .4s linear;
      }

      &.dh-accounts-open {
        .dh-accounts-arrow {
          transform: rotate(0);
          color: $elementActiveColor;
        }
      }
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

    .dh-no-accounts {
      color: #778CA2;
      letter-spacing: 0.3px;
      line-height: 17px;
      font-size: 12px;
      text-align: center;
      text-transform: uppercase;
    }

    .dh-accounts-in-search {
      min-height: 200px;
    }
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
    height: 40px;

    .dh-account-userpic {
      width: 19px;
      height: 19px;
      margin-right: 14px;
      border: none;
    }

    &:hover {
      color: #9E4CF9;
    }
  }

  .dh-dashboard-button, .dh-account-item {
    span {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:not(.dh-account-logged) {
      span {
        &:after {
          content: 'disconnected';
          font-size: 7px;
          color: #F8FAFB;
          background-color: #fe4d4d;
          display: block;
          width: 60px;
          height: 9px;
          line-height: normal;
          text-align: center;
          border-radius: 3px;
        }
      }
    }

    &.dh-account-logged {
      .dh-account-userpic {
        &:after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background-color: $successColor;
          bottom: -2px;
          right: -2px;
        }
      }
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

    &:hover {
      color: #9E4CF9;
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

.dh-permission-livechat {
  width: 100%;
}
</style>
