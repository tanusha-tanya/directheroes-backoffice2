<template>
  <div class="audience-content w800">
    <div class="content-title">Audience</div>
    <div class="audience-filters">
      <input placeholder="Search" v-model="filters.usernameQuery" @keypress.enter="getAudience"/>
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
        <div class="subscribed-row">6 days ago</div>
        <div class="chat-row">
          <button>Live chat</button>
          <button class="account-button" ><img :src="avatar"/></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
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
        usernameQuery: ''
      }
    }
  },

  computed: {
    account() {
      return this.$store.state.currentAccount
    }
  },

  methods: {
    getAudience() {
      const { account } = this;

      if (!account) return;

      axios({ 
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/audience`,
        data: this.filters
      })
      .then(({ data }) => {
        this.threads = data.response.body.threadList;
      })
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
    display: flex;
    align-items: center;
  }

  .user-avatar {
    width: 26px;
    height: 26px;
    background-size: contain;
    background-position: center;
    border-radius: 26px;
    flex-shrink: 0;
    margin-right: 10px;
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

    button {
      background: #828282;;
      border: 1px solid #828282;
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
      button {
        background-color: #6A12CB;
        border-color: #6A12CB;
      }
    }
  }
}
</style>