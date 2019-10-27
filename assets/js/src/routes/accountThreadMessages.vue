<template>
  <div class="dh-live-chat">
    <div class="dh-accounts">
      <div class="dh-accounts-tabs">
        <router-link :to="{ name: 'livechat' }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': $route.query.sub !== 'ignored'}">Campaigns</router-link>
        <div class="dh-divider"></div>
        <router-link :to="{ name: 'livechat', query: { sub: 'ignored' } }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': $route.query.sub === 'ignored'}">Inbox</router-link>
      </div>
      <div class="dh-accounts-header">
        <div class="dh-search-input">
          <search />
          <input type="text" class="dh-input" placeholder="Type to search"  v-model="filters.username_query" @keypress.enter="getAudience">
          <el-popover placement="bottom" trigger="click" popper-class="dh-search-filter-popover" :width="300">
            <div class="dh-options" v-if="account">
              <div class="dh-search-input-campaigns">
                <div class="dh-select">
                  <div class="dh-select-title">Favorite</div>
                  <el-select v-model="filters.favoured" size="small" popper-class="dh-select-popper">
                    <el-option label="All" :value="null"></el-option>
                    <el-option label="Favorite" :value="true"></el-option>
                    <el-option label="Not Favorite" :value="false"></el-option>
                  </el-select>
                </div>
                <div class="dh-select">
                  <div class="dh-select-title">Verified</div>
                  <el-select v-model="filters.verified" size="small" popper-class="dh-select-popper">
                    <el-option label="All" :value="null"></el-option>
                    <el-option label="Verified" :value="true"></el-option>
                    <el-option label="Not Verified" :value="false"></el-option>
                  </el-select>
                </div>
                <div class="dh-option"><el-checkbox v-model="isCategoryFilters">Categories</el-checkbox></div>
                <div class="dh-search-input-campaigns-list" v-if="isCategoryFilters">
                  <check-box-branch v-for="item in subscriberMainCategory" :key="item.id" :item="item" :checkedList="filters.categories"></check-box-branch>
                </div>
                <div class="dh-option">Follower count</div>
                <div class="dh-option dh-sub-option">
                  <div><span>Greater then</span><input type="number" v-model="filters.followerCount.gte" class="dh-input"></div>
                </div>
                <div class="dh-option dh-sub-option">
                  <div><span>Less then</span><input type="number" v-model="filters.followerCount.lte" class="dh-input"></div>
                </div>
                <div class="dh-option">Following count</div>
                <div class="dh-option dh-sub-option">
                  <div><span>Greater then</span><input type="number" v-model="filters.followingCount.gte" class="dh-input"></div>
                </div>
                <div class="dh-option dh-sub-option">
                  <div><span>Less then</span><input type="number" v-model="filters.followingCount.lte" class="dh-input"></div>
                </div>
              </div>
            </div>
            <div class="dh-search-filter" slot="reference">
              <search-filter />
            </div>
          </el-popover>
        </div>
      </div>
      <div class="dh-accounts-list">
        <router-link :to="{ name: 'livechat', params: { threadId: thread.id }, query: $route.query }" class="dh-account" v-for="thread in allThreads" :key="thread.id">
          <div class="dh-account-favorite" @click.prevent="toggleFavorite(thread)">
            <star-filled v-if="thread.isFavourite"/>
            <star v-else />
          </div>
          <div class="dh-account-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
          <div>
            <div class="dh-account-name">{{thread.contactProfile.username}}</div>
            <div class="dh-account-last-message">{{thread.lastMessage.text || thread.lastMessage.type}}</div>
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
              :next-message="threadMessages[index + 1]"
              :contact-profile="contactProfile"
              @retry-send="retrySend"
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
              <div class="dh-message-button" @click="sendMessage()">
                <send />
              </div>
            </div>
          </div>
        </div>
        <div class="dh-contact-profile" v-if="currentThread">
          <div class="dh-contact-profile-userpic" :style="{'background-image': `url(${ currentThread.contactProfile.profilePicUrl })`}"></div>
          <div class="dh-contact-profile-names">
            <div class="dh-contact-profile-fullname">
              {{currentThread.contactProfile.fullName}}
            </div>
            <div class="dh-contact-profile-name">
              {{currentThread.contactProfile.username}}
            </div>
          </div>
          <div class="dh-contact-profile-controls">
            <div :class="{'dh-contact-profile-control':true, 'dh-contact-profile-unsubscribe': true, 'dh-disabled': !currentThread.isSubscribed}" @click="unsubscribe(currentThread)">
              <times />
              Unsubscribe
            </div>
            <div class="dh-divider"></div>
            <div class="dh-contact-profile-control dh-contact-profile-favorite" @click="toggleFavorite(currentThread)">
              <star-filled v-if="currentThread.isFavourite"/>
              <star v-else />
              Favorite
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

  </div>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import { Popover } from "element-ui"
  import defaultAvatar from '../assets/ig-avatar.jpg'
  import times from '../assets/times.svg'
  import dhLink from '../../../jsV5/src/assets/link.svg'
  import task from '../../../jsV5/src/assets/task.svg'
  import search from '../../../jsV5/src/assets/search.svg'
  import star from '../../../jsV5/src/assets/star.svg'
  import searchFilter from '../../../jsV5/src/assets/filter.svg'
  import starFilled from '../../../jsV5/src/assets/star-filled.svg'
  import send from '../../../jsV5/src/assets/send.svg'
  import ellipsis from '../../../jsV5/src/assets/ellipsis.svg'
  import nolivechat from '../../../jsV5/src/assets/nolivechat.svg'
  import ObjectId from '../utils/ObjectId';
  import threadMessage from '../component/threadMessage.vue'
  import moment from 'moment'
  import close from '../assets/times.svg'
  import loader from '../../../jsV5/src/components/dh-loader'
  import checkBoxBranch from '../component/checkBoxBranch.vue'

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
        requestTimeout: null,
        lastMessage: {},
        media: [],
        source: null,
        isCategoryFilters: false,
        filters: {
          usernameQuery: query.q || '',
          includeLastMessage: true,
          categories: [],
          favoured: null,
          verified: null,
          followerCount: {
            gte: null,
            lte: null
          },
          followingCount: {
            gte:null,
            lte:null
          }
        },
        paging: {
          page: query.p || 1,
          totalPageCount: 1
        },
        applyFilterTimeout: null,
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
      search,
      star,
      starFilled,
      times,
      searchFilter,
      checkBoxBranch
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

        if (!allThreads) return;

        return allThreads.find(thread => thread.id == threadId);
      },

      campaigns() {
        const { currentAccountData } = this.$store.state;

        if (!currentAccountData) return [];

        return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
      },

      subscriberMainCategory() {
        const { subscriberCategoryList } = this.account;
        const { campaigns } = this;

        const subscriberMainCategories = []

        subscriberCategoryList.forEach((item, index) => {
          if (item.isCampaignMainCategory) {
            const mainCategory = subscriberMainCategories.find(category => category.mdbCampaignId == item.mdbCampaignId);

            if (!mainCategory) {
              subscriberMainCategories.push(JSON.parse(JSON.stringify(item)));
            } else if (!mainCategory.isCampaignMainCategory) {
              subscriberMainCategories.splice(subscriberMainCategories.indexOf(mainCategory), 1, JSON.parse(JSON.stringify(item)));
            }

            return;
          } else if (item.mdbCampaignId) {
            let mainCategory = subscriberMainCategories.find(category => category.mdbCampaignId == item.mdbCampaignId);

            if (!mainCategory) {
              const parentCampaign = campaigns.find(campaign => campaign.id == item.mdbCampaignId);

              mainCategory = { name: parentCampaign.name, mdbCampaignId: parentCampaign.id }

              subscriberMainCategories.push(mainCategory);
            }

            mainCategory.list = mainCategory.list || [];

            mainCategory.list.push(item)
          } else {
            let mainCategory = subscriberMainCategories.find(category => !category.mdbCampaignId);

            if (!mainCategory) {
              mainCategory = { name: 'Manual' }

              subscriberMainCategories.push(mainCategory);
            }

            mainCategory.list = mainCategory.list || [];

            mainCategory.list.push(item);
          }
        })

        return subscriberMainCategories
      },

      reverseThreadMessages() {
        const { threadMessages } = this;

        if (!threadMessages) return;

        return threadMessages.slice(0).reverse()
      }
    },

    methods: {
      uuidv4: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },

      subscribed(query) {
        const sub = query ? query.sub : this.$route.query.sub;

        switch(sub) {
          case 'all':
            return null
            break
          case 'unsubscribed':
            return false
            break
          case 'ignored':
            return 'ignored'
            break
          default:
            return true
        }
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

      sendMessage(retryMessage) {
        const { threadId } = this.$route.params;
        const { uuidv4, threadMessages, account } = this;
        const textUUID = uuidv4();
        const messageData = retryMessage || {
          text: this.messageText,
          clientContext: textUUID,
          medias: this.media
        }

        if (!this.messageText && !this.media.length && !retryMessage) return;

        if (!retryMessage) {
          this.media.forEach(media => {
            threadMessages.push({
              clientContext: media.clientContext,
              senderUsername: account.login,
              previewUrl: media.previewUrl,
              media
            })
          })

          if (this.messageText) {
            threadMessages.push({
              clientContext: textUUID,
              senderUsername: account.login,
              text: this.messageText
            })
          }
        }

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/live/${ threadId }/send`,
          method: 'post',
          data: messageData
        }).then(({ data }) => {
          this.media.splice(0, this.media.length)
        }).catch(error => {
          const { reverseThreadMessages } = this;
          const clientContexts = retryMessage  ? (retryMessage.text ? [retryMessage.clientContext] : []) : [textUUID];

          if (retryMessage && retryMessage.medias) {
            clientContexts.push(retryMessage.medias[0].clientContext)
          } else {
            this.media.forEach(media => clientContexts.push(media.clientContext));
          }

          clientContexts.forEach(context => {
            const message = reverseThreadMessages.find(message => message.clientContext === context);

            if (!message) return;

            Vue.set(message, 'error',  true)
          })

          this.media.splice(0, this.media.length)
        })

        this.messageText = '';
      },

      retrySend(message) {
        const { sendMessage } = this;
        if (message.text) {
          sendMessage({
            text: message.text,
            clientContext: message.clientContext,
          })
        } else if (message.previewUrl) {
          sendMessage({
            text: '',
            medias: [message.media],
            clientContext: message.clientContext,
          })
        }

        message.error = false;
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

          if (!body.messageList.length) {
            this.requestTimeout= setTimeout(this.getUpdates, 2000);
            return
          };

          if (!this.threadMessages) {
            this.threadMessages = [];
          }

          let onlyNewMessages = body.messageList.filter(newMessage => {
            return !this.threadMessages.find((message, index) => {
              console.log(message.id, message.clientContext, newMessage.clientContext);

              if (!message.id && message.clientContext === newMessage.clientContext) {
                this.threadMessages.splice(index, 1, newMessage);

                return false;
              }

              return (newMessage.id && (newMessage.id === message.id))
              || (newMessage.botMessageId && (newMessage.botMessageId === message.botMessageId))
              || newMessage.text === message.text
            })
          })


          if (!onlyNewMessages.length) return

          this.threadMessages.push(...onlyNewMessages);
        })
      },

      deleteFile(fileIndex) {
        this.media.splice(fileIndex, 1);
      },

      getAudience(beforeQuery) {
        const { query } = this.$route;
        const subscribed = this.subscribed(beforeQuery)
        const { account, status, filters , paging } = this;

        if (!account) return;

        this.allThreads = null;

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ account.id }/${ status }`,
          method: 'post',
          // data: { ...filters, subscribed, paging },
          data: {
            ...filters,
            categories: filters.categories.map(category => category.id),
            followerCount: (filters.followerCount.lte || filters.followerCount.gte) && filters.followerCount,
            followingCount: (filters.followingCount.lte || filters.followingCount.gte) && filters.followingCount,
            subscribed,
            paging
          },
        })
        .then(({ data }) => {
          const { threadList } = data.response.body

          this.allThreads = threadList;
        })
      },

      routeUpdate(to, from, next) {
        const { query } = to;

        this.source.cancel('Cancel on turn on other user');

        this.lastMessage = {};
        this.threadMessages = null;
        this.contactProfile = null;
        this.filters.usernameQuery = query.q || ''
        this.paging.page = query.p || 1

        if (to.params.threadId) {
          this.getUpdates(to.params.threadId);
        } else {
          this.getAudience(query)
        }

        next()
      },

      toggleFavorite(thread) {
        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/${ thread.id }/update`,
          method: 'post',
          data: { favourite : !thread.isFavourite }
        }).then(({ data })=> {
          Vue.set(thread, 'isFavourite', !thread.isFavourite)
        })
      },

      unsubscribe(thread) {
        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/account/${ this.accountId }/subscriber/${ thread.subscriberId }/unsubscribe`,
          method: 'patch',
        }).then(({ data })=> {
          thread.isSubscribed = false
        })
      }
    },

    created() {
      this.getAudience();
      this.getUpdates();
    },

    beforeDestroy() {
      clearTimeout(this.requestTimeout)
    },

    watch: {
      threadMessages(value) {
        this.$nextTick(() => {
          const { reverseThreadMessages } = this;
          const { threadMessages } = this.$refs;

          if (!value) return;

          this.lastMessage = reverseThreadMessages.find(message => message.igItemId) || {};

          this.requestTimeout= setTimeout(this.getUpdates, 2000);

          threadMessages.scrollTop = threadMessages.scrollHeight;
        });
      },

      '$store.state.currentAccount'() {
        this.getAudience();
        this.getUpdates();
      },

      isCategoryFilters(newValue) {
        const { categories } = this.filters;

        if (newValue) return;

        categories.splice(0, categories.length);
      },

      filters: {
        handler(filters) {
          const { followerCount, followingCount } = filters;
          const { getAudience } = this;

          clearTimeout(this.applyFilterTimeout);

          followerCount.gte = followerCount.gte || null;
          followerCount.lte = followerCount.lte || null;

          followingCount.gte = followingCount.gte || null;
          followingCount.lte = followingCount.lte || null;

          this.applyFilterTimeout = setTimeout(getAudience, 2500)
        },
        deep:true
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
    max-height: calc(100vh - 127px);

    .dh-search-input {
      width: 100%;

      svg {
        flex-shrink: 0;
      }

      input {
        flex-grow: 1;
      }
    }

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
      padding: 20px 20px 20px 10px;
      border-bottom: 1px solid #F2F4F6;

      .dh-account-favorite {
        margin-right: 10px;
        color: $elementsColor;

        svg {
          width: 18px;
          height: 18px;
        }
      }

      &.router-link-exact-active {
        border-left: 2px solid $elementActiveColor;

        .dh-account-favorite {
          margin-left: -2px;
        }
      }
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
      display: flex;
      flex-direction: column;
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
      flex-grow: 1;
    }

    .dh-contact-profile-fullname {
      font-size: 18px;
      line-height: 22px;
    }

    .dh-contact-profile-name {
      color: $textColor;
    }

    .dh-contact-profile-controls {
      display: flex;
      width: 100%;
      align-items: center;
      color: $elementsColor;
    }

    .dh-contact-profile-control {
      display: flex;
      height: 58px;
      justify-content: center;
      width: 50%;
      align-items: center;
      cursor: pointer;

      svg {
        margin-right: 5px;
        width: 18px;
        height: 18px;
      }
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
      width: 50%;
      text-align: center;
      cursor: pointer;

      &.dh-accounts-tab-active {
        color: $elementActiveColor;
      }
    }
  }

  .dh-search-filter-popover {
    .dh-option {
      padding: 4px 13px;
      .el-checkbox {
        margin-right: 10px;

        .el-checkbox__label {
          font-size: 12px;
          line-height: 14px;
          font-weight: 500;
        }
      }
    }

    .dh-sub-option {
      padding-left: 20px;
      font-size: 10px;

      span {
        width: 100px;
        flex-shrink: 0;
        display: inline-block;
      }

      .dh-input {
        padding: 4px;
        width: 50%;
      }
    }

    .dh-select {
      padding: 0 13px;
      // .dh-select-title {
      //   color: #606266;
      // }

      .dh-select-title {
        width: 30%;
      }

      .el-select {
        width: 50%;
      }
    }

    .dh-search-input-campaigns-list {
      max-height: 150px;
      overflow-y: auto;
      overflow-x: none;
      margin: 0 20px;
    }
  }
</style>

