<template>
  <div class="dh-view dh-dashboard-view">
    <dh-header title="Dashboard"></dh-header>
    <div class="dh-view-content">
      <div class="dh-ig-account" v-if="currentAccount">
        <div class="dh-ig-account-userpic" :style="{'background-image': `url(${ currentAccount.profilePicUrl  })`}">
        </div>
        <div class="dh-ig-account-info">
          <div class="dh-ig-account-main">
            <div class="dh-ig-account-name">{{ currentAccount.login }}</div>
            <div class="dh-ig-account-data">
              <span><strong>{{ currentAccount.postCount || 0 }}</strong> posts</span>
              <span><strong>{{ currentAccount.followerCount || 0 }}</strong> followers</span>
              <span><strong>{{ currentAccount.followingCount || 0 }}</strong> following</span>
            </div>
          </div>
          <div class="dh-ig-account-bio" v-html="currentAccount.bio && currentAccount.bio.replace(/\n/g, '<br>')">
          </div>
        </div>
      </div>
      <div class="dh-dashboard-title">
        Stats
      </div>
      <div class="dh-dashboard-analytics">
        <el-tabs class="dh-tab" v-model="activeTab" @tab-click="onTabClick">
          <el-tab-pane class="dh-tab-pane" :label="tabs.Messages.name" :name="tabs.Messages.name">
            <div class="dh-tab-content dh-messages">
              <dhRangePicker
                :fromto="messagesAtStore"
                :default="messagesAt"
                :granularity="true"
                @change="(range, granularity) => getMessagesRates(range, granularity, true)"
              />
              <dhAccountChart
                :columns="messagesColumnsStore"
                :ref="tabs.Messages.name"
                :options="messagesOptions"
                :fetching="tabs.Messages.fetching"
                @refresh="() => {
                  getMessagesRates(messagesAt, granularity);
                }"
                :syncTimeEnd="syncTime.messagesEnd"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Followers.name" :name="tabs.Followers.name">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
              <div class="dh-dashboard-analytics-item dh-inform">
                <div class="dh-analytics-item-info" >
                  <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': followerCountProgress > 0 }" v-if="analyticInfo && analyticInfo.followerCount">
                    {{deltaFollowerCount.toLocaleString()}}
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="followerCountProgress">
                      <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                    </svg>
                  </div>
                  </div>
                  <div class="dh-analytics-item-graph">
                    <dhAccountChart
                      :columns="followersColumnsStore"
                      :options="simpleChartOptions('#9E4CF9')"
                      :ref="tabs.Followers.name"
                      :fetching="tabs.Followers.fetching"
                      @refresh="getAnalyticInfo"
                      :syncTimeEnd="syncTime.analyticEnd"
                    />
                    <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': followerCountProgress > 0 }" v-if="analyticInfo && followerCountProgress">
                      {{followerCountProgress.toFixed(2)}}%
                    </div>
                  </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Likes.name" :name="tabs.Likes.name">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
              <div class="dh-dashboard-analytics-item dh-inform">
                <div class="dh-analytics-item-info">
                  <div :class="{'dh-analytics-item-value': true,'dh-analytics-success': likeCountProgress > 0 }" v-if="analyticInfo && analyticInfo.likeCount">
                    {{deltaLikeCount.toLocaleString()}}
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="likeCountProgress">
                      <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <div class="dh-analytics-item-graph">
                  <dhAccountChart
                    :columns="likesColumnsStore"
                    :options="simpleChartOptions('#6DD230')"
                    :fetching="tabs.Likes.fetching"
                    :ref="tabs.Likes.name"
                    @refresh="getAnalyticInfo"
                    :syncTimeEnd="syncTime.analyticEnd"
                  />
                  <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': likeCountProgress > 0 }" v-if="analyticInfo && likeCountProgress">
                    {{likeCountProgress.toFixed(2)}}%
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane class="dh-tab-pane" :label="tabs.Comments.name" :name="tabs.Comments.name">
            <div class="dh-tab-content">
              <!-- <dhRangePicker // Disabled until api 2.0 will not be released
                :fromto="messagesAt"
                :onChange="(dates) => console.log(dates)"
              /> -->
              <div class="dh-dashboard-analytics-item">
                <div class="dh-analytics-item-info">
                  <div  :class="{'dh-analytics-item-value': true, 'dh-analytics-success': commentCountProgress > 0 }" v-if="analyticInfo && analyticInfo.commentCount">
                    {{deltaCommentCount.toLocaleString()}}
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="commentCountProgress">
                      <path d="M4 0.0625L4.375 0.40625L7.375 3.40625L6.625 4.125L4.5 1.96875V12H3.5V1.96875L1.375 4.125L0.625 3.40625L3.625 0.40625L4 0.0625Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <div class="dh-analytics-item-graph">
                  <dhAccountChart
                    :columns="commentsColumnsStore"
                    :options="simpleChartOptions('#FFAB2B')"
                    :fetching="tabs.Comments.fetching"
                    :ref="tabs.Comments.name"
                    @refresh="getAnalyticInfo"
                    :syncTimeEnd="syncTime.analyticEnd"
                  />
                  <div :class="{'dh-analytics-item-profit': true, 'dh-analytics-success': commentCountProgress > 0 }" v-if="analyticInfo && commentCountProgress">
                    {{commentCountProgress.toFixed(2)}}%
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <dh-campaigns title="Campaigns" :limit="5">
      </dh-campaigns>
    </div>
    <dh-footer></dh-footer>
  </div>
</template>

<script>
import dhHeader from '../components/dh-header'
import dhFooter from '../components/dh-footer'
import dhCampaigns from '../components/dh-campaigns'
import moment from 'moment'
import axios from 'axios'
import dhAccountChart from "../components/dh-account-chart.vue";
import dhRangePicker from "../components/dh-range-picker";
import loader from "../components/dh-loader";
import utils from "../../oldJS/utils";

export default {
  beforeRouteEnter(to, from, next) {
    next(dashboard => {
      dashboard.refreshAnalytics();
    })
  },

  data() {
    const names = ["Messages", "Followers", "Likes", "Comments", "Sent", "Seen", "Replied"]
    const tabs = names.reduce((acc, next) => {
      acc[next] = {
        name: next,
        columns: null,
        fetching: false
      }

      return acc;
    }, {});
    return {
      tabs: tabs,
      options: {
        month: 2592000,
        day: 86400,
        hour: 3600
      },
      activeTab: "Messages",
      granularity: 86400,
      messagesAt: [new Date(moment().subtract(7, "days")), new Date()],
      interval: [],
      syncTime: {
        messages: null,
        messagesEnd: null,
        analytic: null,
        analyticEnd: null
      }
    };
  },

  components: {
    dhHeader,
    dhFooter,
    dhCampaigns,
    loader,
    dhAccountChart,
    dhRangePicker
  },

  computed: {
    accountStatistics() {
      const { accountStatistics } = this.$store.state;
      const { currentAccount } = this;
      if (!currentAccount) {
        return null;
      }

      if (accountStatistics.hasOwnProperty(currentAccount.id)) {
        return accountStatistics[currentAccount.id];
      }

      return null;
    },

    analyticsStoreKey() {
      const { tabs } = this;
      return `${tabs.Followers.name}_${tabs.Likes.name}_${tabs.Comments.name}`;
    },

    messagesAtStore() {
      const { tabs, accountStatistics, messagesAt } = this;
      if (accountStatistics) {
        const { Messages } = accountStatistics;
        if (Messages) {
          return Messages.range;
        }
      }

      return messagesAt;
    },

    messagesColumnsStore() {
      const { tabs, accountStatistics } = this;
      if (accountStatistics) {
        const { Messages } = accountStatistics;
        if (Messages) {
          return Messages.columns;
        }
      }

      return null;
    },

    baseAnalyticsColumnsStore() {
      const { accountStatistics, analyticsStoreKey } = this;
      if (accountStatistics) {
        return accountStatistics[analyticsStoreKey];
      }

      return null;
    },

    analyticInfo() {
      const { baseAnalyticsColumnsStore } = this;
      if (baseAnalyticsColumnsStore) {
        return baseAnalyticsColumnsStore.analyticInfo;
      }

      return null;
    },

    commentsColumnsStore() {
      const { baseAnalyticsColumnsStore } = this;
      if (baseAnalyticsColumnsStore) {
        const [ Followers, Likes, Comments ] = baseAnalyticsColumnsStore.columns;
        if (Comments) {
          return Comments;
        }
      }

      return null;
    },

    likesColumnsStore() {
      const { baseAnalyticsColumnsStore } = this;
      if (baseAnalyticsColumnsStore) {
        const [ Followers, Likes, Comments ] = baseAnalyticsColumnsStore.columns;
        if (Likes) {
          return Likes;
        }
      }

      return null;
    },

    followersColumnsStore() {
      const { baseAnalyticsColumnsStore } = this;
      if (baseAnalyticsColumnsStore) {
        const [ Followers, Likes, Comments ] = baseAnalyticsColumnsStore.columns;
        if (Followers) {
          return Followers;
        }
      }

      return null;
    },

    hasThreeDays() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount) return

      return followerCount.length > 3;
    },

    deltaFollowerCount() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount) return 0;

      return Math.floor(followerCount[followerCount.length - 1].value - followerCount[0].value)
    },

    followerCountProgress() {
      const { followerCount } = this.analyticInfo;

      if (!followerCount || !followerCount.length) return;

      const lastElement = followerCount[followerCount.length - 1];
      const { deltaFollowerCount }= this;

      return deltaFollowerCount * 100 / lastElement.value
    },

    deltaLikeCount() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount) return 0;

      return likeCount[likeCount.length - 1].value - likeCount[0].value
    },

    likeCountProgress() {
      const { likeCount } = this.analyticInfo;

      if (!likeCount || !likeCount.length) return;

      const lastElement = likeCount[likeCount.length - 1];
      const { deltaLikeCount } = this;

      return deltaLikeCount * 100 / lastElement.value
    },

    deltaCommentCount() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount) return 0;

      return commentCount[commentCount.length - 1].value - commentCount[0].value
    },

    commentCountProgress() {
      const { commentCount } = this.analyticInfo;

      if (!commentCount || !commentCount.length) return;

      const lastElement = commentCount[commentCount.length - 1];
      const { deltaCommentCount } = this;

      return deltaCommentCount * 100 / lastElement.value
    },

    messagesOptions() {
      const { options, tabs } = this;
      const self = this;
      return {
        data: {
          x: "x"
        },
        tooltip: {
          format: {
            value(value, ratio, id, index) {
              if (id !== self.tabs.Sent.name && self.messagesColumnsStore) {
                const sentSet = self.messagesColumnsStore.find(c => c && c.length && c[0] === self.tabs.Sent.name);
                if (sentSet) {
                  const sentValue = sentSet.slice(1)[index];
                  const percent = (100 * value / sentValue).toFixed(2);
                  if (Number.isNaN(percent) || percent === "NaN") {
                    return value;
                  }
                  return `${value} - ${percent}%`;
                }
              }

              return value;
            }
          }
        },
        color: {
          pattern: ['#9E4CF9', '#6DD230', '#FFAB2B']
        },
        axis: {
          x: {
            tick: {
              format: function(e) {
                  const { granularity } = self;
                  switch (granularity) {
                    case options.hour: {
                      return moment(e).format("MM-DD hh:mm A");
                    }
                    case options.day: {
                      return moment(e).format("MM-DD");
                    }
                    case options.month: {
                      return moment(e).format("YYYY-MM");
                    }
                  }

                  return moment(e).format("YYYY-MM-DD");
              }
            }
          }
        }
      }
    }
  },

  methods: {
    onTabClick(tab) {
      const { name } = tab;
      const wrapper = this.$refs[name];
      if (wrapper) {
        const { chart } = wrapper.$refs;
        if (chart) {
          chart.resize();
        }
      }
    },

    simpleChartOptions(color) {
      return {
        data: {
          x: "x"
        },
        color: {
          pattern: [color]
        }
      }
    },

    isActualData(syncTimeItem) {
      const now = new Date();
      const syncTimeItemEnd = `${syncTimeItem}End`;
      if (this.syncTime[syncTimeItem]) {
        const diff = Math.abs(moment(this.syncTime[syncTimeItem]).diff(now, 'seconds'));
        if (diff <= 5) {
          this.syncTime[syncTimeItemEnd] = (5 - diff);
          return true;
        }
      }
      this.syncTime[syncTimeItem] = now;
      this.syncTime[syncTimeItemEnd] = null;
      return false;
    },

    getMessagesRates(interval, granularity, force) {
      const { currentAccount,
              tabs,
              isActualData,
              options,
              $store
            } = this;

      if (!force && isActualData("messages")) {
        return;
      }
      
      tabs.Messages.fetching = true;
      tabs.Messages.columns = [];
      this.granularity = granularity;
      const [begin, end] = interval;
      const appendDate = (prefix, source) => {
        return [prefix].concat(source.map(c => moment(c.dateTime).toDate()));
      }
      const appendValue = (prefix, source) => {
        return [prefix].concat(source.map(c => c.value));
      }

      const datesFiller = utils.fillDates(begin, end, granularity);
      axios({
        url: `${dh.apiUrl}/api/1.0.0/${dh.userName}/message_rates/report`,
        params: {
          igAccountId: currentAccount.id,
          granularity: granularity,
          dateTimeSince: moment(begin).toISOString(),
          dateTimeTill: moment(end).toISOString()
        }
      }).then(({ data }) => {
        const { sent, seen, replied } = data.response.body;

        tabs.Messages.refreshable = true;
        const columns = [];
        columns.push(["x"].concat(datesFiller.Dates().map(d => moment(d).toDate())));
        if (sent) {
          columns.push(appendValue(tabs.Sent.name, datesFiller.Fill(sent)));
        }

        if (seen) {
          columns.push(appendValue(tabs.Seen.name, datesFiller.Fill(seen)));
        }

        if (replied) {
          columns.push(appendValue(tabs.Replied.name, datesFiller.Fill(replied)));
        }

        tabs.Messages.columns = columns;
      }).catch(err => {
        tabs.Messages.columns = null;
      }).finally(() => {
        tabs.Messages.fetching = false;
        this.$store.commit('saveStatistics', {
          [tabs.Messages.name]: {
            range: [begin, end],
            granularity: granularity,
            columns: tabs.Messages.columns
          }
        });
      });
    },

    getAnalyticInfo() {
      const { followersGraph,
              likeGraph,
              commentGraph,
              currentAccount,
              isActualData,
              tabs,
              analyticsStoreKey,
              $store } = this;
      let analyticInfo = null;
      if (isActualData("analytic")) {
        return;
      }

      ["Followers", "Likes", "Comments"].forEach(t => {
        tabs[t].fetching = true;
      });
      
      axios({
        url: 'https://igwm.directheroes.com/api/v1/account/short-report',
        params: {
          username: currentAccount.login
        }
      }).then(({ data }) => {
        ["Followers", "Likes", "Comments"].forEach(t => {
          const tab = tabs[t];
          tab.columns = [];
          tab.fetching = false;
        });
        analyticInfo = data.reports;
        let { followerCount, likeCount, commentCount } = analyticInfo;
        const checkValues = (accumulator, currentValue, index) => {
          const { value } = currentValue;
          const prevValue = accumulator[index - 1];
          currentValue.value = [-1, '-1', null].includes(value) ? ((prevValue && prevValue.value) || 0) : value;

          accumulator.push(currentValue);

          return accumulator;
        }
        const calcValues = (item, index, array) => {
          if (!index) return 0;

          return (item.value - array[0].value).toFixed(0);
        }

        followerCount = followerCount && followerCount.reduce(checkValues, []);
        likeCount = likeCount && likeCount.reduce(checkValues, []);
        commentCount = commentCount && commentCount.reduce(checkValues, []);

        if ( !followerCount && !likeCount && !commentCount) return;
        if (followerCount) {
          tabs.Followers.fetching = false;
          tabs.Followers.columns = [
            ["x"].concat(
              followerCount.map(followerItem =>
                moment(followerItem.time).toDate()
              )
            ),
            [tabs.Followers.name].concat(followerCount.map(calcValues))
          ];
        }
        if (likeCount) {
          tabs.Likes.fetching = false;
          tabs.Likes.columns = [
              ["x"].concat(
                likeCount.map(likeItem => moment(likeItem.time).toDate())
              ),
              [tabs.Likes.name].concat(likeCount.map(calcValues))
          ]
        }
        if (commentCount) {
          tabs.Comments.fetching = false;
          tabs.Comments.columns = [
            ["x"].concat(
              commentCount.map(commentItem =>
                moment(commentItem.time).toDate()
              )
            ),
            [tabs.Comments.name].concat(commentCount.map(calcValues))
          ]
        }
      }).catch(() => {
        ["Followers", "Likes", "Comments"].forEach(t => {
          const tab = tabs[t];
          tab.columns = null;
          tab.fetching = false;
        });
      }).finally(() => {
        this.$store.commit('saveStatistics', {
          [analyticsStoreKey]: {
            analyticInfo,
            columns: [
              tabs.Followers.columns,
              tabs.Likes.columns,
              tabs.Comments.columns,
            ]
          }
        });
      });
    },

    refreshAnalytics() {
      const {
        $nextTick,
        currentAccount,
        getMessagesRates,
        getAnalyticInfo,
        messagesAt,
        granularity,
        accountStatistics,
        $store,
        tabs,
        analyticsStoreKey
      } = this;

      if (!currentAccount) return;
      if (accountStatistics) {
        const messagesStore = accountStatistics[tabs.Messages.name];
        const analyticsStore = accountStatistics[analyticsStoreKey];
        if (messagesStore) {
          const { columns } = messagesStore;
          if (!columns) {
            $$nextTick(() => {
              getMessagesRates(messagesAt, granularity);
            })
          }
        }
        if (analyticsStore) {
          const { columns, analyticInfo } = analyticsStore;
          if (!columns || !analyticInfo) {
            $$nextTick(() => {
              getAnalyticInfo();
            })
          }
        }
      } else {
        $nextTick(() => {
          getMessagesRates(messagesAt, granularity);
          getAnalyticInfo();
        })
      }
    }
  },

  watch: {
    currentAccount(value) {
      const { refreshAnalytics, _isMounted } = this;

      if (!value || !_isMounted) return;

      refreshAnalytics();
    }
  }
}
</script>

<style lang="scss">
.dh-dashboard-view {
  .dh-campaigns {
    margin-top: 46px;
  }

  .dh-dashboard-title {
    font-size: 18px;
    line-height: 22px;
    margin-top: 46px;
    color: #778CA2;
  }

  .dh-dashboard-analytics {
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    margin-top: 24px;

    .dh-tab-content:not(.dh-messages) {
      .dh-chart-wrapper {
        border: unset;
      }
    }
  }

  .dh-chart-item {
    height: 160px;

    path.domain {
      stroke: #778ca2;
    }

    g.c3-axis.c3-axis-x {
      fill: #98a9bc;
    }
  }

  .dh-dashboard-analytics-item {
    margin-top: 22px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E8ECEF;
    display: flex;
    padding: 0 10px;

    .dh-analytics-item-info {
      margin: 0 16px;
      font-size: 19px;
      align-self: center;
      width: 100px;
      flex: 0 1 100px;
    }

    .dh-analytics-item-graph {
        position: relative;
        width: calc(100% - 100px);

        &.dh-full-chart {
          width: 100%;
        }
    }

    .dh-analytics-item-value {
      white-space: nowrap;

      svg {
        display: inline-block;
        margin-bottom: 2px;
        color: #FE4D97;
        transform: rotate(180deg)
      }

      &.dh-analytics-success {
        svg {
          display: inline-block;
          color: #6DD230;
          transform: rotate(0)
        }
      }
    }

    .dh-analytics-item-title {
      font-size: 14px;
      color: #98A9BC;
      margin-top: 7px;
    }

    .dh-analytics-item-profit {
      color: #FE4D97;
      position: absolute;
      bottom: 60px;
      right: 25px;
      font-weight: 500;

      &.dh-analytics-success {
        color: #6DD230;

        &:before {
          content: '+';
        }
      }
    }

    .c3-line {
      stroke-width: 3px;
    }

    .c3-chart {
      clip-path: unset !important;
    }
  }
}
</style>