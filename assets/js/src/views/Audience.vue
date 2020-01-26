<template>
  <div class="dh-view dh-audience-view">
    <dh-header title="Audience"></dh-header>
    <div class="dh-view-content">
      <div class="dh-audience-controls">
        <div class="dh-select dh-audience-subscription">
          <div class="dh-select-title">Subscription</div>
          <el-select v-model="filters.subscribed" @change="getAudience" size="small" popper-class="dh-select-popper">
            <el-option label="All" :value="null"></el-option>
            <el-option label="Subscribed" :value="true"></el-option>
            <el-option label="Unsubscribed" :value="false"></el-option>
            <el-option label="Ignored" value="ignored" v-if="isAdmin"></el-option>
          </el-select>
        </div>
        <div class="dh-select dh-audience-status" v-if="isAdmin">
          <div class="dh-select-title">Conversation</div>
          <el-select v-model="status" @change="getAudience" size="small" popper-class="dh-select-popper">
            <el-option label="All" value="audience"></el-option>
            <el-option label="Stuck" value="stuck"></el-option>
            <el-option label="Interrupted" value="interrupted"></el-option>
            <el-option label="Complete" value="complete"></el-option>
          </el-select>
        </div>
        <div class="dh-divider"></div>
        <div class="dh-filter dh-campaign-filter">
          <el-popover placement="bottom" trigger="click" popper-class="dh-campaign-filter-popover" :width="300">
            <div class="dh-options" v-if="account">
              <div class="dh-option">entered any of</div>
              <div class="dh-select-wrapper">
                <el-select v-model="filters.campaigns.in" multiple placeholder="Select campaign">
                  <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
                </el-select>
              </div>
              <div class="dh-option">entered none of</div>
              <div class="dh-select-wrapper">
                <el-select v-model="filters.campaigns.nin" multiple placeholder="Select campaign">
                  <el-option v-for="campaign in campaigns" :key="campaign.id" :label="campaign.name" :value="campaign.id"></el-option>
                </el-select>
              </div>
            </div>
            <template slot="reference">
              <div class="dh-filter-wrapper">
                <div class="dh-filter-title">Campaigns</div>
                <div :class="{'dh-filter-info': true, 'dh-filter-selected': campaignsFilterText }">{{campaignsFilterText || 'All'}}</div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="dh-filter">
          <el-popover placement="bottom" trigger="click" popper-class="dh-category-filter-popover" :width="300">
            <div class="dh-options" v-if="account">
              <div class="dh-option">has any of</div>
              <div class="dh-select-wrapper">
                <el-select v-model="filters.categories.in" multiple placeholder="Select category">
                  <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
              </div>
              <div class="dh-option">has none of</div>
              <div class="dh-select-wrapper">
                <el-select v-model="filters.categories.nin" multiple placeholder="Select category">
                  <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
                </el-select>
              </div>
            </div>
            <template slot="reference">
              <div class="dh-filter-wrapper">
                <div class="dh-filter-title">Categories</div>
                <div :class="{'dh-filter-info': true, 'dh-filter-selected': categoriesFilterText }">{{categoriesFilterText || 'All'}}</div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="dh-divider"></div>
        <div class="dh-search-input">
          <search />
          <input type="text" class="dh-input" placeholder="Type to search"  v-model="filters.usernameQuery" @keypress.enter="getAudience">
        </div>
        <span></span>
        <button class="dh-button dh-small" @click="isExportData = true">Export</button>
      </div>
      <div class="dh-list" v-if="threads">
        <router-link class="dh-list-item" :to="{ name: 'livechat', params: { threadId: thread.id }, query: {p: paging.page, q: filters.usernameQuery, sub: subscribedText }}" v-for="thread in threads" :key="thread.id">
        <!-- <router-link class="dh-list-item" :to="{ name: 'subscriber', params: { threadId: thread.id }}" v-for="thread in threads" :key="thread.id"> -->
          <div class="dh-thread-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl  })`}"></div>
          <div class="dh-thread-data-item dh-thread-username">
            <div class="dh-thread-data-item-main">{{thread.contactProfile.fullName}}</div>
            {{thread.contactProfile.username}}
          </div>
          <div class="dh-thread-data-item">
            <template v-if="fromNowDate(thread.subscribedAt)">
              <div class="dh-thread-data-item-main">{{fromNowDate(thread.subscribedAt)}}</div>
              Subscribed
            </template>
          </div>
          <div class="dh-thread-data-item">
            <div class="dh-thread-data-item-main">{{fromNowDate(thread.lastMessageAt)}}</div>
            Last Message
          </div>
          <div class="dh-thread-data-item" v-if="thread.campaignList.length">
            <div class="dh-thread-data-item-main">{{thread.campaignList.length}}</div>
            Campaigns
          </div>
          <div class="dh-spacer"></div>
          <router-link :to="{ name: 'livechat', params: { threadId: thread.id }, query: {p: paging.page, q: filters.usernameQuery, sub: subscribedText }}" tag="div" class="dh-thread-controls">
            <livechat/>
          </router-link>
        </router-link>
      </div>
      <loader v-else/>
      <div class="dh-audience-thread-controls" v-if="threads">
        <div class="dh-audience-thread-info">
          Total subscribers: {{ paging.totalResultCount }}
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="paging.page"
          :page-count="paging.totalPageCount"
          @current-change="changePage"
          v-if="threads && paging && paging.totalPageCount > 1"
        ></el-pagination>
      </div>
    </div>
    <dh-export-dialog v-model="isExportData" v-if="isExportData" :campaigns="JSON.parse(JSON.stringify(filters.campaigns))" :categories="JSON.parse(JSON.stringify(filters.categories))"></dh-export-dialog>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhExportDialog from '../components/dh-export-dialog'
import livechat from '../assets/livechat.svg'
import search from '../assets/search.svg'
import axios from 'axios';
import loader from '../components/dh-loader'
import moment from 'moment';

export default {
  beforeRouteEnter(to, from, next) {
    next(accountThread => {
      accountThread.getAudience(to);
    })
  },

  data() {
    return {
      threads: null,
      status: 'audience',
      filters: {
        subscribed: true,
        usernameQuery: '',
        campaigns: {
          in: [],
          nin: []
        },
        categories: {
          in: [],
          nin: []
        }
      },
      applyFilterTimeout:null,
      paging: {
        page: 1,
        totalPageCount: 1
      },
      isExportData: false
    }
  },

  components: {
    dhHeader,
    dhFooter,
    dhExportDialog,
    livechat,
    loader,
    search
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    },

    subscribedText() {
      const { subscribed } = this.filters;

      switch(subscribed) {
        case false:
          return 'unsubscribed'
          break;
        case null:
          return 'all'
          break;
        case 'ignored':
          return 'ignored'
          break;
      }
    },

    campaignsFilterText() {
      const { campaigns } = this.filters;
      let filterText = '';

      if (campaigns.in.length) {
        filterText += `${ campaigns.in.length } selected`
      }

      if (campaigns.nin.length) {
        filterText += (filterText ? ', ' : '') + `${ campaigns.nin.length } excluded`
      }

      return filterText
    },

    categoriesFilterText() {
      const { categories } = this.filters;
      let filterText = '';

      if (categories.in.length) {
        filterText += `${ categories.in.length } selected`
      }

      if (categories.nin.length) {
        filterText += (filterText ? ', ' : '') + `${ categories.nin.length } excluded`
      }

      return filterText
    },

    campaigns() {
      const { currentAccountData } = this.$store.state;

      if (!currentAccountData) return;

      return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
    },

    categories() {
      const { subscriberCategoryList } = this.account;

      return subscriberCategoryList;
    }
  },

  methods: {
    getAudience() {
      const { account, status, paging, filters } = this;

      if (!account) return;

      this.threads = null;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/${ status }`,
        method: 'post',
        data: { paging,  ...filters }
      })
      .then(({ data }) => {
        const { threadList, paging } = data.response.body

        this.threads = threadList;
        this.paging = paging;
      })
    },

    fromNowDate(date) {
      const momentDate = moment(new Date(date * 1000))

      return momentDate.isValid() && moment(new Date(date * 1000)).fromNow();
    },

    changePage(page) {
      this.paging.page = page;
      this.getAudience();
    },
  },

  watch: {
    '$store.state.accounts'() {
      this.getAudience();
    },

    'filters.campaigns': {
      handler() {
        const { getAudience } = this;

        clearTimeout(this.applyFilterTimeout);

        this.applyFilterTimeout = setTimeout(getAudience, 2500)
      },
      deep:true
    },

    'filters.categories': {
      handler() {
        const { getAudience } = this;

        clearTimeout(this.applyFilterTimeout);

        this.applyFilterTimeout = setTimeout(getAudience, 2500)
      },
      deep:true
    }
  }
}
</script>

<style lang="scss">
.dh-audience-view {
  .dh-loader {
    min-height: 50vh;
  }

  .dh-audience-controls {
    display: flex;

    & > span {
      flex-grow: 1;
    }
  }

  .dh-audience-subscription {
    margin-right: 20px;

    .el-select {
      width: 140px;
    }
  }

  .dh-audience-status {
    .el-select {
      width: 100px;
    }
  }

  .dh-thread-userpic {
    width: 40px;
    height: 40px;
    background-color: rgba($borderColor, .5);
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
  }

  .dh-thread-data-item {
    width: 17%;
    flex-shrink: 0;
    color: $textColor;
  }

  .dh-thread-username {
    margin-left: 24px;
    width: 25%;
  }

  .dh-thread-data-item-main {
    font-size: 18px;
    line-height: 22px;
    color: $mainTextColor;
  }

  .dh-thread-controls {
    color: inherit;
  }

  .dh-divider {
    border-right: 1px solid rgba($textColor, .5);
    height: 36px;
    margin: 0 15px;
  }

  .dh-audience-thread-controls {
    padding: 30px 0 10px;
    display: flex;
    justify-content: space-between;
  }

  .dh-filter {
    display: flex;
    align-items: center;

    .dh-filter-wrapper {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 12px;
      cursor: pointer;
    }

    .dh-filter-title{
      color: #98A9BC;
      margin-right: 12px;
    }

    .dh-filter-info {
      color: #252631;

      &.dh-filter-selected {
        color: #9E4CF9;
      }
    }

    &.dh-campaign-filter {
      margin-right: 20px;
    }
  }
}

.dh-select-wrapper {
  padding: 0 13px 0 25px;
  margin: -10px 0 10px;

  .el-select {
    width: 100%;

    .el-input {
      &.is-focus {
        .el-input__inner {
          border-color: #9E4CF9;
        }
      }

      .el-input__inner:focus {
        border-color: #9E4CF9;
      }
    }
  }
}

div.el-select-dropdown {
  &.is-multiple {
    .el-select-dropdown__item {
      &.selected {
        color: #9E4CF9;
      }
    }
  }
}
</style>