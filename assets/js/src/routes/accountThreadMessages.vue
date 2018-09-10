<template>
  <div class="thread-content-messages" v-if="threadMessages">
    <div class="content-panel">
      <div class="title">
        Messages List
        <div>
          List
          <img src="../assets/info.svg"/>
        </div>
      </div>
      <div class="content-controls">
      </div>
    </div>
    <div class="thread-list">
        <div class="thread-list-item thread-list-header">
          <div class="from">
            From
          </div>
          <div class="sent">
            Sent At
          </div>
          <div class="text">
            Text
          </div>
        </div>
        <div class="thread-list-item" v-for="message in threadMessages">
          <div class="from">
            {{message.senderUsername}}
            <span class="bot-sign" v-if="isBot(message.senderUsername)">(Bot)</span>
          </div>
          <div class="sent" if >
            <span :class="{'seen-sign': true, 'is-seen': message.isSeen }">
              <font-awesome-icon :icon="message.isSeen ? 'eye' : 'eye-slash'" />
            </span>
            <span v-if="message.sentAt">{{(new Date(message.sentAt)).toLocaleString('en-US')}}</span>
            <span v-else> - </span>
          </div>
          <div class="text">
            {{message.text}}
          </div>
        </div>
      </div>
  </div>
  <div class="loading-content" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        threadMessages: null,
      }
    },

    computed: {
      currentAccountId() {
        return this.$route.params.accountId
      },

      currentAccount() {
        return this.$store.state.currentAccount;
      }
    },

    methods: {
      isBot(userName) {
        return this.currentAccount.login === userName;
      }
    },

    created() {
      const { threadId } = this.$route.params;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`
      }).then(({ data }) => {
        this.threadMessages = data.response.body.messageList
      })
    }
  }
</script>
<style lang="scss">
  .thread-content-messages {
    .thread-list-item {
      display: flex;
      padding: 16px 18px 16px 12px;

      & > div {
        // flex-grow: 1;
        flex-shrink: 0;
        padding-right: 6px;
      }

      .from {
        width: 30%;
        min-width: 150px;
      }

      .sent {
        width: 30%;
        min-width: 150px;
      }

      .seen-sign {
        color: rgb(255, 0, 0);

        &.is-seen {
          color: #494;
        }
      }

      .text {
        width: 30%;
        flex-grow: 1;
      }

      .bot-sign {
        color: #494;
        font-weight: bold;
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


