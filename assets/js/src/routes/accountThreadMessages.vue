<template>
  <div class="thread-content-messages" v-if="threadMessages.length">
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
            <div class="text" v-html="(message.text || '').replace(/\n/ig, '<br/>')"></div>
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
  <div class="loading-content" v-else>
    <div class="pre-loader"></div>
  </div>
</template>
<script>
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import axios from 'axios'
  import { Popover } from "element-ui"
  
  export default {
    data() {
      return {
        threadMessages: [],
        contactProfile: null,
        messageText: '',
        defaultAvatar,
        requestInterval: null,
        lastMessage: {},
        media: [],
      }
    },

    components: {
      'el-popover': Popover,
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

      getUpdates() {
        const { threadId } = this.$route.params;

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/list/${ threadId }`,
          params: {
            max_item_id: this.lastMessage.igItemId
          }
        }).then(({ data }) => {
          const { body } = data.response;

          if (!this.contactProfile) {
            this.contactProfile = body.thread.contactProfile;
          }

          if (!body.messageList.length) return;

          clearInterval(this.requestInterval);

          this.threadMessages.push(...body.messageList);
        })
      },

      deleteFile(fileIndex) {
        this.media.splice(fileIndex, 1);
      }
    },

    created() {
      this.getUpdates();
    },

    beforeDestroy() {
      clearInterval(this.requestInterval)
    },

    watch: {
      threadMessages() {
        this.$nextTick(() => {
          const { threadMessages } = this.$refs;

          threadMessages.scrollTop = threadMessages.scrollHeight;

          this.lastMessage = this.threadMessages[this.threadMessages.length - 1] || {};

          this.requestInterval= setInterval(this.getUpdates, 2000);
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
        word-break: break-word;
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


