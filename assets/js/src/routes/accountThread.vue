<template>
  <div class="thread-content" v-if="currentThread">
    <div class="content-panel">
      <div class="title">
        Thread — {{currentCampaign.name}}
        <div>
          {{currentCampaign.typeName}}
          <img src="../assets/info.svg"/>
        </div>
      </div>
      <div class="content-controls">
      </div>
    </div>
    <template v-if="isAllCampaigns">
      <div class="thread-list">
        <div class="thread-list-item thread-list-header">
          <div class="username">
            @username
          </div>
          <div class="bot">
            Bot
          </div>
          <div class="actions">
            Actions
          </div>
        </div>
        <div class="thread-list-item" v-for="thread in currentThread">
          <div class="username">
            {{thread.username}}
          </div>
          <div class="bot">
            <router-link 
              class="campaign-item" 
              tag="div" 
              :key="campaign.id"
              v-for="campaign in thread.campaignList"
              :to="{ name: 'accountCampaign', params: { campaignId: campaign.id, accountId: currentAccount.id } }"
            >
              {{campaign.name}}<br>
              <span>{{campaign.typeName}}</span>
            </router-link>
            {{thread.status}}
          </div>
          <div class="actions">
            <router-link 
              class="content-button" tag="div"
              :to="{ name: 'accountThreadMessages', params: { threadId: thread.id, accountId: currentAccount.id } }"
              >
              <img src="../assets/eye.svg"/>
              View Messages
            </router-link>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="thread-list">
        <div class="thread-list-item thread-list-header">
          <div class="username">
            @username
          </div>
          <div class="status">
            Status
          </div>
          <div class="template">
            Template
          </div>
          <div class="actions">
            Actions
          </div>
        </div>
        <div class="thread-list-item" v-for="thread in currentThread">
          <div class="username">
            {{thread.username}}
          </div>
          <div class="status">
            <font-awesome-icon :icon="getStatusIcon(thread.status)" />
            <span>{{getStatusText(thread.status)}}</span>
          </div>
          <div class="template">
            {{thread.depth}}
          </div>
          <div class="actions">
            <router-link 
              class="content-button" tag="div"
              :to="{ name: 'accountThreadMessages', params: { threadId: thread.id, accountId: currentAccount.id } }"
              >
              <img src="../assets/eye.svg"/>
              View Messages
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div class="loading-content" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  beforeRouteEnter(to, from, next) {
    next(accountThread => {
      accountThread.setCurrentThread(to);
    })
  },

  beforeRouteUpdate(to, from, next) {
    this.currentThread = null;

    this.setCurrentThread(to);
    next();
  },

  data() {
    return {
      currentThread: null,
    }
  },

  computed: {
    currentAccount() {
      return this.$store.state.currentAccount
    },

    currentCampaign() {
      const { currentAccount } = this;
      const { threadId } = this.$route.params;

      if (!threadId || !currentAccount) return {};

      return currentAccount.campaignList.find( campaign => campaign.id == threadId) || {};
    },

    isAllCampaigns() {
      return ['all', 'ignore', 'stuck'].includes(this.$route.params.threadId)
    }
  },

  methods: {
    setCurrentThread(route) {
      const { threadId } = route.params;
      const { currentAccount } = this;
      if (!threadId || !currentAccount) return;

      const url = ['all', 'ignore', 'stuck'].includes(threadId) ? 
        `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ currentAccount.id }/${ threadId }` :
        `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/campaign/${ threadId }`

      axios({ url })
        .then(({ data }) => {
          this.currentThread = data.response.body.threadList;
        })
    },

    getStatusIcon(status) {
      const statusIcon = {
        queued: ['far', 'clock'],
        custom_message: 'user',
        sent: ['far', 'envelope'],
        seen: ['far', 'envelope-open'],
        replied: 'check'
      }

      return statusIcon[status];
    },

    getStatusText(status) {
      const statusText = {
        custom_message: 'Manual',
      }

      return statusText[status] || status;
    }
  },

  watch: {
    '$store.state.accounts'() {
      if (this.currentThread) return;

      this.setCurrentThread(this.$route);
    }
  }
}

</script>
<style lang="scss">
  .thread-content {
    .thread-list-item {
      display: flex;
      padding: 16px 18px 16px 12px;

      & > div {
        // flex-grow: 1;
        flex-shrink: 0;
        padding-right: 6px;
      }

      .username {
        width: 30%;
        min-width: 150px;
      }

      .bot {
        width: 50%;
        min-width: 300px;
        display: flex;
        flex-wrap: wrap;
      }

      .status {
        width: 20%;
        min-width: 100px;
        display: flex;
        align-items: center;
        
        .svg-inline--fa {
          opacity: .5;
          margin-right: 5px;
        }

        span {
          text-transform: capitalize;
        }
      }

      .template {
        width: 20%;
        min-width: 100px;
        text-align: center;
      }

      .sub-category {
        width: 15%;
        min-width: 100px;
      }

      .actions {
        .content-button {
          margin: 0;

          img {
            opacity: .3;
          }

          &:hover {
            text-decoration: underline;
            img {
              opacity: .5;
            }
          }
        }
      }

      &.thread-list-header {
        background-color: #EEEEEE;
        padding: 7px 16px 7px 10px;
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #D0CED5;
        color: #9995A8;
        font-size: 10px;
      }

      &:nth-child(odd) {
        background-color: #EEEEEE;
      }
    }
  
    .campaign-item {
      color: #85539C;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }

      span {
        font-size: 10px;
        opacity: .5;
      }

      &:not(:last-child) {
        margin-right: 5px;

        &:after {
          content: ','
        }
      }
    }
  }

</style>