<template>
  <div class="audience-content w800">
    <div class="content-title">Audience</div>
    <div class="audience-filters">
      <input placeholder="Search" v-model="filters.username_query" @keypress.enter="getAudience"/>
      <el-select v-model="filters.subscribed" @change="getAudience">
        <el-option label="All" :value="null"></el-option>
        <el-option label="Subscribed" :value="true"></el-option>
        <el-option label="Unsubscribed" :value="false"></el-option>
      </el-select>
    </div>
    <div class="container-area">
      <div class="list-item header">
        <div class="user-row">User</div>
        <div class="subscribed-row">Subscribed</div>
      </div>
      <div class="list-item" v-for="thread in threads" :key="thread.id">
        <div class="user-row">
          <div class="user-avatar" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
          {{thread.contactProfile.username}}
        </div>
        <div class="subscribed-row">{{subscriberAt(thread.subscribedAt)}}</div>
        <div class="chat-row">
          <router-link :to="{ name: 'accountThreadMessages', params: { threadId: thread.id } }">Live chat</router-link>
          <router-link :to="{ name: 'accountThreadMessages', params: { threadId: thread.id } }" class="account-button" ><img :src="avatar"/></router-link>
        </div>
      </div>
    </div>
    <el-pagination
      background
      v-if="threads && paging && paging.totalPageCount > 1"
      layout="prev, pager, next"
      :current-page="paging.page"
      :page-count="paging.totalPageCount"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import avatar from '../assets/svg/avatar.svg'

export default {
  beforeRouteEnter(to, from, next) {
    next(accountThread => {
      accountThread.getAudience(to);
    })
  },

  data() {
    return {
      threads: null,
      avatar,
      filters: {
        subscribed: null,
        username_query: ''
      },
      paging: {
        page: 1,
        totalPageCount: 1
      }
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    }
  },

  methods: {
    changePage(page) {
      this.paging.page = page;
      this.getAudience();
    },

    getAudience() {
      const { account } = this;

      if (!account) return;

      this.threads = null;

      axios({ 
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/audience`,
        method: 'post',
        data: { ...this.filters, paging: this.paging }
      })
      .then(({ data }) => {
        const { threadList, paging } = data.response.body
        
        this.threads = threadList;
        this.paging = paging;
      })
    },

    subscriberAt(date) {
      return moment(new Date(date)).fromNow();
    }
  },

  watch: {
    '$store.state.accounts'() {
      this.getAudience();
    }
  }
}

</script>
<style lang="scss">
.audience-content {
  padding: 15px 0;

  .content-title {
    margin-bottom: 16px; 
  }

  .audience-filters {
    margin-bottom: 21px;

    input {
      margin-right: 15px;
    }
  }

  .user-row {
    width: 40%;
    padding: 0 10px;
    flex-shrink: 0;
  }

  .subscribed-row {
    width: 20%;
    padding: 0 10px;
    flex-shrink: 0;
  }

  .chat-row {
    text-align: right;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    a {
      background: #828282;
      display: inline-block;
      border: 1px solid #828282;
      text-decoration: none;
      font-size: 13px;
      color: #fff;
      line-height: 19px;
      padding: 2px 26px;
      font-weight: normal;
      border-radius: 20px;

      &.account-button {
        padding: 2px 10px;
        margin-left: 10px;
      }
      
      img {
        width: 11px;
        height: 11px;
      }
    }
  }

  .list-item {
    &.header .user-row{
      padding-left: 46px;
    }
    &:hover {
      a {
        background-color: #6A12CB;
        border-color: #6A12CB;
      }
    }
  }

  .el-pagination {
    text-align: right;
    margin: 15px 0;
    
    &.is-background {
      .btn-next, .btn-prev, .el-pager li {
        background-color: #fff;
      }
    } 
  }
}
</style>