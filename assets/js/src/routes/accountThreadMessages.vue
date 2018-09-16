<template>
  <div class="thread-content-messages" v-if="threadMessages">
    <div class="content-panel">
      <div class="avatar" :style="{'background-image': `${ contactProfile.profilePicUrl ? 'url(' + contactProfile.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
      <strong>{{ contactProfile.username }}</strong>
    </div>
    <div class="thread-list-wrapper scroller" ref="threadMessages">
      <div class="thread-list">
        <div :class="{'thread-list-item': true,  'account-message': isMe(message.senderUsername)}" v-for="(message, index) in threadMessages" :key="message.id">
          <div class="date" v-if="(!index || true ||isEqualPrevDate(message.sendAt, index)) && message.sentAt">
            {{(new Date(message.sentAt)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}}
          </div>
          <div class="body">
            <div class="avatar" v-if="!isMe(message.senderUsername)" :style="{'background-image': `${ contactProfile.profilePicUrl ? 'url(' + contactProfile.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
            <div class="text">{{message.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="thread-message-send">
      <textarea class="scroller" row="3" v-model="messageText" placeholder="Write a message..." @keyup.ctrl.enter="sendMessage"></textarea>
      <button @click="sendMessage">
        <img src="../assets/send-white.svg"/>
        Send
      </button>
    </div>
  </div>
  <div class="loading-content" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import axios from 'axios';
  
  export default {
    data() {
      return {
        threadMessages: null,
        contactProfile: null,
        messageText: '',
        defaultAvatar,
        inSending: false,
        requestInterval: null
      }
    },

    computed: {
      currentAccountId() {
        return this.$route.params.accountId
      },

      currentAccount() {
        return this.$store.state.currentAccount;
      },
    },

    methods: {
      isMe(userName) {
        return this.currentAccount.login === userName;
      },

      sendMessage() {
        const { threadId } = this.$route.params;
        const { threadMessages } = this.$refs;
        const { uuidv4 } = this.utils;
        
        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/live/${ threadId }/send`,
          params: {
            text: this.messageText,
            client_context: uuidv4()
          }
        }).then(({ data }) => { })

        this.messageText = '';
      },

      getUpdates() {
        const { threadId } = this.$route.params;
        const { threadMessages } = this;
        const lastMessage = threadMessages[ threadMessages.length - 1 ] || {};

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`,
          params: {
            max_item_id: lastMessage.igItemId
          }
        }).then(({ data }) => {
          const { body } = data.response;

          if (!body.messageList.length) return;

          this.threadMessages.push(...body.messageList);
        })
      }
    },

    created() {
      const { threadId } = this.$route.params;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`
      }).then(({ data }) => {
        const { body } = data.response;

        this.contactProfile = body.thread.contactProfile;
        this.threadMessages = body.messageList;
      })

      this.requestInterval = setInterval(this.getUpdates, 2000);
    },

    beforeDestroy() {
      clearInterval(this.requestInterval)
    },

    watch: {
      threadMessages() {
        this.$nextTick(() => {
          const { threadMessages } = this.$refs;

          threadMessages.scrollTop = threadMessages.scrollHeight;
        })
      }
    }
  }
</script>
<style lang="scss">
  .thread-content-messages {
    height: calc(100vh - 50px);

    .content-panel {
      flex-direction: column;
      justify-content: center;
    }

    .avatar {
      width: 24px;
      height: 24px;
      background-position: center;
      background-size: contain;
      border-radius: 50%;
      overflow: hidden;
      margin-bottom: 1px;
    }

    .thread-list-wrapper {
      background-color: #fff;
      margin: 0 auto;
      width: 450px;
      height: 100%;
      max-height: calc(100% - 155px);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 15px;
    }

    .thread-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 100%;
    }

    .thread-list-item {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;

      .date {
        align-self: center;
        color: #A7A7A7;
        margin: 10px 0 15px;
      }

      .avatar {
        width: 32px;
        height: 32px;
        margin: 0 10px 5px 0;
        align-self: flex-end;
        flex-shrink: 0;
      }

      .body {
        display: flex;
        align-self: flex-start;
        max-width: 70%;
      }

      .text {
        padding: 15px;
        border: 1px solid #DEDEDE;
        border-radius: 25px;
        line-height: 22px;
        font-size: 16px;
      }

      &:not(:last-child) {
        .text {
          margin-bottom: 5px;
        }
      }

      &.account-message {
        .body {
          align-self: flex-end;
        }

        .text {
          background-color: #EFEFEF;
          border-color: #EFEFEF;
        }
      }
    }

    .thread-message-send {
      padding: 10px;
      height: 90px;
      background-color: #fff;
      margin: 0 auto;
      width: 450px;
      display: flex;


      textarea {
        width: 100%;
        resize: none;
        border-color: #f1f1f1;
        border-radius: 15px;
        padding: 0 15px;
        outline: none;
        line-height: 22px;
        font-size: 16px;
        height: 70px;
      }

      img {
        width: 22px;
        margin-right: 5px;
      }

      button {
        padding: 12px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }
    }
  }
</style>


