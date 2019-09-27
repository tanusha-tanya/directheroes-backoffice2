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
        <div class="dh-select dh-audience-status">
          <div class="dh-select-title">Status</div>
          <el-select v-model="status" @change="getAudience" size="small" popper-class="dh-select-popper">
            <el-option label="All" value="audience"></el-option>
            <el-option label="Stuck" value="stuck"></el-option>
            <el-option label="Ignored" value="ignored"></el-option>
          </el-select>
        </div>
        <div class="dh-divider"></div>
        <div class="dh-search-input">
          <search />
          <input type="text" class="dh-input" placeholder="Type to search"  v-model="filters.usernameQuery" @keypress.enter="getAudience">
        </div>
      </div>
      <div class="dh-list" v-if="threads">
        <div class="dh-list-item" v-for="thread in threads" :key="thread.id">
          <div class="dh-thread-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl  })`}"></div>
          <div class="dh-thread-data-item dh-thread-username">
            <div class="dh-thread-data-item-main">{{thread.contactProfile.fullName}}</div>
            {{thread.contactProfile.username}}
          </div>
          <div class="dh-thread-data-item">
            <div class="dh-thread-data-item-main">{{fromNowDate(thread.subscribedAt)}}</div>
            Subscribed
          </div>
          <div class="dh-thread-data-item">
            <div class="dh-thread-data-item-main">{{fromNowDate(thread.lastMessageAt)}}</div>
            Last Message
          </div>
          <div class="dh-thread-data-item">
            <div class="dh-thread-data-item-main">{{thread.campaignList.length}}</div>
            Campaigns
          </div>
          <div class="dh-spacer"></div>
          <router-link :to="{ name: 'livechat', params: { threadId: thread.id, subscribed: subscribedText }, query: {p: paging.page, q: filters.usernameQuery, st: status }}" class="dh-thread-controls">
            <livechat/>
          </router-link>
        </div>
      </div>
      <loader v-else/>
      <div class="dh-audience-thread-controls" v-if="threads && paging && paging.totalPageCount > 1">
        <div class="dh-audience-thread-info">
          Total subscribers: {{ paging.totalResultCount }}
        </div>
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="paging.page"
          :page-count="paging.totalPageCount"
          @current-change="changePage"
        ></el-pagination>
      </div>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
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
        campaignId: null,
      },
      paging: {
        page: 1,
        totalPageCount: 1
      }
    }
  },

  components: {
    dhHeader,
    dhFooter,
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
      return moment(new Date(date * 1000)).fromNow();
    },

    changePage(page) {
      this.paging.page = page;
      this.getAudience();
    },
  },

  watch: {
    '$store.state.accounts'() {
      this.getAudience();
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
}
</style>