<template>
  <div class="thread-content" v-if="currentThread">
    <div class="content-panel">
      <div class="title">
        Thread — {{currentThread.name}}
        <div>
          {{currentThread.typeName}}
          <img src="../assets/info.svg"/>
        </div>
      </div>
      <div class="content-controls">
      </div>
    </div>
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
        <div class="sub-category">
          Sub-category
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
          {{thread.status}}
        </div>
        <div class="template">
          Template
        </div>
        <div class="sub-category">
          Sub-category
        </div>
        <div class="actions">
          Actions
        </div>
      </div>
    </div>
  </div>
  <div class="loading-content"v-else>
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

      .status {
        width: 20%;
        min-width: 100px;
      }

      .template {
        width: 15%;
        min-width: 100px;
      }

      .sub-category {
        width: 15%;
        min-width: 100px;
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
  }
</style>