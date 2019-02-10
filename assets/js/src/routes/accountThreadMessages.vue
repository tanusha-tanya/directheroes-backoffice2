<template>
  <div class="thread-content-messages w800" >
    <div class="container-area">
      <div class="threades-info">
        <div class="threads-controls">
          <input placeholder="Search" v-model="filters.username_query" @keypress.enter="getAudience"/>
        </div>
        <div class="threads-list" >
          <router-link :to="{ name: 'accountThreadMessages', params: { threadId: thread.id } }" class="list-item" v-for="thread in allThreads" :key="thread.id">
            <div class="user-row">
              <div class="user-avatar" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
              {{thread.contactProfile.username}}
            </div>
          </router-link>
        </div>
      </div>
      <div class="instagram-chat" v-if="threadMessages && threadMessages.length">
        <div class="content-panel">
          <div class="avatar" :style="{'background-image': `${ contactProfile.profilePicUrl ? 'url(' + contactProfile.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
          <strong>{{ contactProfile.username }}</strong>
        </div>
        <div class="thread-list-wrapper scroller" ref="threadMessages">
          <div class="thread-list">
            <div :class="{'thread-list-item': true,  'account-message': isMe(message.senderUsername)}" v-for="(message, index) in threadMessages" :key="message.id">
              <div class="date" v-if="isShowDate(message, index)">
                {{(new Date(message.sentAt * 1000)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}}
              </div>
              <div class="body">
                <div class="avatar" v-if="!isMe(message.senderUsername)" :style="{'background-image': `${ contactProfile.profilePicUrl ? 'url(' + contactProfile.profilePicUrl + '), ' : ''}url(${ defaultAvatar })`}"></div>
                <div class="wrapper">
                  <div class="type" :title="message.typeExtended" v-if="message.type">
                    {{ message.type }}
                  </div>
                  <div class="text" v-html="(message.text || '').replace(/\n/ig, '<br/>')"
                  :title="message.sentAt && (new Date(message.sentAt * 1000)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})"></div>
                  <a class="post" v-if="message.postUrl" :href="message.postUrl" target="_blank">
                    <div class="picture" :style="{'background-image': `url(${ image })`}"></div>
                  </a>
                </div>

                <div :class="{indicator: true, sent: message.isSeen}" v-if="isMe(message.senderUsername)" :title="!message.sentAt && message.toBeSentAt && `Sending at ${(new Date(message.toBeSentAt * 1000)).toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'})}`"
                  >
                  <font-awesome-icon :icon="['fas', 'check-circle']" v-if="message.sentAt"/>
                  <font-awesome-icon :icon="['far', 'clock']" v-else-if="message.toBeSentAt"/>
                </div>
                <router-link
                  class="bot-campaign"
                  :to="{ name: 'accountCampaign', params: { campaignId: message.botCampaign.id } }"
                  v-if="message.botCampaign"
                  >{{message.botCampaign.name}}</router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="thread-message-send">
          <el-popover class="upload-message" v-if="media.length" placement="right">
              <div class="uploaded-files">
                <div class="file-item" v-for="(file, index) in media" :key="file.id">{{file.name}}<img src="../assets/times.svg" @click="deleteFile(index)"/></div>
              </div>
              <div slot="reference">Attached {{media.length}} file(s)</div>
            </el-popover>
          <div class="upload-file">
            <input type="file" @change="uploadFile"/>
          </div>
          <textarea class="scroller" row="3" v-model="messageText" placeholder="Write a message..." @keyup.ctrl.enter="sendMessage"></textarea>
          <button @click="sendMessage">
            <img src="../assets/send-white.svg"/>
            Send
          </button>
        </div>
      </div>
      <div class="instagram-chat" v-else>
        <div class="content-panel">
          <div class="avatar" :style="{'background-image': `url(${ defaultAvatar })`}"></div>
          <strong>Loading user messages</strong>
        </div>
        <div class="loading-content">
          <div class="pre-loader"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import axios from 'axios'
  import { Popover } from "element-ui"
  import moment from 'moment'
  import image from '../assets/svg/image-placeholder.svg'

  export default {
    beforeRouteUpdate(to, from, next) {
      clearInterval(this.requestInterval)
      this.source.cancel('Cancel on turn on other user');

      this.lastMessage = {};
      this.threadMessages = null;
      this.contactProfile = null;

      this.getUpdates(to.params.threadId);

      next()
    },

    data() {
      return {
        allThreads: [],
        threadMessages: null,
        contactProfile: null,
        ownProfile: null,
        messageText: '',
        defaultAvatar,
        requestInterval: null,
        lastMessage: {},
        media: [],
        source: null,
        filters: {
          username_query: ''
        },
        image
      }
    },

    components: {
      'el-popover': Popover,
    },

    computed: {
      accountId() {
        return this.$route.params.accountId
      },

      account() {
        return this.$store.state.currentAccount;
      },

      subscribed() {
        const { subscribed } = this.$route.params;

        switch(subscribed) {
          case 'all':
            return null
            break
          case 'unsubscribed':
            return false
            break
          default:
            return true
        }
      }
    },

    methods: {
      isMe(userName) {
        return this.account.login.replace(/^@/, '') === userName.replace(/^@/, '');
      },

      isShowDate(message, index) {
        const { isMe } = this;
        const prevItem = this.threadMessages[index - 1];

        if (!message.sentAt) return;

        if (!prevItem || !prevItem.sentAt) return true;

        return isMe(prevItem.senderUsername) != isMe(message.senderUsername) || moment(message.sentAt).diff(prevItem.sentAt, 'minutes') > 15;
      },

      uploadFile(event) {
        const files = event.target.files;
        const formData = new FormData();
        const { uuidv4 } = this.utils;

        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          formData.append('file', file, file.name);
        }

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/file/upload`,
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(({ data }) => {
          this.media.push(Object.assign(data.response.body, { clientContext: uuidv4() }));
        });

        event.preventDefault();
      },

      sendMessage() {
        const { threadId } = this.$route.params;
        const { threadMessages } = this.$refs;
        const { uuidv4 } = this.utils;

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/live/${ threadId }/send`,
          method: 'post',
          data: {
            text: this.messageText,
            clientContext: uuidv4(),
            medias: this.media
          }
        }).then(({ data }) => {
          this.media.splice(0, this.media.length)
        })

        this.messageText = '';
      },

      getUpdates(threadId) {
        const CancelToken = axios.CancelToken;

        this.source = CancelToken.source();
        threadId = threadId || this.$route.params.threadId

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`,
          params: {
            max_item_id: this.lastMessage.igItemId
          },
          cancelToken: this.source.token
        }).then(({ data }) => {
          const { body } = data.response;

          if (!this.contactProfile) {
            this.contactProfile = body.thread.contactProfile;
          }


          if (!body.messageList.length) return;

          clearInterval(this.requestInterval);

          if (!this.threadMessages) {
            this.threadMessages = [];
          }

          const onlyNewMessages = body.messageList.filter(newMessage => {
            return !this.threadMessages.find(message => (newMessage.id && (newMessage.id === message.id))
              || (newMessage.botMessageId && (newMessage.botMessageId === message.botMessageId))
              || newMessage.text === message.text)
          })

          if (!onlyNewMessages.length) return

          this.threadMessages.push(...onlyNewMessages);
        })
      },

      deleteFile(fileIndex) {
        this.media.splice(fileIndex, 1);
      },

      getAudience() {
        const { account, subscribed, filters } = this;

        if (!account) return;

        this.allThreads = null;

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/audience`,
          method: 'post',
          data: { ...filters, subscribed },
        })
        .then(({ data }) => {
          const { threadList } = data.response.body

          this.allThreads = threadList;
        })
      },
    },

    created() {
      this.getUpdates();
      this.getAudience();
    },

    beforeDestroy() {
      clearInterval(this.requestInterval)
    },

    watch: {
      threadMessages(value) {
        this.$nextTick(() => {
          const { threadMessages } = this.$refs;

          if (!value) return;

          this.lastMessage = this.threadMessages[this.threadMessages.length - 1] || {};

          this.requestInterval= setInterval(this.getUpdates, 2000);

          threadMessages.scrollTop = threadMessages.scrollHeight;
        })
      }
    }
  }
</script>
<style lang="scss">
  .uploaded-files {
    .file-item {
      display: flex;
      padding: 3px 0;
      justify-content: space-between;
      align-items: center;

      img {
        width: 10px;
        height: 10px;
      }
    }
  }

  .thread-content-messages {
    padding: 15px;

    .container-area {
      height: 100%;
      display: flex;
    }

    .threades-info{
      width: 35%;
      flex-shrink: 0;
      // border-right: 1px solid #EEEEEE;
    }

    .threads-list{
      height: calc(100% - 50px);
      overflow: auto;
      border-right: 1px solid #EEEEEE;
    }

    .list-item {
      text-decoration: none;

      &.router-link-active {
         background-color: #6A12CB;
         color: #fff;
      }
    }

    .threads-controls {
      padding: 5px 20px;
      border-bottom: 1px solid #EEEEEE;
    }

    .instagram-chat {
      // height: 100%;
      flex-grow: 1;
    }

    .loading-content {
      height: calc(100% - 50px);
    }

    .content-panel {
      display: flex;
      padding: 12px 10px 13px;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #EEEEEE;
      color: #828282;
    }

    .avatar {
      width: 25px;
      height: 25px;
      background-position: center;
      background-size: contain;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
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

      .type {
        font-size: 10px;
        color: #a8a8a8;
        margin-top: -10px;
        &::first-letter {
          text-transform: uppercase;
        }
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
        position: relative;
      }

      .picture {
        width: 100%;
        padding-bottom: 80%;
        background-color: #fff;
        background-size: 30%;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 10px;
        border: 1px solid #DEDEDE;

        &:hover {
          background-color:#cfcfcf;
        }
      }

      .indicator {
        position: absolute;
        bottom: 3px;
        z-index: 1;
        right: 20px;
        color: #a8a8a8;

        &.sent {
          color: #742BF9;
        }
      }

      .post {
        width: 100%;
        min-width: 170px;
        display: block;
      }

      .text {
        line-height: 22px;
        font-size: 16px;
        word-break: break-word;
      }

      .wrapper {
        padding: 15px;
        border: 1px solid #DEDEDE;
        border-radius: 25px;
        margin-bottom: 10px;
      }

      .bot-campaign {
        position: absolute;
        right: 25px;
        top: 3px;
        color: #2c3e50;
      }

      &.account-message {
        .body {
          align-self: flex-end;
        }

        .wrapper {
          background-color: #EFEFEF;
          border-color: #EFEFEF;
        }

        .type {
          left: 20px;
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
      position: relative;

      .upload-message {
        position: absolute;
        bottom: 100%;
        cursor: pointer;
        background-color: #fff;
        padding: 0 10px;
      }

      .upload-file {
        width: 50px;
        position: relative;
        background: url(../assets/clip.svg) no-repeat center;
        opacity: .4;
        overflow: hidden;

        &:hover {
          cursor: pointer;
          opacity: .6;
        }

        input {
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
        }
      }

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


