<template>
  <div class="dh-live-chat">
    <div class="dh-accounts">
      <div class="dh-accounts-tabs">
        <router-link :to="{ name: 'livechat' }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': !['favorites', 'ignored'].includes($route.query.sub)}">Campaigns</router-link>
        <div class="dh-divider"></div>
        <router-link :to="{ name: 'livechat', query: { sub: 'ignored' } }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': isInbox}">Inbox</router-link>
        <div class="dh-divider"></div>
        <router-link :to="{ name: 'livechat', query: { sub: 'favorites' } }" tag="div" :class="{'dh-accounts-tab': true, 'dh-accounts-tab-active': $route.query.sub === 'favorites'}">Favorites</router-link>
      </div>
      <div class="dh-accounts-header">
        <div class="dh-search-input">
          <search />
          <input type="text" class="dh-input" placeholder="Type to search"  v-model="filters.username_query" @keypress.enter="getAudience">
          <el-popover placement="bottom" trigger="click" popper-class="dh-search-filter-popover" :width="300">
            <div class="dh-options" v-if="currentAccount">
              <div class="dh-search-input-campaigns">
                <div :class="{'dh-select':true, 'dh-is-selected': filters.favoured}" v-if="$route.query.sub !== 'favorites'">
                  <div class="dh-select-title">Favorite</div>
                  <el-select v-model="filters.favoured" size="small" popper-class="dh-select-popper">
                    <el-option label="All" :value="null"></el-option>
                    <el-option label="Favorite" :value="true"></el-option>
                    <el-option label="Not Favorite" :value="false"></el-option>
                  </el-select>
                </div>
                <template v-if="!isInbox">
                  <div :class="{'dh-select':true, 'dh-is-selected': filters.verified}" >
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
                    <div :class="{'dh-is-selected': filters.followerCount.gte}"><span>Greater than</span><input type="number" v-model="filters.followerCount.gte" class="dh-input"></div>
                  </div>
                  <div class="dh-option dh-sub-option">
                    <div :class="{'dh-is-selected': filters.followerCount.lte}"><span>Less than</span><input type="number" v-model="filters.followerCount.lte" class="dh-input"></div>
                  </div>
                  <div class="dh-option">Following count</div>
                  <div class="dh-option dh-sub-option">
                    <div><span :class="{'dh-is-selected': filters.followingCount.gte}">Greater than</span><input type="number" v-model="filters.followingCount.gte" class="dh-input"></div>
                  </div>
                  <div class="dh-option dh-sub-option">
                    <div><span :class="{'dh-is-selected': filters.followingCount.lte}" >Less than</span><input type="number" v-model="filters.followingCount.lte" class="dh-input"></div>
                  </div>
                </template>
              </div>
            </div>
            <div :class="{'dh-search-filter':true, 'dh-search-filter-active': isOneFilterSelected}" slot="reference">
              <search-filter />
            </div>
          </el-popover>
        </div>
      </div>
      <div class="dh-accounts-list" v-if="!audienceLoading" ref="threadScroll">
        <router-link
          :to="{ name: 'livechat', params: { threadId: thread.id }, query: $route.query }"
          class="dh-account"
          v-for="thread in allThreads"
          :key="thread.id"
          ref="threads"
          >
          <div class="dh-account-favorite" @click.prevent="toggleFavorite(thread)">
            <star-filled v-if="thread.isFavourite"/>
            <star v-else />
          </div>
          <div class="dh-account-userpic" :style="{'background-image': `url(${ thread.contactProfile.profilePicUrl })`}"></div>
          <div style="overflow: hidden">
            <div class="dh-account-name">{{thread.contactProfile.username}}</div>
            <div class="dh-account-last-message">{{thread.lastMessage && (thread.lastMessage.text || thread.lastMessage.type)}}</div>
          </div>
        </router-link>
      </div>
      <loader v-else/>
      <div class="dh-accounts-up" v-if="paging.page > 9" @click="setPage(1)">
        <up/>
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
              <template v-for="(message, index) in threadMessages">
                <div class="dh-conversation-divider" v-if="(message.type || '').includes('conversation')" :key="message.body.conversation.id + index" :title="conversationEndReason(message)">
                  <div>
                    Conversation
                    <router-link
                      :to="{ name: message.body.conversation.campaign.type === 'broadcast' ? 'accountBroadcast' : 'accountCampaign', params:{ campaignId: message.body.conversation.campaign.id }}"
                      target= '_blank'>
                      {{message.body.conversation.campaign.name}}
                    </router-link>
                    <template v-if="message.type === 'conversation_start'">
                      start.
                    </template>
                    <template v-else>
                      end.
                      <div
                        @click="forceResumeConversation(message)"
                        class="dh-force-resume-button"
                        v-if="lastConversationEnd === message && message.body.conversation.campaign.type !== 'broadcast' && !message.sent && [2,3,7,8].includes(message.body.conversation.closeState)">
                        Force Resume
                      </div>
                    </template>
                  </div>
                </div>
                <template v-else>
                  <thread-message
                    :key="message.id"
                    :message="message"
                    :owner="currentAccount"
                    :prev-message="threadMessages[index - 1]"
                    :next-message="threadMessages[index + 1]"
                    :contact-profile="contactProfile"
                    @retry-send="retrySend"
                  ></thread-message>
                </template>
              </template>
              <div class="dh-conversation-divider dh-re-check-divider" v-if="canRecheckCampaigns">
                  <div>
                    <div
                      @click="recheckCampaigns()"
                      class="dh-force-resume-button">
                      Re-check campaigns
                    </div>
                  </div>
                </div>
            </div>
            <div class="dh-message-send">
              <textarea class="scroller" row="3" v-model="messageText" placeholder="Your message" @keyup.ctrl.enter="sendMessage()"></textarea>
              <div class="dh-message-link">
                <el-popover class="upload-message" v-if="media.length" placement="top">
                  <div class="uploaded-files">
                    <div class="file-item" v-for="(file, index) in media" :key="file.id">{{file.name}}<close @click="deleteFile(index)"/></div>
                  </div>
                  <div slot="reference">Attached {{media.length}} file(s)</div>
                </el-popover>
                <div class="upload-file">
                  <dh-link/>
                  <input type="file" @change="uploadFile"/>
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
            <a class="dh-contact-profile-name" :href="`https://www.instagram.com/${currentThread.contactProfile.username}`" target="_blank">
              {{currentThread.contactProfile.username}}
            </a>
          </div>
          <div class="dh-contact-profile-controls">
            <div v-if="currentThread.hasOwnProperty('isSubscribed')" :class="{'dh-contact-profile-control':true, 'dh-contact-profile-unsubscribe': true, 'dh-disabled': !currentThread.isSubscribed}" @click="unsubscribe(currentThread)">
              <template v-if="currentThread.isSubscribed">
                <times />
                Unsubscribe
              </template>
              <template v-else>
                Unsubscribed
              </template>
            </div>
            <div class="dh-divider" v-if="currentThread.hasOwnProperty('isSubscribed')"></div>
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
        Select one of the discussions to see<br>
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
  import dhLink from '../../src/assets/link.svg'
  import task from '../../src/assets/task.svg'
  import search from '../../src/assets/search.svg'
  import star from '../../src/assets/star.svg'
  import searchFilter from '../../src/assets/filter.svg'
  import starFilled from '../../src/assets/star-filled.svg'
  import send from '../../src/assets/send.svg'
  import up from '../../src/assets/up.svg'
  import ellipsis from '../../src/assets/ellipsis.svg'
  import nolivechat from '../../src/assets/nolivechat.svg'
  import ObjectId from '../utils/ObjectId'
  import threadMessage from '../component/threadMessage.vue'
  import moment from 'moment'
  import close from '../assets/times.svg'
  import loader from '../../src/components/dh-loader'
  import checkBoxBranch from '../component/checkBoxBranch.vue'

  export default {
    data() {
      const { query } = this.$route;

      return {
        allThreads: [],
        threadMessages: null,
        contactProfile: null,
        inUpdate: false,
        ownProfile: null,
        audienceLoading: false,
        messageText: '',
        status: query.st || 'audience',
        defaultAvatar,
        requestTimeout: null,
        lastMessage: {},
        media: [],
        infinityPageObserver: null,
        source: null,
        isCategoryFilters: false,
        filters: {
          usernameQuery: query.q || '',
          includeLastMessage: true,
          categories: [],
          favoured: query.sub === 'favorites' || null,
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
      checkBoxBranch,
      up
    },

    computed: {
      accountId() {
        return this.$route.params.accountId
      },

      currentThread() {
        const { allThreads, contactProfile } = this;
        const { threadId } = this.$route.params;

        if (!allThreads) return;

        return allThreads.find(thread => thread.id == threadId) || { contactProfile };
      },

      campaigns() {
        const { currentAccountData } = this.$store.state;

        if (!currentAccountData) return [];

        return currentAccountData.campaigns.filter(campaign => !campaign.isArchived)
      },

      isOneFilterSelected() {
        const { filters, $route } = this;

        if (filters.categories.length) {
          return true
        } else if (filters.favoured !== null && $route.query.sub !== 'favorites') {
          return true
        } else if (filters.verified !== null) {
          return true
        } else if (filters.followerCount.gte || filters.followerCount.lte) {
          return true
        } else if (filters.followingCount.gte || filters.followingCount.lte) {
          return true
        }
      },

      subscriberMainCategory() {
        const { subscriberCategoryList } = this.currentAccount;
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
      },

      isInbox() {
        const { $route } = this;

        return $route.query.sub === 'ignored'
      },

      lastConversationEnd() {
        const { reverseThreadMessages } = this;
        const lastConversationDivider = reverseThreadMessages.find(message => message.type && message.type.includes('conversation'))

        return lastConversationDivider && lastConversationDivider.type === 'conversation_end' && lastConversationDivider;
      },

      canRecheckCampaigns() {
        const { reverseThreadMessages, contactProfile, lastConversationEnd, currentThread } = this;
        const lastMessage = reverseThreadMessages[0];

        return !currentThread.campaignsRechecked && (lastMessage && lastMessage.senderUsername && (lastMessage.senderUsername === contactProfile.username))
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
            return true
            break
          case 'unsubscribed':
            return false
            break
          case 'ignored':
            return 'ignored'
            break
          case 'favorites':
            return 'all'
            break
          default:
            return null
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
        const { uuidv4, threadMessages, currentAccount } = this;
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
              senderUsername: currentAccount.login,
              previewUrl: media.previewUrl,
              media
            })
          })

          if (this.messageText) {
            threadMessages.push({
              clientContext: textUUID,
              senderUsername: currentAccount.login,
              text: this.messageText
            })
          }
        }

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/message/live/${ threadId }/send`,
          method: 'post',
          data: messageData
        }).then(({ data }) => {
          this.media.splice(0, this.media.length);
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
            medias:[],
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

        clearTimeout(this.requestTimeout)

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
            this.threadMessages = body.messageList.filter(message => message.type !== 'none');
            return;
          }

          let onlyNewMessages = body.messageList.filter(newMessage => {
            const messages = this.threadMessages.filter(message => !(message.type || '').includes('conversation'))

            if ((newMessage.type || '').includes('conversation') || newMessage.type === 'none') return;

            return !messages.find((message, index) => {
                if (!message.id && !message.botMessageId && message.clientContext === newMessage.clientContext) {
                  this.threadMessages.splice(index, 1, newMessage);
                  return true;
                }

                return (newMessage.id && (newMessage.id === message.id))
                || (newMessage.botMessageId && (newMessage.botMessageId === message.botMessageId))
                || newMessage.text === message.text
              })
          })


          if (!onlyNewMessages.length) {
            this.requestTimeout= setTimeout(this.getUpdates, 2000);
            return
          };

          this.threadMessages.push(...onlyNewMessages);
        }).catch(error => {
          this.requestTimeout= setTimeout(this.getUpdates, 2000);
        })
      },

      deleteFile(fileIndex) {
        this.media.splice(fileIndex, 1);
      },

      getAudience(beforeQuery) {
        const { query } = this.$route;
        const subscribed = this.subscribed(beforeQuery)
        const { currentAccount, status, filters , paging, infinityPageObserver } = this;

        if (!currentAccount) return;

        if (paging.page === 1) {
          this.audienceLoading = true;
        }

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/list/ig_account/${ currentAccount.id }/${ status }`,
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
          const { threadList, paging } = data.response.body

          if (paging.page > 10) {
            this.allThreads.splice(0, paging.perPage)

            this.allThreads = this.allThreads.concat(threadList);
          } else if (paging.page === 1) {
            this.allThreads = threadList;
          } else {
            this.allThreads = this.allThreads.concat(threadList);
          }

          this.paging = paging
          this.audienceLoading = false;

          if (paging.page !== paging.totalPageCount) {

            this.$nextTick(() => {
              const { threads } = this.$refs;

              if (!threads || !threads.length) return;

              const last5ThreadEl = threads[threads.length - 5].$el;

              if (paging.page > 10) {
                const threadRect = last5ThreadEl.getBoundingClientRect()
                const { threadScroll } = this.$refs

                threadScroll.scrollTop = threadScroll.scrollTop - threadRect.height * paging.perPage;
              }

              infinityPageObserver.observe(last5ThreadEl);
            })
          }
        })
      },

      routeUpdate(to, from, next) {
        const { query } = to;

        this.inUpdate = true;

        this.source.cancel('Cancel on turn on other user');

        this.lastMessage = {};
        this.threadMessages = null;
        this.contactProfile = null;
        this.filters.usernameQuery = query.q || ''
        this.paging.page = query.p || 1

        if (query.sub === 'ignored') {
          this.filters.categories = []
        }

        this.filters.favoured = query.sub === 'favorites' || null;

        if (to.params.threadId) {
          this.getUpdates(to.params.threadId);
        } else {
          this.getAudience(query)
        }

        // this.inUpdate = false;

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
      },

      conversationEndReason(message) {
        if (message.type !== 'conversation_end') return '';

        switch (message.body.conversation.closeState) {
          case '1':
            return 'Reason: On going'
            break;
          case '2':
            return 'Reason: End reached'
            break;
          case '3':
            return 'Reason: Overdue'
            break;
          case '4':
            return 'Reason: Overlapped'
            break;
          case '5':
            return 'Reason: Broadcst'
            break;
          case '6':
            return 'Reason: Archived'
            break;
          case '7':
            return 'Reason: Canceled by custom message'
            break;
          case '8':
            return 'Reason: Stop word'
            break;
          case '9':
            return 'Reason: Profile not found'
            break;
          default:
            return ''
            break;
        }
      },

      forceResumeConversation(message) {
        Vue.set(message, 'sent', true);

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/resume-conversation/${ message.body.conversation.id }`,
        }).then(() => {
        }).catch(() => {
          Vue.set(message, 'sent', false);
        })
      },

      recheckCampaigns() {
        const { currentThread, accountId } = this;

        Vue.set(currentThread, 'campaignsRechecked', true);

        axios({
          url: `${ dh.apiUrl }/api/1.0.0/${ dh.userName }/thread/recheck-campaigns`,
          method: 'post',
          data: {
            accountId,
            threadIdList: [currentThread.id]
          }
        }).then(()=> {
        })
      },

      setPage(pageNumber) {
        const { paging } = this;

        paging.page = pageNumber || paging.page + 1;

        this.getAudience();
      }
    },

    created() {
      if (this.threadMessages && this.$store.state.currentAccount) return;

      this.infinityPageObserver = new IntersectionObserver((entries, observer) => {
        const { threads } = this.$refs;

        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          this.setPage();

          observer.unobserve(entry.target);
        })
      })

      this.getAudience();
      this.getUpdates();
    },

    beforeDestroy() {
      clearTimeout(this.requestTimeout)
    },

    watch: {
      threadMessages(value) {
        this.$nextTick(() => {
          const { threadId } = this.$route.params
          const { reverseThreadMessages } = this;
          const { threadMessages } = this.$refs;

          if (!value) return;

          this.lastMessage = reverseThreadMessages.find(message => message.igItemId) || {};


          if (this.allThreads) {
            const thread = this.allThreads.find(thread => thread.id == threadId);

            if (thread) {
              thread.lastMessage = reverseThreadMessages.find(message => !(message.type || '').includes('conversation')) || {};
            }
          }

          this.requestTimeout= setTimeout(this.getUpdates, 2000);

          threadMessages.scrollTop = threadMessages.scrollHeight;
        });
      },

      '$store.state.currentAccount'() {
        if (this.threadMessages) return;

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
          const { getAudience, inUpdate } = this;

          if (inUpdate) {
            this.inUpdate = false;
            return;
          }

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

    .dh-search-filter-active {
      color: $elementActiveColor
    }

    .dh-accounts {
      border-right: 1px solid $secondBorderColor;
      width: 262px;
      flex-shrink: 0;
      position: relative;
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
      position: relative;
    }

    .dh-accounts-up {
      position: absolute;
      top: 125px;
      color: #778CA2;
      width: 25px;
      height: 25px;
      right: 20px;
      cursor: pointer;

      svg {
        width: 100% !important;
        height: 100% !important;
      }
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
        flex-shrink: 0;
        margin-right: 10px;
        color: $elementsColor;
        display: flex;
        align-items: center;
        justify-content: center;

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
      text-overflow: ellipsis;
      overflow: hidden;
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
      justify-content: flex-end;
    }

    .dh-messages-list {
      overflow: auto;
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

    .dh-conversation-divider {
      display: flex;
      justify-content: center;
      margin: 15px 0;
      position: relative;

      &::before {
        content: '';
        border-top: 1px dashed #F2F4F6;
        width: 95%;
        position: absolute;
        top: 50%;
      }
      & > div {
        background-color: #F2F4F6;
        padding: 5px 20px;
        border-radius: 27px;
        font-size: 10px;
        text-transform: uppercase;
        color: #778CA2;
        z-index: 1;
      }

      a {
        text-decoration: none;
        font-weight: bold;
        color: #778CA2;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .dh-force-resume-button {
      display: inline-block;
      background-color: $elementActiveColor;
      padding: 0 10px;
      margin-left: 10px;
      font-size: 10px;
      color: #fff;
      border-radius: 12px;
      cursor: pointer;
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
      text-decoration: none;
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
      flex-grow: 1;

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

    .dh-is-selected {
      .el-select .el-input__inner {
        color: $elementActiveColor
      }

      & > span {
        color: $elementActiveColor
      }
    }
  }
</style>

