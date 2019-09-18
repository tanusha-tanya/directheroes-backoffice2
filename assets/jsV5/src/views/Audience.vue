<template>
  <div class="dh-view dh-audience-view">
    <dh-header title="Audience"></dh-header>
    <div class="dh-view-content">
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
          <router-link :to="{ name: 'livechat', params: { threadId: thread.id }}" class="dh-thread-controls">
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
    loader
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    },
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

  .dh-audience-thread-controls {
    padding: 30px 0 10px;
    display: flex;
    justify-content: space-between;
  }
}
</style>