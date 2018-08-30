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
      <div class="thread-list-item">
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
      <div class="thread-list-item">
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
    </div>
  </div>
  <div class="loading-content"v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>

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

  methods: {
    setCurrentThread(route) {
      const { threadId } = route.params;
      const { threadList } = this.$store.state.currentAccount;

      if (!threadList || !threadId) return;

      const currentThread = threadList.find(thread => thread.id == threadId);

      // if (currentCampaign.templateList) {
      this.currentThread = currentThread;
      // } else {
      //   this.$store.dispatch('getCampaignTemplates', currentCampaign)
      //     .then(({ data }) => {
      //       this.currentCampaign = data.campaign;
      //     });
      // }
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
        flex-grow: 1;
        flex-shrink: 0;
        padding-right: 6px;
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