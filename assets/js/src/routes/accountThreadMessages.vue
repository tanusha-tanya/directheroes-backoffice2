<template>
  <div class="thread-content-messages" v-if="threadMessages">
    <div class="content-panel">
      <div class="avatar" :style="{'background-image': `${ clientData.profilePicUrl ? 'url(' + clientData.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
      <strong>{{ clientData.login }}</strong>
    </div>
    <div class="thread-list-wrapper scroller" ref="threadMessages">
      <div class="thread-list">
        <div :class="{'thread-list-item': true,  'account-message': isMe(message.senderUsername)}" v-for="(message, index) in threadMessages" :key="message.id">
          <div class="date" v-if="!index || true ||isEqualPrevDate(message.sendAt, index)">
            {{(new Date(message.sentAt)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}}
          </div>
          <div class="body">
            <div class="avatar" v-if="!isMe(message.senderUsername)" :style="{'background-image': `${ clientData.profilePicUrl ? 'url(' + clientData.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
            <div class="text">{{message.text}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="thread-message-send">
      <textarea v-if="false" v-model="messageText" placeholder="Write a message..." @keyup.enter="sendMessage"></textarea>
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
        messageText: '',
        defaultAvatar
      }
    },

    computed: {
      currentAccountId() {
        return this.$route.params.accountId
      },

      currentAccount() {
        return this.$store.state.currentAccount;
      },

      clientData() {
        const {currentAccount} = this;
        let clientMessage;

        if (!currentAccount) return;

        clientMessage = this.threadMessages.find(message => message.senderUsername !== currentAccount.login);

        return { login: clientMessage.senderUsername, profilePicUrl: clientMessage.senderProfilePicUrl  }
      }
    },

    methods: {
      isMe(userName) {
        return this.currentAccount.login === userName;
      },

      sendMessage() {
        const { threadMessages } = this.$refs;

        this.threadMessages.push({
          id: Math.random() * 10000,
          isSeen: false,
          senderProfilePicUrl: "https://scontent-lga3-1.cdninstagram.com/vp/36c45924e6d263e2baa53c5c2e4862c5/5BC7A46C/t51.2885-19/s150x150/23161043_359974764426840_1793873252444012544_n.jpg",
          senderUsername: "direct.heroes",
          sentAt: Date.now(),
          text: this.messageText,
        })

        this.messageText = '';

        this.$nextTick(() => {
          threadMessages.scrollTop = threadMessages.scrollHeight;
        })
      }
    },

    created() {
      const { threadId } = this.$route.params;

      axios({
        url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`
      }).then(({ data }) => {
        this.threadMessages = data.response.body.messageList;
      })
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
      max-height: calc(100% - 120px);
      overflow-y: auto;
      overflow-x: hidden;
      padding: 15px;
    }

    .thread-list {
      display: flex;
      flex-direction: column;
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
      height: 55px;
      background-color: #fff;
      margin: 0 auto;
      width: 450px;

      input {
        border-color: #f1f1f1;
        border-radius: 25px;
        padding: 10px 15px;
      }
    }
  }
</style>


