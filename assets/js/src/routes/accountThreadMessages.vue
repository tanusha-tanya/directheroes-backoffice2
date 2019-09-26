<template>
  <div class="dh-live-chat">
    <div class="dh-accounts">
      <div class="dh-accounts-tabs">
        <router-link :to="{ name: 'livechat' }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': status !== 'ignored'}">Discussions</router-link>
        <div class="dh-divider"></div>
        <router-link :to="{ name: 'livechat', query: {st: 'ignored'} }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': status === 'ignored'}">Regular</router-link>
        <task />
      </div>
      <div class="dh-accounts-header">
        <div class="dh-search-input">
          <search />
          <input type="text" class="dh-input" placeholder="Type to search"  v-model="filters.username_query" @keypress.enter="getAudience">
        </div>
      </div>
      <div class="dh-accounts-list">
        <router-link :to="{ name: 'livechat', params: { threadId: thread.id }, query: $route.query }" class="dh-account" v-for="thread in allThreads" :key="thread.id">
          <div class="dh-account-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
          <div>
            <div class="dh-account-name">{{thread.contactProfile.username}}</div>
            <div class="dh-account-last-message">Here is should be a last message Here is should be a last message Here is should be a last message Here is should be a last message Here is should be a last message</div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="dh-chat" v-if="$route.params.threadId">
      <template v-if="threadMessages && threadMessages.length">
        <div class="dh-messages">
          <div class="dh-messages-header">
            <ellipsis />
          </div>
          <div class="dh-messages-wrapper">
            <div class="dh-messages-list" ref="threadMessages">
              <thread-message
              v-for="(message, index) in threadMessages"
              :key="message.id"
              :message="message"
              :owner="account"
              :prev-message="threadMessages[index - 1]"
              :contact-profile="contactProfile"
              ></thread-message>
            </div>
            <div class="dh-message-send">
              <textarea class="scroller" row="3" v-model="messageText" placeholder="Your message" @keyup.ctrl.enter="sendMessage"></textarea>
              <div class="dh-message-link">
                <el-popover class="upload-message" v-if="media.length" placement="top">
                  <div class="uploaded-files">
                    <div class="file-item" v-for="(file, index) in media" :key="file.id">{{file.name}}<close @click="deleteFile(index)"/></div>
                  </div>
                  <div slot="reference">Attached {{media.length}} file(s)</div>
                </el-popover>
                <div class="upload-file">
                  <dh-link/>
                  <input type="file" @change="uploadFile" @keyup.ctrl.enter="sendMessage"/>
                </div>
              </div>
              <div class="dh-message-button"  @click="sendMessage">
                <send />
              </div>
            </div>
          </div>
        </div>
        <div class="dh-contact-profile" v-if="allThreads && allThreads.length">
          <div class="dh-contact-profile-userpic" :style="{'background-image': `url(${ currentThread.contactProfile.profilePicUrl })`}"></div>
          <div class="dh-contact-profile-names">
            <div class="dh-contact-profile-fullname">
              {{currentThread.contactProfile.fullName}}
            </div>
            <div class="dh-contact-profile-name">
              {{currentThread.contactProfile.username}}
            </div>
          </div>
        </div>
      </template>
      <loader v-else/>
    </div>
    <div class="dh-info" v-else>
      <nolivechat/>
      <span>
        Select one of the discussion to see<br>
        new messages
      </span>
    </div>
    <!-- <div class="dh-account-info"></div> -->
    <!-- <div class="container-area">
      <div class="threades-info">
        <div class="threads-controls">
          <input placeholder="Search" v-model="filters.username_query" @keypress.enter="getAudience"/>
        </div>
        <div class="threads-list" >
          <router-link :to="{ name: 'livechat', params: { threadId: thread.id } }" class="list-item" v-for="thread in allThreads" :key="thread.id">
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
        <div class="thread-list-wrapper scroller" ref="threadMessages" >
          <div class="thread-list">
            <thread-message
              v-for="(message, index) in threadMessages"
              :key="message.id"
              :message="message"
              :owner="account.login"
              :prev-message="threadMessages[index - 1]"
              :contact-profile="contactProfile"
              ></thread-message>
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
    </div> -->
  </div>
</template>
<script>
  import axios from 'axios'
  import { Popover } from "element-ui"
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import dhLink from '../../../jsV5/src/assets/link.svg'
  import task from '../../../jsV5/src/assets/task.svg'
  import search from '../../../jsV5/src/assets/search.svg'
  import send from '../../../jsV5/src/assets/send.svg'
  import ellipsis from '../../../jsV5/src/assets/ellipsis.svg'
  import nolivechat from '../../../jsV5/src/assets/nolivechat.svg'
  import ObjectId from '../utils/ObjectId';
  import threadMessage from '../component/threadMessage.vue'
  import moment from 'moment'
  import close from '../assets/times.svg'
  import loader from '../../../jsV5/src/components/dh-loader'

  export default {
    data() {
      const { query } = this.$route;

      return {
        allThreads: [],
        threadMessages: null,
        contactProfile: null,
        ownProfile: null,
        messageText: '',
        status: query.st || 'audience',
        defaultAvatar,
        requestInterval: null,
        lastMessage: {},
        media: [],
        source: null,
        filters: {
          username_query: query.q || ''
        },
        paging: {
          page: query.p || 1,
          totalPageCount: 1
        }
      }
    },

    components: {
      'el-popover': Popover,
      threadMessage,
      task,
      nolivechat,
      loader,
      ellipsis,
      dhLink,
      send,
      close,
      search
    },

    computed: {
      accountId() {
        return this.$route.params.accountId
      },

      account() {
        return this.$store.state.currentAccount;
      },

      currentThread() {
        const { allThreads } = this;
        const { threadId } = this.$route.params;

        return allThreads.find(thread => thread.id == threadId);
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
      uuidv4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },

      uploadFile(event) {
        const files = event.target.files;
        const formData = new FormData();
        const { uuidv4 } = this;

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
          this.media.push(Object.assign(data.response.body, { clientContext: uuidv4(), }));
        });

        event.preventDefault();
      },

      sendMessage() {
        const { threadId } = this.$route.params;
        const { threadMessages } = this.$refs;
        const { uuidv4 } = this;

        if (!this.messageText && !this.media.length) return;

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


        if (!threadId) return;

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
        const { account, subscribed, filters, status, paging } = this;

        if (!account) return;

        this.allThreads = null;

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/${ status }`,
          method: 'post',
          data: { ...filters, subscribed, paging },
        })
        .then(({ data }) => {
          const { threadList } = data.response.body

          this.allThreads = threadList;
        })
      },

      routeUpdate(to, from, next) {
        const { query } = to;


        clearInterval(this.requestInterval)
        this.source.cancel('Cancel on turn on other user');

        this.lastMessage = {};
        this.threadMessages = null;
        this.contactProfile = null;

        this.status = query.st || 'audience'
        this.filters.usernameQuery = query.q || ''
        this.paging.page = query.p ||

        console.log(to, from);

        if (to.params.threadId) {
          this.getUpdates(to.params.threadId);
        } else {
          this.getAudience()
        }

        next()
      }
    },

    created() {
      this.getAudience();
      this.getUpdates();
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
        });
      },

      '$store.state.currentAccount'() {
        this.getAudience();
        this.getUpdates();
      },
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

      svg {
        width: 10px;
        height: 10px;
      }
    }
  }

  .dh-live-chat {
    width: 100%;
    background-color: $sectionBG;
    border-radius: 4px;
    display: flex;
    flex-grow: 1;
    max-height: calc(100vh - 173px);

    .dh-accounts {
      border-right: 1px solid $secondBorderColor;
      width: 262px;
      flex-shrink: 0;
      // height: 100%;
    }

    .dh-accounts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      height: 58px;
      border-bottom: 1px solid $secondBorderColor;
    }

    .dh-accounts-list {
      max-height: calc(100% - 116px);
      overflow-x: hidden;
      overflow-y: auto;
    }

    .dh-divider {
      border-right: 1px solid rgba($textColor, .5);
      height: 36px;
    }

    .dh-account {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
      height: 88px;
      padding: 20px;
      border-bottom: 1px solid #F2F4F6;
    }

    .dh-account-userpic {
      width: 35px;
      height: 35px;
      background-color: rgba($borderColor, .5);
      border-radius: 50%;
      background-position: center;
      background-size: cover;
      flex-shrink: 0;
      margin-right: 16px;
    }

    .dh-account-name {
      margin-bottom: 7px;
    }

    .dh-account-last-message {
      max-height: 36px;
      font-size: 12px;
      line-height: 18px;
      color: $textColor;
      overflow: hidden;
    }

    .dh-chat {
      width: 100%;
      display: flex;
    }

    .dh-messages {
      height: 100%;
      flex-grow: 1;
    }

    .dh-messages-wrapper {
      height: calc(100% - 58px);
      display: flex;
      flex-direction: column;
    }

    .dh-messages-list {
      overflow: auto;
      flex-grow: 1;
    }

    .dh-message-send {
      background-color: $secondBorderColor;
      display: flex;
      align-items: center;
      position: relative;
      flex-shrink: 0;

      textarea {
        appearance: none;
        resize: none;
        border: none;
        background-color: transparent;
        padding: 10px 19px 12px;
        outline: none;
        flex-grow: 1;
        font: 14px/17px Rubik;
      }
    }

    .dh-messages-header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
      height: 58px;
      border-bottom: 1px solid $secondBorderColor;
    }

    .dh-message-button {
      width: 30px;
      margin-right: 19px;
      margin-left: 10px;
    }

    .upload-message {
      position: absolute;
      bottom: 100%;
      cursor: pointer;
      background-color: $secondBorderColor;
      padding: 5px 10px;
      left: 0;
      width: 100%;
      text-align: center;
    }

    .upload-file {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 20px;

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

    .dh-contact-profile {
      width: 262px;
      flex-shrink: 0;
      border-left: 1px solid $secondBorderColor;
    }

    .dh-contact-profile-userpic {
      width: 100%;
      padding-bottom: 100%;
      background-color: rgba($borderColor, .5);
      background-position: center;
      background-size: cover;
      border-radius: 0 4px 0 0;
    }

    .dh-contact-profile-names {
      padding: 22px;
      border-bottom: 1px solid $secondBorderColor;
    }

    .dh-contact-profile-fullname {
      font-size: 18px;
      line-height: 22px;
    }

    .dh-contact-profile-name {
      color: $textColor;
    }

    .dh-accounts-tabs {
      display: flex;
      justify-content: space-around;
      height: 58px;
      align-items: center;
      border-bottom: 1px solid $secondBorderColor;
    }

    .dh-accounts-tab {
      padding: 10px;
      cursor: pointer;

      &.dh-accounts-tab-active {
        color: $elementActiveColor;
      }
    }
  }
</style>

